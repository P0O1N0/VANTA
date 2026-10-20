"""
VANTA configuration and settings management.
"""

from __future__ import annotations

import os
import sys
from pathlib import Path
from typing import Any

APP_NAME = "VANTA"
APP_DESCRIPTOR = "Generative Life Studio"
APP_VERSION = "1.0.0"
AUTHOR_NAME = "P O N"
AUTHOR_TELEGRAM = "https://t.me/P0O1N0"
AUTHOR_GITHUB = "https://github.com/P0O1N0"

# Supported simulation engines
ENGINE_PARTICLE_LIFE = "particle_life"
ENGINE_PHYSARUM = "physarum"
ENGINE_FLOW_FIELD = "flow_field"
ENGINE_REACTION_DIFFUSION = "reaction_diffusion"

SUPPORTED_ENGINES = [
    ENGINE_PARTICLE_LIFE,
    ENGINE_PHYSARUM,
    ENGINE_FLOW_FIELD,
    ENGINE_REACTION_DIFFUSION,
]

# Quality Profiles
PROFILE_LITE = "lite"
PROFILE_BALANCED = "balanced"
PROFILE_HIGH = "high"
QUALITY_PROFILES = [PROFILE_LITE, PROFILE_BALANCED, PROFILE_HIGH]

# Default visual parameters
DEFAULT_FPS_CAP = 60
DEFAULT_WINDOW_WIDTH = 1280
DEFAULT_WINDOW_HEIGHT = 800
MIN_WINDOW_WIDTH = 960
MIN_WINDOW_HEIGHT = 600


def get_base_dir() -> Path:
    """Return the root path of the project or bundled executable."""
    if getattr(sys, "frozen", False):
        return Path(sys.executable).parent
    # Return workspace root (VANTA)
    return Path(__file__).resolve().parent.parent.parent.parent


def get_app_data_dir() -> Path:
    """
    Return the platform-appropriate writable user application data directory.
    If the system location is restricted or unavailable, gracefully falls back to .vanta_data.
    """
    # Check if custom or portable override is set
    override = os.environ.get("VANTA_DATA_DIR") or os.environ.get("VANTA_PORTABLE")
    if override:
        data_dir = Path(override)
    elif sys.platform == "win32":
        local_app_data = os.environ.get("LOCALAPPDATA")
        if local_app_data:
            data_dir = Path(local_app_data) / APP_NAME
        else:
            data_dir = Path.home() / "AppData" / "Local" / APP_NAME
    elif sys.platform == "darwin":
        data_dir = Path.home() / "Library" / "Application Support" / APP_NAME
    else:
        # Linux / Unix XDG data home
        xdg_data = os.environ.get("XDG_DATA_HOME")
        if xdg_data:
            data_dir = Path(xdg_data) / APP_NAME
        else:
            data_dir = Path.home() / ".local" / "share" / APP_NAME

    # Try creating directories in standard location, fallback to local workspace if permission denied
    try:
        data_dir.mkdir(parents=True, exist_ok=True)
        # Test writability
        test_file = data_dir / ".write_test"
        test_file.touch()
        test_file.unlink(missing_ok=True)
    except (PermissionError, OSError):
        data_dir = get_base_dir() / ".vanta_data"
        data_dir.mkdir(parents=True, exist_ok=True)

    (data_dir / "projects").mkdir(parents=True, exist_ok=True)
    (data_dir / "presets").mkdir(parents=True, exist_ok=True)
    (data_dir / "exports").mkdir(parents=True, exist_ok=True)
    (data_dir / "logs").mkdir(parents=True, exist_ok=True)

    return data_dir


def get_database_path() -> Path:
    """Return the absolute path to the local SQLite database."""
    return get_app_data_dir() / "vanta.db"


def get_logs_dir() -> Path:
    """Return the path to application logs directory."""
    return get_app_data_dir() / "logs"


def get_exports_dir() -> Path:
    """Return the path to user exports directory."""
    return get_app_data_dir() / "exports"


def get_projects_dir() -> Path:
    """Return the path to user projects directory."""
    return get_app_data_dir() / "projects"


def get_custom_presets_dir() -> Path:
    """Return the path to user custom presets directory."""
    return get_app_data_dir() / "presets"


def get_assets_dir() -> Path:
    """Return the path to bundled assets (fonts, icons, branding)."""
    base = get_base_dir()
    assets = base / "assets"
    if assets.exists():
        return assets
    # Fallback to internal module package assets if packaged
    return Path(__file__).resolve().parent.parent / "assets"
