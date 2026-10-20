# Contributing to VANTA

Thank you for your interest in contributing to **VANTA — Generative Life Studio**!

## Code of Conduct
VANTA is committed to providing an open, welcoming, and harassment-free environment for all contributors.

## How Can I Contribute?

### 1. Reporting Bugs
- Search existing GitHub issues to verify that the bug has not already been reported.
- Open an issue detailing:
  - Operating system and GPU information.
  - Steps to reproduce the bug.
  - Expected vs. actual behavior.
  - Relevant logs from `%LOCALAPPDATA%\VANTA\logs\vanta.log`.

### 2. Suggesting Enhancements or New Engines
- Open an enhancement proposal outlining the mathematical model or visual mechanics.
- Ensure the proposed algorithm has bounded memory and computational complexity suitable for modest hardware.

### 3. Adding Simulation Presets
- Add unique presets to `src/vanta/presets/library.py`.
- Include a descriptive name, seed, category, and balanced parameters.

### 4. Pull Request Guidelines
1. Fork the repository and create your feature branch: `git checkout -b feature/my-new-feature`.
2. Follow PEP 8 style conventions and ensure all code is strictly typed.
3. Verify that all automated tests pass:
   ```bash
   pytest -v
   ```
4. Run the simulation benchmark to ensure no performance regressions:
   ```bash
   python scripts/benchmark.py
   ```
5. Submit your pull request with a concise description of your changes.
