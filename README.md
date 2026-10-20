# VANTA — Generative Life Studio

An interactive desktop and web studio for exploring artificial life, non-linear dynamics, and emergent physical phenomena through real-time mathematical simulation.

[![VANTA Overview](docs/screenshots/vanta-hero-overview.png)](docs/screenshots/vanta-hero-overview.png)

---

## Overview

VANTA is a real-time computational laboratory that unites continuous partial differential equations, discrete agent dynamics, particle physics, and cellular automata into a single interactive environment. Rather than rendering pre-calculated animations or static art, every pattern in VANTA emerges dynamically from underlying mathematical laws solved frame-by-frame on your hardware.

From the microscopic biogenesis of asymmetric particle species to the macroscopic spirals of relativistic stellar clusters and the wavepacket interference of quantum mechanics, VANTA lets you directly perturb parameters, inject forces, and observe how macroscopic order arises spontaneously from microscopic interactions.

### Why VANTA Was Built
Natural complexity often arises from surprisingly concise rules. Alan Turing showed how two diffusing chemical morphogens could produce animal coat patterns; Craig Reynolds demonstrated that three local steering rules could mimic a flock of thousands of birds; and asymmetric particle interactions can generate self-replicating, cell-like clusters without any genetic code.

VANTA was created to bring these disparate disciplines—theoretical physics, computational biology, non-linear chemistry, and creative coding—into a coherent, tactile studio where anyone can experiment with these phenomena in real time.

---

## Simulation Worlds Catalog

VANTA includes thirteen complete, fully interactive simulation engines across biological morphogenesis, astrophysical dynamics, and mathematical chaos:

| Universe | Archetype | Governing Mathematical Model | Key Emergent Behaviors |
| :--- | :--- | :--- | :--- |
| **Particle Life** | Primordial Biogenesis | Non-reciprocal force matrix $F(r, M_{\alpha\beta})$ | Cellular mitosis, predator-prey chases, symbiotic clusters |
| **Physarum Polycephalum** | Slime Mold Network | Jones multi-agent chemo-taxis & spatial diffusion | Efficient biological transport networks, Steiner tree routing |
| **Cosmic N-Body Gravity** | Astrophysical Dynamics | Newton-Plummer potential with Barnes-Hut quadtree | Accretion discs, Keplerian galactic arms, gravitational slingshots |
| **Boids Swarm Intelligence** | Collective Behavior | Reynolds triad (Separation, Alignment, Cohesion) | Murmuration waves, dynamic obstacle avoidance, flocking |
| **Quantum Wave Packet** | Quantum Mechanics | Time-dependent Schrödinger equation ($i\hbar \partial_t \psi = \hat{H}\psi$) | Double-slit diffraction, phase interference, barrier tunneling |
| **Dendritic Crystal Growth** | Phase-Field Solidification | Kobayashi anisotropic thermal phase-field equations | Six-fold symmetric snowflake branches, side-branching dendrites |
| **Curl-Noise Flow Field** | Incompressible Aerodynamics | Divergence-free vector potential ($\vec{v} = \nabla \times \vec{\Psi}$) | Mass-conserving turbulence, vortex filaments, fluid streamlines |
| **Gray-Scott Reaction-Diffusion** | Chemical Morphogenesis | Coupled cubic autocatalytic reaction-diffusion PDEs | Mitotic spots, labyrinthine skin patterns, propagating solitons |
| **Continuous Lenia** | Continuous Automata | Continuous kernel convolution $K * A$ and growth mapping $G$ | Smooth gliding solitons, organic breathing organisms, cellular motility |
| **Ferrofluid Dynamics** | Magnetic Hydrodynamics | Rosensweig normal-field surface tension instability | Spontaneous hexagonal magnetic spike lattices, magnetic levitation |
| **Fractal Growth (DLA)** | Stochastic Aggregation | Witten-Sander diffusion-limited aggregation | Scale-invariant fractal tree structures with dimension $D \approx 1.71$ |
| **Excitable Medium** | Non-Linear Waves | FitzHugh-Nagumo / Barkley activator-inhibitor system | Rotating spiral wave vortices, wavefront collisions, refractory tails |
| **Thermal Convection** | Fluid Mechanics | Incompressible Navier-Stokes with Oberbeck-Boussinesq | Rayleigh-Bénard counter-rotating roll cells, ascending mantle plumes |

