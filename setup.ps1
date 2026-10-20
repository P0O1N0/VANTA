# VANTA - Generative Life Studio Automated Setup (PowerShell)
[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $ScriptDir

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "  VANTA — Generative Life Studio: Automated Setup" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan

# 1. Detect Python 3.10+
$PythonCmd = Get-Command python -ErrorAction SilentlyContinue
if (-not $PythonCmd) {
    Write-Error "[ERROR] Python was not found in PATH. Please install Python 3.10+ from https://www.python.org/downloads/"
    exit 1
}

$VerCheck = & python -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}'); exit(0 if sys.version_info >= (3, 10) else 1)"
if ($LASTEXITCODE -ne 0) {
    Write-Error "[ERROR] Python 3.10 or newer is required. Found Python $VerCheck."
    exit 1
}
Write-Host "[VANTA] Detected compatible Python $VerCheck" -ForegroundColor Green

# 2. Create local virtual environment
$VenvDir = Join-Path $ScriptDir ".venv"
$VenvPython = Join-Path $VenvDir "Scripts\python.exe"

if (-not (Test-Path $VenvPython)) {
    Write-Host "[VANTA] Creating project virtual environment in .venv..." -ForegroundColor Cyan
    & python -m venv $VenvDir
}

# 3. Configure local module path
$PthFile = Join-Path $VenvDir "Lib\site-packages\vanta.pth"
"$ScriptDir\src" | Out-File -FilePath $PthFile -Encoding ascii -Force

# 4. Install dependencies
Write-Host "[VANTA] Installing pinned dependencies from requirements.txt..." -ForegroundColor Cyan
$PipExe = Join-Path $VenvDir "Scripts\pip.exe"
& $PipExe install -r requirements.txt

# 5. Verification check
Write-Host "[VANTA] Verifying installation..." -ForegroundColor Cyan
& $VenvPython -c "import PySide6, numpy, scipy, PIL, vanta; print('Verification check passed successfully!')"

Write-Host ""
Write-Host "=======================================================" -ForegroundColor Green
Write-Host "  Setup completed! Run .\run.ps1 to launch VANTA." -ForegroundColor Green
Write-Host "=======================================================" -ForegroundColor Green
