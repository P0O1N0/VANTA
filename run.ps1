# VANTA - Generative Life Studio Launcher (PowerShell)
[CmdletBinding()]
param (
    [switch]$Portable,
    [switch]$SoftwareGL,
    [string]$Engine
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $ScriptDir

Write-Host "[VANTA] Launching Generative Life Studio..." -ForegroundColor Cyan

$VenvPython = Join-Path $ScriptDir ".venv\Scripts\python.exe"

if (-not (Test-Path $VenvPython)) {
    Write-Host "[VANTA] Virtual environment not found. Executing setup.ps1 first..." -ForegroundColor Yellow
    & "$ScriptDir\setup.ps1"
}

$env:PYTHONPATH = "$ScriptDir\src;$env:PYTHONPATH"

$LaunchArgs = @("-m", "vanta.main")
if ($Portable) { $LaunchArgs += "--portable" }
if ($SoftwareGL) { $LaunchArgs += "--software-gl" }
if ($Engine) { $LaunchArgs += @("--engine", $Engine) }

& $VenvPython $LaunchArgs