---

## Visual Gallery

The images below are genuine captures taken directly from the running simulation studio at 1440×900 resolution:

| Quantum Wave Packet Interference | Physarum Vascular Foraging Network |
| :---: | :---: |
| [![Quantum Wave](docs/screenshots/vanta-quantum-wave.png)](docs/screenshots/vanta-quantum-wave.png) | [![Physarum](docs/screenshots/vanta-physarum.png)](docs/screenshots/vanta-physarum.png) |
| *Time-dependent Schrödinger wavepacket splitting through double-slit barrier* | *Single-celled slime mold synthesizing optimal transport paths between food sources* |

| Cosmic N-Body Gravity | Gray-Scott Reaction-Diffusion |
| :---: | :---: |
| [![Cosmic Gravity](docs/screenshots/vanta-cosmic-gravity.png)](docs/screenshots/vanta-cosmic-gravity.png) | [![Reaction-Diffusion](docs/screenshots/vanta-reaction-diffusion.png)](docs/screenshots/vanta-reaction-diffusion.png) |
| *Accretion disc and stellar cluster orbiting a gravitational singularity* | *Turing pattern formation generating self-replicating mitotic chemical spots* |

| Ferrofluid Magnetic Spikes | Rayleigh-Bénard Thermal Convection |
| :---: | :---: |
| [![Ferrofluid](docs/screenshots/vanta-ferrofluid.png)](docs/screenshots/vanta-ferrofluid.png) | [![Thermal Convection](docs/screenshots/vanta-thermal-convection.png)](docs/screenshots/vanta-thermal-convection.png) |
| *Surface spike lattice under vertical magnetic induction* | *Coupled thermal buoyancy and Navier-Stokes vorticity rolls* |

| Thirteen-Universe Archetype Drawer |
| :---: |
| [![Worlds Drawer](docs/screenshots/vanta-worlds-drawer.png)](docs/screenshots/vanta-worlds-drawer.png) |
| *Categorized slide-out universe catalog with real-time entity counts and physics formulas* |

---

## Key Features

- **Dual-Target Architecture**:
  - **Web Studio**: Pure, zero-dependency ES6+ and Canvas 2D/WebGL running offline in any modern browser at 60 FPS.
  - **Desktop Qt6**: Python PySide6 implementation with native OpenGL hardware acceleration and software rasterization fallbacks.
  - **Native Launcher**: A 6KB native Windows launcher executable (`VANTA.exe`) launching Edge/Chrome in dedicated application mode.
- **Direct Pointer Physics**:
  - Left-click introduces gravitational wells, chemical seeds, or thermal heat sources.
  - Right-click emanates high-velocity repulsive shockwaves.
  - Smooth kinetic cursor ring with micro-vorticity feedback.
- **Parametric Control Bus**:
  - Dynamic parameter inspector custom-tailored to each engine with real-time bidirectional binding.
  - Global environmental modifiers (viscosity, temperature, gravity, oxygen).
- **Curated Preset System**:
  - Instant one-click loading of stable, chaotic, and striking mathematical parameter configurations.
- **Export Suite**:
  - Instant 4K PNG snapshot captures with timestamped metadata.
  - Hardware-accelerated 60 FPS WebM video recording via native `MediaRecorder` / `canvas.captureStream(60)`.
- **Telemetry HUD**:
  - Live framerate, frame render latency in milliseconds, entity counters, and coordinate telemetry.
- **Bespoke Animated Startup Screen**:
  - A 4.0-second non-blocking intro featuring a living harmonic particle field, custom architectural SVG emblem, analog film grain noise filter, and live kinetic telemetry counter.

---

## Quick Start

### 1. Windows (One-Click Launch)
Double-click `VANTA.exe` in the root repository folder.
- Launches the complete studio in dedicated standalone window mode (`1440x920`).
- No Python installation or command-line setup required.
- Alternatively, run `run.bat` or `.\run.ps1`.

### 2. Browser (Cross-Platform)
Clone the repository and open `studio/index.html` directly in any modern browser:
```bash
git clone https://github.com/P0O1N0/VANTA.git
cd VANTA
# Windows:
start studio/index.html
# macOS:
open studio/index.html
# Linux:
xdg-open studio/index.html
```

