# VANTA — Interactive User Guide & Simulation Operations Manual

**Project:** VANTA — Generative Life Studio  
**Creator:** P O N ([@P0O1N0](https://github.com/P0O1N0))  
**Telegram:** [@P0O1N0](https://t.me/P0O1N0)

---

## 1. Studio Interface Overview

VANTA provides a unified, cinematic desktop and web interface engineered for real-time computational experimentation:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ [☰] VANTA STUDIO  │  Particle Life  │  [▶/⏸] [⏭] [↺] [🎲] [Speed 1.0x] [📷] [🔴] │
├───────────────┬─────────────────────────────────────────────┬───────────────┤
│               │                                             │  INSPECTOR    │
│  WORLDS       │                                             │  ─────────    │
│  DRAWER       │                                             │  Species: 6   │
│  (13 Worlds)  │              SIMULATION CANVAS              │  Radius: 90px │
│               │              (Interactive Viewport)         │  Friction:0.04│
│  [All]        │                                             │               │
│  [Biology]    │                                             │  ENVIRONMENT  │
│  [Physics]    │                                             │  Temp: 24°C   │
│  [Chaos]      │                                             │  Visc: 0.05   │
│               │                                             │  Zero-G       │
├───────────────┴─────────────────────────────────────────────┴───────────────┤
│ HUD: 60 FPS  │  Frame: 16.6ms  │  Entities: 3,000  │  Pos: (X: 720, Y: 450) │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Primary UI Zones:
1. **Top Floating Command Bar (`#topbar`)**:
   - **Hamburger Icon (`[☰]`)**: Opens the 13-world slide-out navigation drawer.
   - **Active World Title**: Displays the current universe name and physics archetype.
   - **Transport Controls**: Play/Pause (`Space`), Step Single Frame (`N`), Reset (`C`), Re-seed Random State (`R`).
   - **Speed Slider**: Real-time simulation time-dilation factor ($0.1\times$ to $5.0\times$).
   - **Capture Suite**: Instant 4K PNG export (`btn-export`) and 60 FPS WebM video recorder (`btn-record`).
   - **View Toggles**: Zen Mode (`Z`), Light/Dark Theme (`T`), and Presets Modal (`P`).

2. **Simulation Viewport (`#simCanvas`)**:
   - Hardware-accelerated Canvas 2D/WebGL viewport responding to resize, device pixel ratio scaling, and direct pointer physics.

3. **Slide-Out Worlds Drawer (`#worlds-drawer`)**:
   - Categorized directory of all 13 mathematical universes with live card badges, physics formulas, and archetype icons.

4. **Parameter Inspector (`#inspector`)**:
   - Real-time parameter sliders customized for the active simulation engine.
   - Global environmental physics modulators (Temperature, Oxygen, Viscosity, Gravity).

5. **Telemetry HUD (`#hud`)**:
   - Real-time diagnostic readouts: Current FPS, frame render latency (ms), entity count, and cursor coordinates.

---

## 2. Direct Pointer Interactions

Every simulation in VANTA reacts organically to pointer contact:

| Action | Primary Function | Secondary Function |
| :--- | :--- | :--- |
| **Left Click + Drag** | **Attraction / Perturbation**: Introduces a localized gravitational attractor, chemical source, or thermal seed. | Spawns entities or alters field density along the cursor path. |
| **Right Click + Drag** | **Repulsion / Shockwave**: Emanates a high-velocity repulsive field parting particles or scattering wavefronts. | Clears local lattice cells or dispels obstacles. |
| **Mouse Hover** | **Micro-Vorticity**: Triggers subtle aerodynamic drift or steering deflection. | Updates real-time coordinate telemetry on the HUD. |

---

## 3. Keyboard Shortcuts Reference

| Key | Action | Description |
| :--- | :--- | :--- |
| <kbd>Space</kbd> | **Play / Pause** | Toggles simulation stepping without clearing memory. |
| <kbd>N</kbd> | **Step Forward** | Advances the numerical solver by exactly one $\Delta t = 16.6\text{ ms}$ slice. |
| <kbd>C</kbd> | **Clear / Reset** | Resets the current universe to its initial conditions. |
| <kbd>R</kbd> | **Re-Seed** | Generates a new random cryptographic seed and mutates interaction matrices. |
| <kbd>M</kbd> / <kbd>Tab</kbd> | **Toggle Drawer** | Slides open or closes the 13 Worlds Navigation Drawer. |
| <kbd>P</kbd> | **Presets Modal** | Opens the curated preset catalog for instant parameter configurations. |
| <kbd>Z</kbd> | **Zen Mode** | Hides all UI chrome and controls for distraction-free ambient display. |
| <kbd>T</kbd> | **Toggle Theme** | Cycles between deep obsidian dark and crisp architectural light themes. |
| <kbd>Esc</kbd> | **Dismiss Overlays** | Closes active modals, drawers, or dialog windows. |

---

## 4. Parameter Tuning & Regimes

### Particle Life
- **Species Count**: 2 to 6 distinct particle archetypes with asymmetric attraction matrices.
- **Interaction Radius ($r_{\max}$)**: Maximum Euclidean horizon for non-local inter-particle forces (30px – 180px).
- **Stokes Drag ($\gamma$)**: Fluid damping factor. Low drag encourages perpetual chaotic orbital dances; high drag forms crystalline cellular clusters.

### Cosmic Gravity
- **Stellar Mass ($M$)**: Central black hole mass scale.
- **Plummer Softening ($\epsilon$)**: Minimum non-singular distance suppressing close-encounter gravitational singularities.
- **Gravitational Constant ($G$)**: Orbital acceleration velocity multiplier.

### Gray-Scott Reaction-Diffusion
- **Feed Rate ($F$)**: Continuous rate of substrate chemical replenishing ($0.010 - 0.090$).
- **Kill Rate ($k$)**: Rate of catalyst degradation ($0.045 - 0.070$).
  - *Mitotic Spots*: $F = 0.030, k = 0.062$
  - *Labyrinthine Skin*: $F = 0.038, k = 0.061$
  - *Soliton Rings*: $F = 0.014, k = 0.047$

### Quantum Wave Packet
- **Dispersion Speed**: Speed of phase propagation ($\hbar / 2m$).
- **Potential Barrier Height**: Scalar barrier potential inducing quantum reflection and evanescent tunneling.
- **Slit Geometry**: Single, double, and triple-slit configurations for Born probability interference.

### Thermal Convection
- **Rayleigh Buoyancy ($Ra$)**: Magnitude of thermal expansion force generating ascending hot plumes.
- **Fluid Viscosity ($\nu$)**: Resistance to momentum shear, controlling roll cell count and turbulence.

---

## 5. Capturing & Exporting Media

### High-Resolution PNG Snapshots
Clicking the **Export** button (`btn-export`) captures the live canvas at native device resolution:
- Automatically formats timestamped filenames: `VANTA_<engine>_<timestamp>.png`.
- Preserves full dynamic range, glowing particle trails, and alpha channels without UI chrome.

### Real-Time 60 FPS WebM Video Recording
Clicking **Record** (`btn-record`):
1. Initializes a hardware-accelerated MediaStream capturing directly from the canvas pipeline at 60 frames per second.
2. Encodes video in real-time utilizing the **VP9 / VP8** video codec.
3. While recording, the button pulses red with `Recording...` status.
4. Clicking again finalizes the container and triggers an instant download of the video file (`VANTA_<engine>_<timestamp>.webm`).
