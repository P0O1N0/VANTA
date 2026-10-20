# VANTA — Performance Engineering & Optimization Guide

**Target Hardware Profile:**  
- RAM: 8 GB DDR3/DDR4  
- CPU: Intel Core i5 (4th Gen+) / AMD Ryzen 3 (Quad-Core 2.0 GHz)  
- GPU: Intel HD Graphics 4000 / 620 / AMD Radeon Vega (Entry-level Integrated)  
- Display: 1366×768 up to 4K High-DPI  

---

## 1. Algorithmic Complexity and Optimization Strategies

### 1.1 Particle Life Optimization
- **Problem:** Naive particle interaction evaluates all pairs:
  $$\text{Comparisons} = \frac{N(N - 1)}{2} \in O(N^2)$$
  For $N = 3,000$, this requires $4,498,500$ distance and force calculations per timestep.
- **Solution in VANTA:**
  - **Uniform Grid Spatial Partitioning:** The simulation bounding box is subdivided into a 2D grid with cell size equal to the maximum interaction radius $r_{max}$.
  - Particles are assigned to grid cells using fast integer division.
  - Interaction loops only query adjacent $3 \times 3$ grid cells.
  - Complexity drops from $O(N^2)$ to $O(N \cdot k)$ where $k$ is the average number of particles within the local neighborhood ($k \ll N$).
  - Vectorized distance computation using contiguous NumPy 2D array blocks.

### 1.2 Physarum (Slime Mold) Optimization
- **Agent Sampling:** Agents sample the trail map at 3 distinct sensor locations (forward, left, right).
  - Floating-point coordinates $(x_s, y_s)$ are converted to integer indices using fast modular arithmetic for toroidal boundaries.
  - Sensor readings are extracted in batched NumPy indexing: `trail_map[y_indices, x_indices]`.
- **Diffusion & Decay:**
  - The trail map diffusion is computed using separated 1D box or Gaussian convolution or 2D slice stencil updates:
    $$T_{blur} = 0.6 \cdot T + 0.1 \cdot (T_{up} + T_{down} + T_{left} + T_{right})$$
  - Computed in a single vectorized NumPy operation without memory reallocation by swapping ping-pong buffers.

### 1.3 Flow Field Optimization
- **Vector Field Grid:** Rather than computing Perlin/Simplex noise trigonometry for $N = 5,000$ particles each frame, the vector field is pre-rasterized to a coarse grid (e.g. $128 \times 128$).
- **Bilinear Field Sampling:** Particles sample velocity vectors from the coarse grid using fast bilinear interpolation or cell lookup.
- **Particle Lifespan Cycling:** Dead particles are respawned into active memory slices without array resizing or allocation.

### 1.4 Gray-Scott Reaction-Diffusion Optimization
- **Isotropic 9-Point Laplacian:** Evaluated via periodic NumPy array slice indexing:
  $$\nabla^2 A = -A + 0.2(A_{N} + A_{S} + A_{E} + A_{W}) + 0.05(A_{NE} + A_{NW} + A_{SE} + A_{SW})$$
- **Multi-Stepping:** The numerical integration runs 4 to 8 substeps per visual frame with fixed $\Delta t = 1.0$. This decouples simulation propagation speed from display refresh rate.

---

## 2. Memory Management and Garbage Collection

1. **Pre-Allocated Contiguous Buffers:**
   All particle positions (`np.float32`), velocities (`np.float32`), colors (`np.uint8`), and trail textures are allocated once during `initialize()` or resizing.
2. **Ping-Pong Buffer Strategy:**
   Diffusion fields swap pointers (`buffer_a, buffer_b = buffer_b, buffer_a`) to prevent per-frame memory allocation and eliminate Python GC pauses.
3. **No Heavy Work in the UI Thread:**
   Simulation updates and offscreen render exports are structured to maintain responsive UI event dispatching and fluid slider feedback.

---

## 3. Quality Profiles Matrix

| Parameter / Metric | Lite Mode | Balanced Mode (Default) | High Mode |
| :--- | :--- | :--- | :--- |
| **Particle Life Count** | 600 particles | 1,500 particles | 3,500 particles |
| **Physarum Agents** | 2,000 agents | 6,000 agents | 15,000 agents |
| **Flow Field Particles** | 1,500 particles | 4,000 particles | 10,000 particles |
| **Reaction-Diffusion Grid** | $160 \times 120$ | $240 \times 180$ | $320 \times 240$ |
| **Trail Persistence** | Fast fade (0.85) | Smooth fade (0.95) | Long fade (0.98) |
| **Target Frame Rate** | 60 FPS | 60 FPS | 45-60 FPS |
| **Estimated Memory** | ~120 MB | ~180 MB | ~280 MB |

---

## 4. Benchmark Verification

A dedicated benchmark script (`scripts/benchmark.py`) is provided in the repository to measure:
- Updates per second (UPS) for each of the four simulation engines.
- Memory consumption across quality profiles.
- Rendering frame delivery rate.

To run the benchmark suite:
```bash
python scripts/benchmark.py --quality balanced --duration 3.0
```