### 3. Python & PySide6 Desktop Environment
For developers running or testing the Python codebase:
```bash
# Clone and setup environment
git clone https://github.com/P0O1N0/VANTA.git
cd VANTA

# Run automated Windows setup
setup.bat

# Or manual setup:
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Launch desktop application
python -m vanta.main

# Run test suite
pytest
```

---

## Interactive Controls

| Input | Action | Description |
| :--- | :--- | :--- |
| **Left Click + Drag** | **Attract / Inject** | Introduces gravity well, chemical seed, or thermal source |
| **Right Click + Drag** | **Repel / Shockwave** | Disperses particles or deflects wavefronts |
| <kbd>Space</kbd> | **Play / Pause** | Toggles simulation stepping without clearing state |
| <kbd>N</kbd> | **Step Frame** | Advances simulation by one 16.6ms timestep |
| <kbd>C</kbd> | **Reset** | Re-initializes active universe to default state |
| <kbd>R</kbd> | **Re-Seed** | Randomizes initial coordinates and interaction matrices |
| <kbd>M</kbd> / <kbd>Tab</kbd> | **Toggle Drawer** | Slides open or dismisses the 13-world catalog |
| <kbd>P</kbd> | **Presets Modal** | Opens the curated preset configurations |
| <kbd>Z</kbd> | **Zen Mode** | Hides all UI chrome for fullscreen visual display |
| <kbd>T</kbd> | **Toggle Theme** | Cycles between deep obsidian dark and crisp light themes |

---

## Documentation Suite

Detailed architectural, scientific, and operational manuals are available in the [`docs/`](docs/) directory:

- [**Scientific Foundations (`docs/SCIENCE.md`)**](docs/SCIENCE.md) — Comprehensive derivations, partial differential equations, and discretization stencils for all 13 simulation engines.
- [**System Architecture (`docs/ARCHITECTURE.md`)**](docs/ARCHITECTURE.md) — Dual-target architecture, event-loop coordination, Mermaid state diagrams, and memory layout.
- [**User Guide (`docs/USER_GUIDE.md`)**](docs/USER_GUIDE.md) — Complete operational manual, parameter explanation, and media export workflows.
- [**Installation Guide (`docs/INSTALLATION.md`)**](docs/INSTALLATION.md) — Step-by-step installation instructions across Windows, macOS, and Linux.
- [**Performance Engineering (`docs/PERFORMANCE.md`)**](docs/PERFORMANCE.md) — Spatial grid partitioning, typed array layout, and 60 FPS stabilization benchmarks.
- [**Developer Handbook (`docs/DEVELOPMENT.md`)**](docs/DEVELOPMENT.md) — Contributing guidelines, test execution, and instructions for authoring new simulation worlds.
- [**Research Review (`docs/RESEARCH_REVIEW.md`)**](docs/RESEARCH_REVIEW.md) — Academic references, foundational papers, and algorithmic bibliography.

---

## Engineering Quality & Verification

Every release of VANTA is verified through automated test suites:
- **Pytest Suite (`pytest`)**: 29 automated tests verifying numerical solvers, QPainter / OpenGL offscreen rendering, and state persistence.
- **Bundle Syntax Verifier (`python scripts/verify_bundle.py`)**: Validates bracket, parenthesis, and brace balancing across all 4,000+ lines of simulation code and ensures all 13 engine classes are properly registered.
- **Continuous Integration**: GitHub Actions workflow running on both Ubuntu and Windows across Python 3.11 and 3.12.

```bash
# Verify bundle integrity
python scripts/verify_bundle.py
# Output:
# Braces: 696 vs 696
# Parentheses: 1881 vs 1881
# Square brackets: 704 vs 704
# All 13 simulation worlds and classes verified successfully!
```

---

## Author & Attribution

VANTA was created and engineered by:

**P O N**  
- **GitHub:** [@P0O1N0](https://github.com/P0O1N0)  
- **Telegram:** [@P0O1N0](https://t.me/P0O1N0)  
- **Repository:** [github.com/P0O1N0/VANTA](https://github.com/P0O1N0/VANTA)

---

## License

This project is licensed under the **MIT License**. See the [`LICENSE`](LICENSE) file for complete terms and copyright notices.
