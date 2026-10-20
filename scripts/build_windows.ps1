# VANTA - Standalone Windows Executable Builder (PyInstaller)
[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$WorkspaceDir = Split-Path -Parent $ScriptDir
Set-Location $WorkspaceDir

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "  VANTA: Building Standalone Windows Executable" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan

$PyInstallerExe = Join-Path $WorkspaceDir ".venv\Scripts\pyinstaller.exe"
if (-not (Test-Path $PyInstallerExe)) {
    Write-Error "PyInstaller not found in .venv. Run setup.ps1 first."
    exit 1
}

$SpecFile = Join-Path $ScriptDir "vanta.spec"

Write-Host "[VANTA] Running PyInstaller on $SpecFile..." -ForegroundColor Cyan
& $PyInstallerExe --noconfirm --clean $SpecFile

$OutExe = Join-Path $WorkspaceDir "dist\VANTA\VANTA.exe"
if (Test-Path $OutExe) {
    Write-Host ""
    Write-Host "=======================================================" -ForegroundColor Green
    Write-Host "  Build Succeeded! Executable created at:" -ForegroundColor Green
    Write-Host "  $OutExe" -ForegroundColor White
    Write-Host "=======================================================" -ForegroundColor Green
} else {
    Write-Error "Build finished but executable was not found at $OutExe."
}
