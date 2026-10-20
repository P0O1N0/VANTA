@echo off
setlocal
cd /d "%~dp0"

echo =======================================================
echo   VANTA — Generative Life Studio: Automated Setup
echo =======================================================

:: 1. Detect Python
where python >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Python was not found in PATH.
    echo Please install Python 3.10+ from https://www.python.org/downloads/
    pause
    exit /b 1
)

python -c "import sys; exit(0 if sys.version_info >= (3, 10) else 1)"
if errorlevel 1 (
    echo [ERROR] Python 3.10 or newer is required.
    pause
    exit /b 1
)

:: 2. Create project-local virtual environment
if not exist ".venv\Scripts\python.exe" (
    echo [VANTA] Creating project virtual environment in .venv...
    python -m venv .venv
    if errorlevel 1 (
        echo [ERROR] Failed to create virtual environment.
        pause
        exit /b 1
    )
)

:: 3. Configure local module path
set "PTH_FILE=.venv\Lib\site-packages\vanta.pth"
echo %~dp0src> "%PTH_FILE%"

:: 4. Install pinned dependencies
echo [VANTA] Installing dependencies from requirements.txt...
".venv\Scripts\pip.exe" install -r requirements.txt
if errorlevel 1 (
    echo [ERROR] Dependency installation encountered errors.
    pause
    exit /b 1
)

:: 5. Smoke test import verification
echo [VANTA] Verifying installation...
".venv\Scripts\python.exe" -c "import PySide6, numpy, scipy, PIL, vanta; print('Installation verified successfully!')"
if errorlevel 1 (
    echo [ERROR] Verification check failed.
    pause
    exit /b 1
)

echo.
echo =======================================================
echo   VANTA setup completed successfully!
echo   You can now launch the studio by running run.bat
echo =======================================================
endlocal
