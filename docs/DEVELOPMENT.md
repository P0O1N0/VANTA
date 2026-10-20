# VANTA — Developer Guide & Contribution Handbook

## 1. Development Environment Setup

### Prerequisites
- Python 3.10 to 3.12 (Python 3.11.9 recommended).
- Windows 10/11, Linux (Ubuntu 22.04+), or macOS (12+).
- Git.

### Quick Setup (Windows)
Run the automated PowerShell setup script:
```powershell
.\setup.ps1
```
Or execute the batch script:
```cmd
setup.bat
```

### Manual Setup
```bash
# 1. Create a dedicated virtual environment
python -m venv .venv

# 2. Activate virtual environment
# Windows PowerShell:
.venv\Scripts\Activate.ps1
# Windows CMD:
.venv\Scripts\activate.bat
# Linux/macOS:
source .venv/bin/activate

# 3. Upgrade pip and install pinned dependencies
pip install -r requirements.txt

# 4. Install project in editable mode
pip install -e .
```

---

## 2. Launching the Studio

Run the application through the provided launchers:
```powershell
.\run.ps1
```
Or in Python directly:
```bash
python -m vanta.main
```

---

## 3. Running Automated Tests

VANTA ships with unit, integration, and smoke test suites:
```bash
# Run all tests
pytest

# Run tests with verbose output
pytest -v

# Run only simulation tests
pytest tests/unit/test_engines.py

# Run UI smoke tests
pytest tests/smoke/test_app_smoke.py
```

---

## 4. How to Implement a New Simulation Engine

1. Create a new module in `src/vanta/core/engines/<my_engine>.py`.
2. Inherit from `BaseEngine` (`src/vanta/core/base_engine.py`).
3. Implement the required lifecycle methods:
   - `initialize(width, height, seed)`
   - `step(dt)`
   - `reset()`
   - `get_render_data()`
   - `get_parameters()`
   - `set_parameters(params)`
   - `interact(x, y, button, mode)`
4. Register your engine in `src/vanta/core/engine_registry.py`.
5. Add curated presets in `src/vanta/presets/library.py`.
6. Add English and Persian translation keys in `localization/en.py` and `localization/fa.py`.

---

## 5. Building the Windows Standalone Executable

To generate a standalone Windows distribution using PyInstaller:
```powershell
.\scripts\build_windows.ps1
```
The resulting executable will be placed in `dist/VANTA/VANTA.exe`.
