# Changelog

All notable changes to **VANTA — Generative Life Studio** are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-10-20

### Added
- **Core Simulation Engines:**
  - `particle_life`: Continuous-space multi-species particle life with interactive asymmetric $N \times N$ force matrix and uniform grid neighbor search.
  - `physarum`: Agent-based Physarum polycephalum (slime mold) sensory-motor simulation with chemical deposition, diffusion, and decay.
  - `flow_field`: Incompressible curl-noise procedural vector field with organic trails, particle lifetimes, and interactive mouse-injected vortices.
  - `reaction_diffusion`: Gray-Scott chemical morphogenesis model with 9-point isotropic Laplacian stencil simulating Pearson coral, mitosis, and solitons.
- **Dual Graphics Rendering Pipeline:**
  - Hardware-accelerated OpenGL renderer (`QOpenGLWidget`).
  - Rock-solid CPU software rasterizer (`QPainter`) with memory-mapped `QImage` ping-pong buffers for 100% universal hardware fallback.
  - Dynamic false-color palette lookup tables (`neon_cyber`, `bioluminescence`, `amber_ember`, `spectral_velvet`, `toxic_emerald`, `monochrome`).
- **Modern Studio Interface:**
  - Responsive studio layout: Top Bar, collapsible Navigation Rail, large interactive Viewport Canvas, dynamic Contextual Inspector.
  - Real-time Species Interaction Matrix heatmap editor with live cell adjustment.
  - Curated Preset Gallery with multi-category filters (Cosmic, Biological, Fluid Dynamics, Abstract Math).
  - Floating Heads-Up Display (HUD) showing live FPS, frame latency (ms), entity count, active seed, and renderer badge.
  - Floating non-blocking Toast notifications.
- **Design System & Localization:**
  - Refined Dark and Light theme stylesheets with centralized token system.
  - Comprehensive bilingual localization in English (LTR) and Persian (RTL) with Vazirmatn typography.
  - Live runtime switching of theme and language without restarting or resetting simulation state.
- **Local Persistence & Export:**
  - Local SQLite database (`vanta.db`) operating with Write-Ahead Logging (WAL) for settings, recent projects, and custom presets.
  - Portable, versioned `.vanta` JSON project manifest format with atomic write replacement.
  - High-resolution PNG still image exporter and thumbnail generator.
  - Deterministic frame-sequence and MP4 video exporter with FFmpeg integration and sequence fallback.
- **Tooling & Infrastructure:**
  - Automated Windows launchers (`run.bat`, `setup.bat`, `run.ps1`, `setup.ps1`).
  - Standalone Windows PyInstaller build spec (`scripts/vanta.spec`, `scripts/build_windows.ps1`).
  - Simulation throughput benchmark script (`scripts/benchmark.py`).
  - Complete automated test suite covering unit tests, storage, export, and UI smoke tests.
