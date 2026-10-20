# Changelog

All notable changes to **VANTA — Generative Life Studio** are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-10-21

### Added
- **Full 13 Simulation Worlds Architecture:**
  - `cosmic_gravity`: Relativistic $N$-body gravitational dynamics with Barnes-Hut quadtree and Plummer softening.
  - `boids_swarm`: Autonomous emergent flocking based on Reynolds separation, alignment, and cohesion triads.
  - `quantum_wave`: Time-dependent Schrödinger equation (TDSE) staggered leapfrog finite difference with Born probability wavepacket interference.
  - `crystal_growth`: Kobayashi phase-field anisotropic dendritic solidification model.
  - `lenia`: Continuous cellular automata with concentric ring kernel convolution and non-linear bell-shaped growth functions.
  - `ferrofluid`: Magnetic fluid dynamics simulating normal-field Rosensweig surface instability spikes.
  - `fractal_growth`: Witten-Sander diffusion-limited aggregation (DLA) with stochastic Brownian random walks.
  - `excitable_medium`: Non-linear FitzHugh-Nagumo reaction-diffusion partial differential equations generating rotating spiral waves.
  - `thermal_convection`: Incompressible 2D Navier-Stokes solver with Oberbeck-Boussinesq thermal buoyancy, stable Rayleigh-Bénard roll cells, and mantle plumes.
- **Bespoke Animated Startup Experience (4.0s Display Duration):**
  - Living harmonic stardust particle canvas (`#splash-canvas`) with vector flow field drift and proximity filaments.
  - Bespoke architectural emblem SVG combining modernist "V" geometry, hyperbolic Möbius soliton ribbon, and radiant quantum core.
  - Analog film grain noise filter (`SVG feTurbulence`) providing cinematic depth.
  - Live kinetic tabular counter (`000%` to `100%`) with simulation phase telemetry milestones.
  - Radial particle dispersion and smooth blur/dissolve outro transition.
- **Enhanced Studio Navigation & Controls:**
  - Slide-out Worlds Navigation Drawer with category filtering (All, Biological, Physical, Mathematical Chaos) and live entity indicators.
  - Real-time WebM 60 FPS video recording via `MediaRecorder` / `canvas.captureStream(60)`.
  - Timestamped 4K PNG screenshot export.
  - Dedicated 6KB native Windows launcher executable (`VANTA.exe`).

### Changed
- Refined thermal convection Boussinesq solver with physical diffusion ($\kappa \nabla^2 T$), zero-mean buoyancy offsets, and Neumann pressure boundary conditions, eliminating runaway heating.
- Upgraded drawer backdrop stacking architecture to eliminate click-intercept traps.
- Streamlined documentation suite with comprehensive mathematical derivations (`docs/SCIENCE.md`) and dual-target architecture specification (`docs/ARCHITECTURE.md`).

## [1.0.0] - 2026-10-20

### Added
- **Core Simulation Engines:**
  - `particle_life`: Continuous-space multi-species particle life with interactive asymmetric $N \times N$ force matrix and uniform grid neighbor search.
  - `physarum`: Agent-based Physarum polycephalum (slime mold) sensory-motor simulation with chemical deposition, diffusion, and decay.
  - `flow_field`: Incompressible curl-noise procedural vector field with organic trails, particle lifetimes, and interactive mouse-injected vortices.
  - `reaction_diffusion`: Gray-Scott chemical morphogenesis model with 9-point isotropic Laplacian stencil simulating Pearson coral, mitosis, and solitons.
- **Dual Graphics Rendering Pipeline:**
  - Hardware-accelerated OpenGL renderer (`QOpenGLWidget`).
  - CPU software rasterizer (`QPainter`) with memory-mapped `QImage` ping-pong buffers for universal hardware fallback.
  - Dynamic false-color palette lookup tables (`neon_cyber`, `bioluminescence`, `amber_ember`, `spectral_velvet`, `toxic_emerald`, `monochrome`).
- **Modern Studio Interface:**
  - Responsive studio layout: Top Bar, collapsible Navigation Rail, large interactive Viewport Canvas, dynamic Contextual Inspector.
  - Real-time Species Interaction Matrix heatmap editor with live cell adjustment.
  - Curated Preset Gallery with multi-category filters (Cosmic, Biological, Fluid Dynamics, Abstract Math).
  - Floating Heads-Up Display (HUD) showing live FPS, frame latency (ms), entity count, active seed, and renderer badge.
  - Floating non-blocking Toast notifications.
- **Local Persistence & Export:**
  - Local SQLite database (`vanta.db`) operating with Write-Ahead Logging (WAL) for settings, recent projects, and custom presets.
  - Portable, versioned `.vanta` JSON project manifest format with atomic write replacement.
  - High-resolution PNG still image exporter and thumbnail generator.
- **Tooling & Infrastructure:**
  - Automated Windows launchers (`run.bat`, `setup.bat`, `run.ps1`, `setup.ps1`).
