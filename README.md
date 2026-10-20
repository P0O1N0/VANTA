# VANTA — Generative Life Studio

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python: 3.10+](https://img.shields.io/badge/Python-3.10%20%7C%203.11%20%7C%203.12-blue)](https://www.python.org/)
[![GUI: PySide6](https://img.shields.io/badge/GUI-PySide6%20(Qt%206.8)-green)](https://www.qt.io/)
[![Acceleration: NumPy & SciPy](https://img.shields.io/badge/Compute-NumPy%20%26%20SciPy-orange)](https://numpy.org/)
[![Platform: Windows / Linux / macOS](https://img.shields.io/badge/Platform-Windows%20%7C%20Linux%20%7C%20macOS-lightgrey)](#system-requirements)

**VANTA** is a polished, offline-first desktop studio for generative art, artificial life, and interactive mathematical simulations. It transforms your computer into a living digital universe where emergent behaviors evolve in real-time according to scientifically inspired simulation laws.

Designed from the ground up for creative coders, generative artists, simulation researchers, and enthusiasts, VANTA requires **no internet connection, no user accounts, no subscriptions, and no cloud backends**.

---

## Visual Showcase

| Particle Life (Multi-Species Ecosystem) | Physarum Polycephalum (Slime Mold) |
| :---: | :---: |
| ![Particle Life](assets/branding/particle_life_preview.png) | ![Physarum](assets/branding/physarum_preview.png) |
| **Procedural Curl-Noise Flow Field** | **Gray-Scott Reaction-Diffusion** |
| ![Flow Field](assets/branding/flow_field_preview.png) | ![Reaction-Diffusion](assets/branding/reaction_diffusion_preview.png) |

---

## Key Features

### 1. Four Genuinely Functional Simulation Engines
- **Engine A — Particle Life:** Continuous-space multi-species particle ecosystem. Features an interactive $N \times N$ force matrix, attractive and repulsive distance curves, toroidal/bounce boundary physics, and uniform grid spatial partitioning for high particle throughput.
- **Engine B — Physarum (Slime Mold):** Agent-based emergent biological network based on Jeff Jones' sensory-motor model. Agents sense chemical trail gradients, steer toward chemoattractants, deposit signals, and induce self-organizing vein structures with 2D diffusion and decay.
- **Engine C — Flow Field:** Procedural divergence-free curl-noise vector field generating smooth, organic, fluid-like particle ribbons with velocity-mapped color ramps and interactive mouse-injected vortices.
- **Engine D — Reaction-Diffusion:** Gray-Scott chemical morphogenesis partial differential equation (PDE) solver using an isotropic 9-point discrete Laplacian stencil. Generates Pearson corals, dividing cellular mitosis, moving solitons, and labyrinthine spirals.

### 2. Dual Rendering Pipeline
- **Hardware-Accelerated OpenGL Renderer:** Direct `QOpenGLWidget` integration with point sprite batching and textured quads for high frame rates on modern GPUs.
- **Robust CPU Software Rasterizer:** Clean `QPainter` with memory-mapped `QImage` buffers guaranteeing universal execution and zero crash risk on low-spec integrated graphics, virtual machines, or remote desktops.
- **Curated Color Palettes:** Dynamic false-color ramps including *Neon Cyber*, *Bioluminescence*, *Amber Ember*, *Spectral Velvet*, *Toxic Emerald*, and *Monochrome*.

### 3. Professional Desktop Studio UX
- **Responsive Workspace:** Large central interactive simulation canvas, top control bar, collapsible left engine rail, and dynamic contextual parameter inspector.
- **Live Species Matrix Editor:** Real-time color-coded heatmap grid to manipulate inter-species forces on the fly.
- **Curated Preset Gallery:** Rich preset library across *Cosmic*, *Biological*, *Fluid Dynamics*, and *Abstract Math* categories with instant search and one-click application.
- **Heads-Up Display (HUD) & Status:** Live FPS telemetry, frame time latency, entity counters, active seed, and renderer badge.

### 4. Bilingual Localization & Modern Theming
- **Bilingual Interface:** Full English (LTR) and Persian / Farsi (RTL) translations with native Right-to-Left layout mirroring.
- **Typography:** Bundled high-legibility Vazirmatn Persian font and clean modern Latin sans-serif typography.
- **Dark & Light Themes:** Layered charcoal dark theme and high-contrast light theme with live runtime switching.

### 5. Local Persistence & High-Resolution Export
- **SQLite Database:** Local settings, recent project tracking, and custom preset storage with Write-Ahead Logging (WAL).
- **`.vanta` Project Format:** Safe, human-readable JSON project manifest with atomic replacement to prevent corruption.
- **Lossless PNG & 4K Stills:** Offscreen rendering for crisp wallpapers and artwork exports.
- **Video & Frame Sequences:** Deterministic frame-by-frame export to numbered PNG sequences or MP4 video via FFmpeg integration.

---

## System Requirements

- **Operating System:** Windows 10/11 (64-bit), Linux (Ubuntu 22.04+), or macOS (12+).
- **Processor:** Quad-Core 2.0 GHz or higher (runs smoothly on Intel Core i5 4th Gen+ / AMD Ryzen 3).
- **Memory (RAM):** 8 GB minimum (includes dedicated **Lite Mode** for constrained memory).
- **Graphics:** OpenGL 2.1+ compatible GPU or standard CPU software rendering fallback.
- **Python:** Python 3.10 to 3.12 (Python 3.11.9 recommended).

---

## Installation & Quick Start

### Quick Launch on Windows
Clone the repository and double-click `run.bat` or run in PowerShell:
```powershell
.\run.ps1
```
*If this is the first launch, the script will automatically create a local virtual environment (`.venv`), install dependencies, and start the studio.*

### Manual Installation
```bash
# 1. Clone the repository
git clone https://github.com/P0O1N0/VANTA.git
cd VANTA

# 2. Create and activate a virtual environment
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Launch VANTA
python -m vanta.main
```

---

## Controls and Shortcuts

| Action | Control / Shortcut | Description |
| :--- | :--- | :--- |
| **Play / Pause** | `Space` / Top Bar Button | Toggle active simulation evolution |
| **Single Step** | `S` / Top Bar Button | Advance simulation by a single discrete timestep |
| **Reset** | `R` / Top Bar Button | Reset simulation to initial conditions |
| **Fullscreen** | `F11` / `Esc` | Toggle full-canvas distraction-free mode |
| **Export Work** | `E` / Top Bar Button | Open image and video export dialog |
| **Interact (Left Click)** | Mouse Click / Drag | Attract particles / inject vortex / seed reactant |
| **Interact (Right Click)**| Mouse Click / Drag | Repel particles / clear reactant area |
| **Speed Multiplier** | Top Bar Slider | Adjust execution speed from 0.2x to 3.0x |

---

## Performance Benchmarks

Measured on a Windows 10 reference laptop (Intel 8-Core, 8 GB RAM, Integrated Graphics):

| Simulation Engine | Entities / Grid | Updates / Sec (UPS) | Step Latency (ms) | Target FPS |
| :--- | :--- | :--- | :--- | :--- |
| **Flow Field** | 4,000 particles | **961.8 UPS** | **1.04 ms** | 60 FPS |
| **Physarum (Slime Mold)**| 4,000 agents | **203.9 UPS** | **4.91 ms** | 60 FPS |
| **Reaction-Diffusion** | 43,200 cells | **69.8 UPS** | **14.33 ms** | 60 FPS |
| **Particle Life** | 1,500 particles | **34.0 UPS** | **29.44 ms** | 30–60 FPS |

To execute the benchmark suite on your own machine:
```bash
python scripts/benchmark.py --duration 2.0
```

---

## Running the Automated Test Suite

VANTA includes a comprehensive test suite covering mathematical reproducibility, numerical stability, SQLite storage, atomic project serialization, and headless UI smoke tests:

```bash
# Run all tests
pytest -v

# Run only simulation engine tests
pytest tests/unit/test_engines.py -v

# Run storage and export tests
pytest tests/unit/test_storage_and_export.py -v

# Run UI smoke tests
pytest tests/smoke/test_app_smoke.py -v
```

---

## Building Standalone Windows Executable

To generate a self-contained Windows desktop distribution using PyInstaller:
```powershell
.\scripts\build_windows.ps1
```
The output directory will be created at `dist/VANTA/VANTA.exe`.

---

## Author & Attribution

**VANTA — Generative Life Studio**  
- **Author & Architect:** P O N  
- **Telegram:** [@P0O1N0](https://t.me/P0O1N0)  
- **GitHub:** [github.com/P0O1N0](https://github.com/P0O1N0)  
- **Repository:** [https://github.com/P0O1N0/VANTA](https://github.com/P0O1N0/VANTA)

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for complete details.
