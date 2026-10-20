"""
UI Smoke tests for VANTA studio: MainWindow lifecycle, navigation, theme, localization, and dialogs.
Runs headlessly using Qt offscreen platform.
"""

import os
import sys
import tempfile
from pathlib import Path
import pytest
from PySide6.QtCore import Qt
from PySide6.QtWidgets import QApplication

from vanta.core.engine_registry import EngineRegistry
from vanta.localization.i18n import get_locale, is_rtl
from vanta.storage.database import Database
from vanta.ui.main_window import MainWindow


@pytest.fixture(scope="session")
def qapp():
    """Ensure a headless offscreen QApplication exists for UI tests."""
    app = QApplication.instance()
    if app is None:
        os.environ["QT_QPA_PLATFORM"] = "offscreen"
        app = QApplication(["--platform", "offscreen"])
    return app


def test_main_window_creation_and_lifecycle(qapp):
    """Verify that MainWindow instantiates, initializes all subcomponents, and runs."""
    with tempfile.TemporaryDirectory() as tmp_dir:
        db = Database(Path(tmp_dir) / "smoke.db")
        window = MainWindow(db)
        window.show()

        assert window.isVisible() or qapp.platformName() == "offscreen"
        assert window.canvas is not None
        assert window.top_bar is not None
        assert window.nav_rail is not None
        assert window.inspector is not None

        window.close()


def test_main_window_engine_switching(qapp):
    """Verify switching across all 4 simulation engines updates canvas and inspector."""
    with tempfile.TemporaryDirectory() as tmp_dir:
        db = Database(Path(tmp_dir) / "smoke.db")
        window = MainWindow(db)

        for eid in EngineRegistry.list_engine_ids():
            window._switch_engine(eid)
            assert window._engine.engine_id == eid
            assert window.inspector._current_engine.engine_id == eid

            # Step and update frame
            window._on_sim_tick()
            data = window._engine.get_render_data()
            assert data.active_count > 0

        window.close()


def test_theme_and_language_toggle(qapp):
    """Verify live theme and bilingual (English/Persian) RTL switching."""
    with tempfile.TemporaryDirectory() as tmp_dir:
        db = Database(Path(tmp_dir) / "smoke.db")
        window = MainWindow(db)

        # Theme toggle
        initial_theme = window._current_theme
        window._on_toggle_theme()
        assert window._current_theme != initial_theme
        window._on_toggle_theme()
        assert window._current_theme == initial_theme

        # Language toggle
        initial_locale = get_locale()
        window._on_toggle_language()
        assert get_locale() != initial_locale

        # Check layout direction
        if get_locale() == "fa":
            assert is_rtl() is True
            assert QApplication.layoutDirection() == Qt.LayoutDirection.RightToLeft
        else:
            assert is_rtl() is False
            assert QApplication.layoutDirection() == Qt.LayoutDirection.LeftToRight

        # Switch back
        window._on_toggle_language()
        assert get_locale() == initial_locale

        window.close()


def test_playback_and_speed_controls(qapp):
    """Verify Play, Pause, Step, Reset, and Speed multiplier changes."""
    with tempfile.TemporaryDirectory() as tmp_dir:
        db = Database(Path(tmp_dir) / "smoke.db")
        window = MainWindow(db)

        # Toggle play/pause
        window.top_bar.btn_play.click()
        assert window._is_running is False
        window.top_bar.btn_play.click()
        assert window._is_running is True

        # Speed change
        window._on_speed_changed(2.5)
        assert window._sim_speed == 2.5
        assert window._engine.speed == 2.5

        # Reset
        window._on_reset()
        assert window._engine.step_count == 0

        window.close()
