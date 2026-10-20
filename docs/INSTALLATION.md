# VANTA — Installation & Runtime Setup Guide

**Project:** VANTA — Generative Life Studio  
**Creator:** P O N ([@P0O1N0](https://github.com/P0O1N0))  
**Telegram:** [@P0O1N0](https://t.me/P0O1N0)

---

## System Requirements

| Specification | Minimum Requirement | Recommended |
| :--- | :--- | :--- |
| **Operating System** | Windows 10/11 (64-bit), macOS 12+, Ubuntu 22.04+ | Windows 11 (64-bit) |
| **Browser Runtime** | Chromium 105+, Microsoft Edge 105+, Firefox 110+ | Chrome / Edge (Latest) |
| **Python (Optional)** | Python 3.10+ (for PySide6 Qt GUI) | Python 3.11+ |
| **Memory (RAM)** | 4 GB | 8 GB+ |
| **Graphics** | WebGL 2.0 / OpenGL 3.3 compatible GPU | Discrete GPU (NVIDIA / AMD / Intel Iris) |

---

## 1. Quick Launch (Windows 1-Click)

The simplest method to launch VANTA on Windows does not require installing Python or compiling packages.

### Option A: Native Launcher (`VANTA.exe`)
Double-click `VANTA.exe` in the root project folder.
- Launches the high-performance studio in dedicated standalone window mode (`1440x920`) using your system's Edge or Chrome runtime.
- Zero installation, zero cloud latency, completely offline.

### Option B: Batch or PowerShell Launchers
- **Command Prompt**: Run `run.bat`
- **PowerShell**: Run `.\run.ps1`

---

## 2. Web Studio Direct Access (Cross-Platform)

VANTA Web Studio runs natively in any modern desktop web browser:
1. Clone or download the repository:
   ```bash
   git clone https://github.com/P0O1N0/VANTA.git
   cd VANTA
   ```
2. Open `studio/index.html` directly in your browser:
   - On Windows: Double-click `studio/index.html`
   - On macOS: `open studio/index.html`
   - On Linux: `xdg-open studio/index.html`

No local HTTP server is required; all modules, solvers, and assets operate self-contained.

---

## 3. Python & PySide6 Desktop Environment

For developers seeking to run or extend the native Python PySide6 Qt desktop application:

### Prerequisites
- Python 3.11 installed with pip
- Git

### Automated Setup (Windows)
Run the automated environment setup script:
```cmd
setup.bat
```
or in PowerShell:
```powershell
.\setup.ps1
```
This script creates a local virtual environment (`.venv`), upgrades pip, and installs all pinned dependencies.

### Manual Setup
1. Create and activate a Python virtual environment:
   ```bash
   # Windows
   python -m venv .venv
   .venv\Scripts\activate

   # Linux / macOS
   python3 -m venv .venv
   source .venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

3. Run the desktop application:
   ```bash
   python -m vanta.main
   ```

4. Run the test suite:
   ```bash
   pytest
   ```

---

## 4. Verification & Diagnostics

Verify bundle integrity and simulation engine registration:
```bash
python scripts/verify_bundle.py
```
Expected output:
```text
Braces: 696 vs 696
Parentheses: 1881 vs 1881
Square brackets: 704 vs 704
All 13 simulation worlds and classes verified successfully!
```

---

## 5. Troubleshooting

- **Black Screen or WebGL Disabled**: Ensure hardware acceleration is enabled in your browser settings under `Settings > System > Use graphics acceleration when available`.
- **PySide6 Display Error on Headless Linux**: Set `QT_QPA_PLATFORM=offscreen` if executing tests without an X11/Wayland display server.
- **Permission Denied on Windows PowerShell**: If script execution is restricted, run:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```
