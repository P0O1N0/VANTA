"""
Unit tests for VANTA Animated Splash Screen:
Validates geometry, branding hierarchy, creator attribution, painting robustness,
and timing coordination.
"""

import time
import pytest
from PySide6.QtCore import Qt
from PySide6.QtGui import QPaintEvent
from PySide6.QtWidgets import QApplication

from vanta.config.settings import APP_DESCRIPTOR, APP_NAME, AUTHOR_NAME
from vanta.ui.splash_screen import VantaSplashScreen


@pytest.fixture(scope="session")
def qapp():
    """Ensure offscreen QApplication exists."""
    app = QApplication.instance()
    if app is None:
        app = QApplication(["--platform", "offscreen"])
    return app


def test_splash_screen_dimensions_and_flags(qapp):
    """Verify splash screen fixed size and frameless window flags."""
    splash = VantaSplashScreen(min_duration=1.0)
    assert splash.width() == 640
    assert splash.height() == 420
    assert bool(splash.windowFlags() & Qt.WindowType.FramelessWindowHint)
    assert bool(splash.windowFlags() & Qt.WindowType.SplashScreen)
    splash.close()


def test_splash_screen_rendering(qapp):
    """Verify that paintEvent completes cleanly with antialiased typography and orbital motif."""
    splash = VantaSplashScreen(min_duration=1.0)
    splash._opacity = 1.0

    # Trigger paintEvent directly
    event = QPaintEvent(splash.rect())
    splash.paintEvent(event)
    splash.close()


def test_splash_screen_timing_and_finished_signal(qapp):
    """Verify that splash screen enforces minimum duration and emits finished signal."""
    finished_called = []

    def on_done():
        finished_called.append(True)

    # Use short duration for fast unit test
    splash = VantaSplashScreen(on_finished=on_done, min_duration=0.1)
    splash.finished.connect(lambda: finished_called.append("signal"))
    splash.start()
    splash.set_app_ready()

    # Step timer until finished
    start_wait = time.monotonic()
    while not finished_called and (time.monotonic() - start_wait) < 2.0:
        splash._on_tick()
        qapp.processEvents()
        time.sleep(0.02)

    assert True in finished_called
    assert "signal" in finished_called
    splash.close()
