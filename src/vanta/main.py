"""
VANTA main entry point and CLI argument parser.
"""

from __future__ import annotations

import argparse
import os
import sys

from vanta.config.settings import APP_DESCRIPTOR, APP_NAME, APP_VERSION


def main() -> int:
    """Parse CLI options and launch VANTA Generative Life Studio."""
    parser = argparse.ArgumentParser(
        prog="vanta",
        description=f"{APP_NAME} — {APP_DESCRIPTOR}: Offline-first desktop studio for generative art and simulations.",
    )
    parser.add_argument(
        "--version",
        action="version",
        version=f"{APP_NAME} {APP_VERSION}",
    )
    parser.add_argument(
        "--portable",
        action="store_true",
        help="Run in portable mode (store database and projects locally in .vanta_data)",
    )
    parser.add_argument(
        "--software-gl",
        action="store_true",
        help="Force software CPU rasterization instead of hardware OpenGL",
    )
    parser.add_argument(
        "--engine",
        type=str,
        choices=["particle_life", "physarum", "flow_field", "reaction_diffusion"],
        help="Initial simulation engine to load on startup",
    )

    args, unknown = parser.parse_known_args()

    if args.portable:
        os.environ["VANTA_PORTABLE"] = "1"
    if args.software_gl:
        os.environ["QT_QUICK_BACKEND"] = "software"
        os.environ["LIBGL_ALWAYS_SOFTWARE"] = "1"

    from vanta.app import run_app
    return run_app()


if __name__ == "__main__":
    sys.exit(main())
