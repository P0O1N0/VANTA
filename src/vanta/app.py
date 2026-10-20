"""
VANTA application coordinator and lifecycle manager.
"""

from __future__ import annotations

import os
import sys
from PySide6.QtCore import Qt
from PySide6.QtGui import QIcon, QSurfaceFormat
from PySide6.QtWidgets import QApplication, QMessageBox

from vanta.config.settings import APP_NAME, APP_VERSION, AUTHOR_NAME
from vanta.storage.database import Database
from vanta.ui.main_window import MainWindow
from vanta.ui.splash_screen import VantaSplashScreen
from vanta.utilities.logger import get_logger, setup_logger
from vanta.utilities.platform_detector import detect_system_hardware, probe_opengl_capabilities

logger = setup_logger()


class VantaApplication:
    """Coordinates application startup, platform diagnostics, window lifecycle, and shutdown."""

    def __init__(self, argv: list[str] | None = None):
        self.argv = argv or sys.argv
        self.app: QApplication
        self.main_window: MainWindow | None = None
        self.db = Database()

    def run(self, show_splash: bool = True) -> int:
        """Initialize environment, display main studio window, and run Qt event loop."""
        logger.info(f"Starting {APP_NAME} v{APP_VERSION}...")

        # Configure High-DPI and surface attributes before QApplication creation
        QApplication.setHighDpiScaleFactorRoundingPolicy(
            Qt.HighDpiScaleFactorRoundingPolicy.PassThrough
        )

        # Configure default OpenGL surface format
        gl_format = QSurfaceFormat()
        gl_format.setVersion(3, 3)
        gl_format.setProfile(QSurfaceFormat.OpenGLContextProfile.CoreProfile)
        gl_format.setDepthBufferSize(24)
        gl_format.setSamples(4)
        QSurfaceFormat.setDefaultFormat(gl_format)

        self.app = QApplication(self.argv)
        self.app.setApplicationName(APP_NAME)
        self.app.setOrganizationName(AUTHOR_NAME)
        self.app.setApplicationVersion(APP_VERSION)

        # Platform detection
        try:
            hw_profile = detect_system_hardware()
            probe_opengl_capabilities(hw_profile)
        except Exception as e:
            logger.warning(f"Platform detection had non-fatal error: {e}")

        # Global exception hook to log unhandled errors gracefully
        sys.excepthook = self._handle_exception

        # Show animated splash screen unless disabled or headless
        splash: VantaSplashScreen | None = None
        skip_splash = (
            not show_splash
            or "--no-splash" in self.argv
            or os.environ.get("VANTA_HEADLESS") == "1"
            or self.app.platformName() == "offscreen"
        )

        if not skip_splash:
            splash = VantaSplashScreen(min_duration=4.0)
            splash.start()
            self.app.processEvents()

        # Create main window
        self.main_window = MainWindow(self.db)

        if splash is not None:
            # Wire splash completion to reveal main studio window
            def reveal_main_window():
                if self.main_window is not None:
                    self.main_window.show()
                    self.main_window.raise_()
                    self.main_window.activateWindow()

            splash._on_finished = reveal_main_window
            splash.set_app_ready()
        else:
            self.main_window.show()

        logger.info(f"{APP_NAME} UI ready and running.")
        return self.app.exec()

    @staticmethod
    def _handle_exception(exc_type, exc_value, exc_traceback) -> None:
        """Handle unhandled exceptions cleanly with logging and diagnostic recovery."""
        if issubclass(exc_type, KeyboardInterrupt):
            sys.__excepthook__(exc_type, exc_value, exc_traceback)
            return

        logger.critical("Unhandled application error:", exc_info=(exc_type, exc_value, exc_traceback))


def run_app() -> int:
    """Convenience functional entrypoint."""
    app_coordinator = VantaApplication()
    return app_coordinator.run()
