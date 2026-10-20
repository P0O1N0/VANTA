@echo off
setlocal
cd /d "%~dp0"

echo [VANTA] Launching Generative Life Studio...

if not exist ".venv\Scripts\python.exe" (
    echo [VANTA] Virtual environment not found. Running initial setup first...
    call setup.bat
    if errorlevel 1 (
        echo [VANTA] Setup failed. Please check setup.bat output.
        pause
        exit /b 1
    )
)

set "PYTHONPATH=%~dp0src;%PYTHONPATH%"
".venv\Scripts\python.exe" -m vanta.main %*
if errorlevel 1 (
    echo.
    echo [VANTA] Studio exited with error code %errorlevel%.
    pause
)
endlocal
