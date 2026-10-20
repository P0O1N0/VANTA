"""
VANTA Main Studio Window: central coordinator for canvas, navigation, inspectors,
simulation timer loop, and localization.
"""

from __future__ import annotations

import time
from typing import Any
from PySide6.QtCore import Qt, QTimer
from PySide6.QtGui import QAction, QKeySequence, QShortcut
from PySide6.QtWidgets import (
    QApplication,
    QHBoxLayout,
    QMainWindow,
    QStatusBar,
    QVBoxLayout,
    QWidget,
)

from vanta.config.settings import APP_NAME, APP_DESCRIPTOR
from vanta.core.base_engine import BaseEngine
from vanta.core.engine_registry import EngineRegistry
from vanta.localization.i18n import (
    get_locale,
    is_rtl,
    set_locale,
    tr,
)
from vanta.presets.preset_manager import PresetManager
from vanta.storage.database import Database
from vanta.ui.canvas import SimulationCanvas
from vanta.ui.components.inspector import InspectorPanel
from vanta.ui.components.navigation_rail import NavigationRail
from vanta.ui.components.preset_browser import PresetBrowserDialog
from vanta.ui.components.toast import Toast
from vanta.ui.components.top_bar import TopBar
from vanta.ui.dialogs.about_dialog import AboutDialog
from vanta.ui.dialogs.export_dialog import ExportDialog
from vanta.ui.themes.style import generate_stylesheet
from vanta.utilities.logger import get_logger

logger = get_logger("ui.main_window")


