"""
System platform and hardware capabilities detection for VANTA.
"""

from __future__ import annotations

import os
import platform
import sys
from dataclasses import dataclass, field
from typing import Any

from vanta.utilities.logger import get_logger

logger = get_logger("platform_detector")


@dataclass
class HardwareProfile:
    os_name: str
    os_release: str
    os_version: str
    architecture: str
    python_version: str
    cpu_count: int
    total_ram_gb: float
    opengl_available: bool = False
    opengl_version: str = "Unknown"
    opengl_vendor: str = "Unknown"
    opengl_renderer: str = "Unknown"
    is_software_gl: bool = False
    recommended_profile: str = "balanced"
    diagnostics: list[str] = field(default_factory=list)


def detect_system_hardware() -> HardwareProfile:
    """Detect current system environment, CPU, memory, and OS."""
    os_name = platform.system()
    os_release = platform.release()
    os_version = platform.version()
    architecture = platform.machine()
    python_version = platform.python_version()

    cpu_count = os.cpu_count() or 2

    # Measure memory using psutil if available, otherwise fallback
    total_ram_gb = 4.0
    try:
        import psutil
        total_ram_gb = round(psutil.virtual_memory().total / (1024 ** 3), 2)
    except Exception:
        # Fallback for systems without psutil
        if os_name == "Windows":
            try:
                import ctypes
                class MEMORYSTATUSEX(ctypes.Structure):
                    _fields_ = [
                        ("dwLength", ctypes.c_ulong),
                        ("dwMemoryLoad", ctypes.c_ulong),
                        ("ullTotalPhys", ctypes.c_ulonglong),
                        ("ullAvailPhys", ctypes.c_ulonglong),
                        ("ullTotalPageFile", ctypes.c_ulonglong),
                        ("ullAvailPageFile", ctypes.c_ulonglong),
                        ("ullTotalVirtual", ctypes.c_ulonglong),
                        ("ullAvailVirtual", ctypes.c_ulonglong),
                        ("sullAvailExtendedVirtual", ctypes.c_ulonglong),
                    ]
                stat = MEMORYSTATUSEX()
                stat.dwLength = ctypes.sizeof(MEMORYSTATUSEX)
                ctypes.windll.kernel32.GlobalMemoryStatusEx(ctypes.byref(stat))
                total_ram_gb = round(stat.ullTotalPhys / (1024 ** 3), 2)
            except Exception:
                total_ram_gb = 8.0

    profile = HardwareProfile(
        os_name=os_name,
        os_release=os_release,
        os_version=os_version,
        architecture=architecture,
        python_version=python_version,
        cpu_count=cpu_count,
        total_ram_gb=total_ram_gb,
    )

    # Determine recommended profile
    if total_ram_gb < 6.0 or cpu_count <= 2:
        profile.recommended_profile = "lite"
    elif total_ram_gb >= 15.0 and cpu_count >= 8:
        profile.recommended_profile = "high"
    else:
        profile.recommended_profile = "balanced"

    logger.info(
        f"Hardware detected: {os_name} {os_release} ({architecture}), "
        f"{cpu_count} CPUs, {total_ram_gb:.1f} GB RAM -> Suggested profile: {profile.recommended_profile}"
    )

    return profile


def probe_opengl_capabilities(profile: HardwareProfile) -> None:
    """Probe PySide6 QOpenGLWidget / OpenGL driver capabilities."""
    try:
        from PySide6.QtGui import QSurfaceFormat
        from PySide6.QtOpenGLWidgets import QOpenGLWidget
        from PySide6.QtWidgets import QApplication

        # Ensure QApplication instance exists for format queries
        app = QApplication.instance()
        created_temp_app = False
        if app is None:
            # Minimal headless instance for query
            app = QApplication([])
            created_temp_app = True

        fmt = QSurfaceFormat.defaultFormat()
        major = fmt.majorVersion()
        minor = fmt.minorVersion()

        profile.opengl_available = True
        profile.opengl_version = f"{major}.{minor}"

        # If running in Mesa/Software OpenGL environment, flag it
        renderer_lower = profile.opengl_renderer.lower()
        if any(term in renderer_lower for term in ["llvmpipe", "softpipe", "microsoft basic", "swrast"]):
            profile.is_software_gl = True
            profile.diagnostics.append("Software-emulated OpenGL detected; falling back to optimized CPU rasterizer.")
            logger.info("Software OpenGL driver detected.")

        if created_temp_app:
            # Clean up temp app if we created it
            pass

    except Exception as exc:
        profile.opengl_available = False
        profile.diagnostics.append(f"OpenGL context creation failed: {exc}")
        logger.warning(f"OpenGL query failed: {exc}. Software rendering will be used.")