class MainWindow(QMainWindow):
    """Primary studio desktop window for VANTA."""

    def __init__(self, db: Database | None = None):
        super().__init__()
        self.db = db or Database()
        self.preset_mgr = PresetManager(self.db)

        # Restore saved theme and locale
        self._current_theme = self.db.get_setting("theme", "dark")
        self._current_locale = self.db.get_setting("locale", "fa")
        set_locale(self._current_locale)

        self.setWindowTitle(f"{APP_NAME} — {APP_DESCRIPTOR}")
        self.resize(1280, 800)
        self.setMinimumSize(960, 600)

        # Active engine
        self._engine: BaseEngine = EngineRegistry.create_engine("particle_life")
        self._is_running = True
        self._sim_speed = 1.0

        # Performance metrics
        self._last_frame_time = time.perf_counter()
        self._fps_counter = 0
        self._current_fps = 60.0
        self._fps_timer = time.perf_counter()

        self._init_ui()
        self._setup_shortcuts()
        self._apply_theme()
        self._apply_direction()

        # Connect active engine to canvas & inspector
        self._switch_engine("particle_life")

        # Simulation & Render loop timer (~60 FPS)
        self._timer = QTimer(self)
        self._timer.setInterval(16)
        self._timer.timeout.connect(self._on_sim_tick)
        self._timer.start()

    def _init_ui(self) -> None:
        central_widget = QWidget(self)
        self.setCentralWidget(central_widget)

        root_layout = QVBoxLayout(central_widget)
        root_layout.setContentsMargins(0, 0, 0, 0)
        root_layout.setSpacing(0)

        # 1. Top Bar
        self.top_bar = TopBar(self)
        self.top_bar.play_toggled.connect(self._on_play_toggled)
        self.top_bar.step_requested.connect(self._on_step)
        self.top_bar.reset_requested.connect(self._on_reset)
        self.top_bar.random_seed_requested.connect(self._on_random_seed)
        self.top_bar.speed_changed.connect(self._on_speed_changed)
        self.top_bar.quality_changed.connect(self._on_quality_changed)
        self.top_bar.theme_toggled.connect(self._on_toggle_theme)
        self.top_bar.language_toggled.connect(self._on_toggle_language)
        self.top_bar.export_requested.connect(self._open_export_dialog)
        self.top_bar.about_requested.connect(self._open_about_dialog)
        root_layout.addWidget(self.top_bar)

        # 2. Main Workspace (Nav Rail + Canvas + Inspector)
        self.workspace_layout = QHBoxLayout()
        self.workspace_layout.setContentsMargins(8, 8, 8, 8)
        self.workspace_layout.setSpacing(8)

        # Navigation Rail (Left)
        self.nav_rail = NavigationRail(self)
        self.nav_rail.engine_selected.connect(self._switch_engine)
        self.nav_rail.presets_clicked.connect(self._open_preset_browser)
        self.workspace_layout.addWidget(self.nav_rail)

        # Simulation Canvas (Center)
        self.canvas = SimulationCanvas(self, prefer_opengl=True)
        self.workspace_layout.addWidget(self.canvas, stretch=1)

        # Parameter Inspector (Right)
        self.inspector = InspectorPanel(self)
        self.inspector.parameter_changed.connect(self._on_parameter_changed)
        self.inspector.matrix_value_changed.connect(self._on_matrix_val_changed)
        self.workspace_layout.addWidget(self.inspector)

        root_layout.addLayout(self.workspace_layout, stretch=1)

        # 3. Status Bar
        self.status_bar = QStatusBar(self)
        self.setStatusBar(self.status_bar)
        self._update_status_bar()

    def _setup_shortcuts(self) -> None:
        """Bind ergonomic keyboard shortcuts."""
        # Space: Play/Pause
        QShortcut(QKeySequence(Qt.Key.Key_Space), self, activated=lambda: self.top_bar.btn_play.click())
        # S: Step
        QShortcut(QKeySequence(Qt.Key.Key_S), self, activated=self._on_step)
        # R: Reset
        QShortcut(QKeySequence(Qt.Key.Key_R), self, activated=self._on_reset)
        # F11: Fullscreen toggle
        QShortcut(QKeySequence(Qt.Key.Key_F11), self, activated=self._toggle_fullscreen)
        # Escape: Exit fullscreen
        QShortcut(QKeySequence(Qt.Key.Key_Escape), self, activated=self._exit_fullscreen)

    def _switch_engine(self, engine_id: str) -> None:
        """Instantiate and switch active simulation engine."""
        logger.info(f"Switching active engine to {engine_id}")
        self._engine = EngineRegistry.create_engine(engine_id)
        self._engine.speed = self._sim_speed

        self.canvas.set_engine(self._engine)
        self.inspector.set_engine(self._engine)
        self.nav_rail.set_active_engine(engine_id)
        self._update_status_bar()

    def _on_sim_tick(self) -> None:
        """Fixed simulation step and render update tick."""
        now = time.perf_counter()
        dt = min(now - self._last_frame_time, 0.1)
        self._last_frame_time = now

        if self._is_running:
            self._engine.step(dt)

        self.canvas.update_frame()

        # Update FPS telemetry every 0.5s
        self._fps_counter += 1
        elapsed = now - self._fps_timer
        if elapsed >= 0.5:
            self._current_fps = self._fps_counter / elapsed
            self._fps_counter = 0
            self._fps_timer = now
            self._update_status_bar()

    def _on_play_toggled(self, is_playing: bool) -> None:
        self._is_running = is_playing

    def _on_step(self) -> None:
        self._engine.step(0.016)
        self.canvas.update_frame()
        self._update_status_bar()

    def _on_reset(self) -> None:
        self._engine.reset()
        self.canvas.active_renderer.clear_canvas()
        self.canvas.update_frame()
        self._update_status_bar()

    def _on_random_seed(self) -> None:
        import numpy as np
        new_seed = int(np.random.default_rng().integers(1, 999999))
        self._engine.initialize(self.canvas.width(), self.canvas.height(), seed=new_seed)
        self.canvas.active_renderer.clear_canvas()
        self.canvas.update_frame()
        self._update_status_bar()
        Toast(f"{tr('status_seed')}: {new_seed}", self)

    def _on_speed_changed(self, spd: float) -> None:
        self._sim_speed = spd
        self._engine.speed = spd

    def _on_quality_changed(self, profile: str) -> None:
        """Apply performance profile constraints."""
        logger.info(f"Applying quality profile: {profile}")
        params = self._engine.get_parameters()
        eid = self._engine.engine_id

        if profile == "lite":
            if "num_particles" in params:
                params["num_particles"] = min(params["num_particles"], 600)
            if "num_agents" in params:
                params["num_agents"] = min(params["num_agents"], 2000)
            if "substeps" in params:
                params["substeps"] = 3
            if "trail_fade" in params:
                params["trail_fade"] = 0.85
        elif profile == "high":
            if "num_particles" in params:
                params["num_particles"] = max(params["num_particles"], 3500)
            if "num_agents" in params:
                params["num_agents"] = max(params["num_agents"], 10000)
            if "substeps" in params:
                params["substeps"] = 8
            if "trail_fade" in params:
                params["trail_fade"] = 0.98

        self._engine.set_parameters(params)
        self.inspector.set_engine(self._engine)
        Toast(f"{tr('quality_profile')}: {profile.capitalize()}", self)

    def _on_parameter_changed(self, key: str, value: Any) -> None:
        self._engine.set_parameters({key: value})

    def _on_matrix_val_changed(self, i: int, j: int, val: float) -> None:
        if hasattr(self._engine, "set_matrix_value"):
            self._engine.set_matrix_value(i, j, val)

    def _on_toggle_theme(self) -> None:
        self._current_theme = "light" if self._current_theme == "dark" else "dark"
        self.db.set_setting("theme", self._current_theme)
        self._apply_theme()
        self.top_bar.btn_theme.setText(tr("theme_light") if self._current_theme == "dark" else tr("theme_dark"))

    def _apply_theme(self) -> None:
        qss = generate_stylesheet(self._current_theme)
        QApplication.instance().setStyleSheet(qss)

    def _on_toggle_language(self) -> None:
        new_locale = "en" if get_locale() == "fa" else "fa"
        set_locale(new_locale)
        self.db.set_setting("locale", new_locale)

        self._apply_direction()
        self.top_bar.retranslate_ui()
        self.nav_rail.retranslate_ui()
        self.inspector.retranslate_ui()
        self._apply_theme()  # Re-apply for font family updates
        self._update_status_bar()
        Toast(f"Language: {new_locale.upper()}", self)

    def _apply_direction(self) -> None:
        direction = Qt.LayoutDirection.RightToLeft if is_rtl() else Qt.LayoutDirection.LeftToRight
        QApplication.instance().setLayoutDirection(direction)

    def _toggle_fullscreen(self) -> None:
        if self.isFullScreen():
            self.showNormal()
        else:
            self.showFullScreen()

    def _exit_fullscreen(self) -> None:
        if self.isFullScreen():
            self.showNormal()

    def _open_preset_browser(self) -> None:
        dlg = PresetBrowserDialog(self.preset_mgr, active_engine_id=self._engine.engine_id, parent=self)
        dlg.preset_applied.connect(self._apply_preset_data)
        dlg.exec()

    def _apply_preset_data(self, preset_data: dict[str, Any]) -> None:
        eid = preset_data["engine_id"]
        if eid != self._engine.engine_id:
            self._switch_engine(eid)

        if "seed" in preset_data:
            self._engine.seed = int(preset_data["seed"])

        self._engine.set_parameters(preset_data["parameters"])
        self._engine.reset()
        self.canvas.active_renderer.clear_canvas()
        self.inspector.set_engine(self._engine)
        Toast(f"{tr('btn_apply_preset')}: {preset_data['name']}", self)

    def _open_export_dialog(self) -> None:
        dlg = ExportDialog(self._engine, self)
        dlg.export_completed.connect(lambda path: Toast(f"{tr('export_success_toast')} {path}", self))
        dlg.exec()

    def _open_about_dialog(self) -> None:
        dlg = AboutDialog(self)
        dlg.exec()

    def _update_status_bar(self) -> None:
        state = tr("status_simulating") if self._is_running else tr("status_paused")
        backend = self.canvas.active_renderer.get_backend_name()
        count = self._engine.get_render_data().active_count
        frame_ms = 1000.0 / max(self._current_fps, 1.0)

        msg = (
            f"  {state}  |  "
            f"{tr('status_fps')}: {self._current_fps:.1f} ({frame_ms:.1f} ms)  |  "
            f"{tr('status_agents')}: {count:,}  |  "
            f"{tr('status_seed')}: {self._engine.seed}  |  "
            f"{tr('status_renderer')}: {backend}"
        )
        self.status_bar.showMessage(msg)
