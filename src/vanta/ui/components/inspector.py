"""
Dynamic contextual parameter inspector for VANTA studio.
Adapts controls automatically based on the currently active simulation engine.
"""

from __future__ import annotations

from typing import Any
import numpy as np
from PySide6.QtCore import Qt, Signal
from PySide6.QtWidgets import (
    QComboBox,
    QFrame,
    QGroupBox,
    QHBoxLayout,
    QLabel,
    QScrollArea,
    QSlider,
    QVBoxLayout,
    QWidget,
)

from vanta.core.base_engine import BaseEngine
from vanta.localization.i18n import tr
from vanta.ui.components.matrix_editor import MatrixEditor
from vanta.utilities.colors import PALETTES


class LabeledSlider(QWidget):
    """Reusable compact slider with descriptive title and numerical value display."""

    valueChanged = Signal(float)

    def __init__(
        self,
        title_key: str,
        min_val: float,
        max_val: float,
        current_val: float,
        scale: float = 1.0,
        is_float: bool = False,
        parent: QWidget | None = None,
    ):
        super().__init__(parent)
        self.title_key = title_key
        self.scale = scale
        self.is_float = is_float

        layout = QVBoxLayout(self)
        layout.setContentsMargins(0, 3, 0, 3)
        layout.setSpacing(2)

        # Header row: title on left, value on right
        hdr = QHBoxLayout()
        self.title_lbl = QLabel(tr(title_key))
        self.title_lbl.setStyleSheet("font-size: 11px; color: #8B949E;")
        hdr.addWidget(self.title_lbl)

        self.val_lbl = QLabel(self._format_val(current_val))
        self.val_lbl.setStyleSheet("font-size: 11px; font-weight: bold; color: #F0F6FC;")
        hdr.addWidget(self.val_lbl, alignment=Qt.AlignmentFlag.AlignRight)
        layout.addLayout(hdr)

        # Slider
        self.slider = QSlider(Qt.Orientation.Horizontal)
        self.slider.setRange(int(min_val * scale), int(max_val * scale))
        self.slider.setValue(int(current_val * scale))
        self.slider.valueChanged.connect(self._on_change)
        layout.addWidget(self.slider)

    def _format_val(self, val: float) -> str:
        return f"{val:.3f}" if self.is_float else f"{int(val)}"

    def _on_change(self, int_val: int) -> None:
        val = int_val / self.scale if self.scale != 1.0 else float(int_val)
        self.val_lbl.setText(self._format_val(val))
        self.valueChanged.emit(val)

    def set_value(self, val: float) -> None:
        self.slider.blockSignals(True)
        self.slider.setValue(int(val * self.scale))
        self.val_lbl.setText(self._format_val(val))
        self.slider.blockSignals(False)

    def retranslate(self) -> None:
        self.title_lbl.setText(tr(self.title_key))


class InspectorPanel(QFrame):
    """Contextual inspector that dynamically renders parameters for active engine."""

    parameter_changed = Signal(str, object)
    matrix_value_changed = Signal(int, int, float)

    def __init__(self, parent: QWidget | None = None):
        super().__init__(parent)
        self.setObjectName("panelFrame")
        self.setFixedWidth(290)

        self._sliders: dict[str, LabeledSlider] = {}
        self._current_engine: BaseEngine | None = None

        main_layout = QVBoxLayout(self)
        main_layout.setContentsMargins(6, 8, 6, 8)
        main_layout.setSpacing(4)

        # Title
        self.title_label = QLabel(tr("inspector_title"))
        self.title_label.setStyleSheet("font-size: 12px; font-weight: bold; color: #8B949E; padding-left: 4px;")
        main_layout.addWidget(self.title_label)

        # Scroll Area for dynamic contents
        self.scroll = QScrollArea()
        self.scroll.setWidgetResizable(True)
        self.scroll.setFrameShape(QFrame.Shape.NoFrame)
        self.scroll.setHorizontalScrollBarPolicy(Qt.ScrollBarPolicy.ScrollBarAlwaysOff)

        self.container = QWidget()
        self.content_layout = QVBoxLayout(self.container)
        self.content_layout.setContentsMargins(4, 4, 4, 4)
        self.content_layout.setSpacing(10)
        self.scroll.setWidget(self.container)

        main_layout.addWidget(self.scroll)

    def set_engine(self, engine: BaseEngine) -> None:
        """Rebuild controls based on active engine type."""
        self._current_engine = engine
        self._sliders.clear()

        # Clear existing widgets
        while self.content_layout.count():
            item = self.content_layout.takeAt(0)
            w = item.widget()
            if w:
                w.deleteLater()

        params = engine.get_parameters()
        eid = engine.engine_id

        # 1. Primary Simulation Parameters Group
        sim_group = QGroupBox(tr("section_simulation"))
        sim_layout = QVBoxLayout(sim_group)
        sim_layout.setSpacing(6)

        if eid == "particle_life":
            s_count = self._add_slider("num_particles", "param_particle_count", 200, 4000, params["num_particles"], sim_layout)
            s_spec = self._add_slider("num_species", "param_species_count", 2, 8, params["num_species"], sim_layout)
            s_rad = self._add_slider("r_max", "param_radius", 25.0, 160.0, params["r_max"], sim_layout, scale=1.0, is_float=True)
            s_fric = self._add_slider("friction", "param_damping", 0.60, 0.98, params["friction"], sim_layout, scale=100.0, is_float=True)
            s_spd = self._add_slider("max_velocity", "param_speed", 2.0, 18.0, params["max_velocity"], sim_layout, scale=10.0, is_float=True)

        elif eid == "physarum":
            s_count = self._add_slider("num_agents", "param_agent_count", 500, 15000, params["num_agents"], sim_layout)
            s_ang = self._add_slider("sensor_angle", "param_sensor_angle", 10.0, 80.0, params["sensor_angle"], sim_layout, scale=1.0, is_float=True)
            s_dist = self._add_slider("sensor_dist", "param_sensor_dist", 3.0, 35.0, params["sensor_dist"], sim_layout, scale=1.0, is_float=True)
            s_turn = self._add_slider("turn_angle", "param_turn_angle", 10.0, 80.0, params["turn_angle"], sim_layout, scale=1.0, is_float=True)
            s_step = self._add_slider("step_size", "param_step_size", 0.5, 4.0, params["step_size"], sim_layout, scale=10.0, is_float=True)
            s_decay = self._add_slider("decay_factor", "param_decay_factor", 0.02, 0.25, params["decay_factor"], sim_layout, scale=100.0, is_float=True)

        elif eid == "flow_field":
            s_count = self._add_slider("num_particles", "param_particle_count", 500, 10000, params["num_particles"], sim_layout)
            s_scale = self._add_slider("noise_scale", "param_noise_scale", 0.005, 0.040, params["noise_scale"], sim_layout, scale=1000.0, is_float=True)
            s_oct = self._add_slider("noise_octaves", "param_noise_octaves", 1, 5, params["noise_octaves"], sim_layout)
            s_spd = self._add_slider("particle_speed", "param_particle_speed", 1.0, 8.0, params["particle_speed"], sim_layout, scale=10.0, is_float=True)

        elif eid == "reaction_diffusion":
            s_feed = self._add_slider("feed_rate", "param_feed_rate", 0.010, 0.080, params["feed_rate"], sim_layout, scale=10000.0, is_float=True)
            s_kill = self._add_slider("kill_rate", "param_kill_rate", 0.040, 0.070, params["kill_rate"], sim_layout, scale=10000.0, is_float=True)
            s_sub = self._add_slider("substeps", "param_substeps", 2, 12, params["substeps"], sim_layout)

        self.content_layout.addWidget(sim_group)

        # 2. Visuals and Palette Group
        vis_group = QGroupBox(tr("section_visuals"))
        vis_layout = QVBoxLayout(vis_group)
        vis_layout.setSpacing(6)

        if "trail_fade" in params:
            self._add_slider("trail_fade", "param_trail_fade", 0.70, 0.99, params["trail_fade"], vis_layout, scale=100.0, is_float=True)

        # Palette Combo (if applicable)
        if "palette_name" in params:
            pal_lbl = QLabel(tr("param_color_palette"))
            pal_lbl.setStyleSheet("font-size: 11px; color: #8B949E;")
            vis_layout.addWidget(pal_lbl)

            combo_pal = QComboBox()
            for pkey, pal in PALETTES.items():
                combo_pal.addItem(pal.name, pkey)
            # Select current
            cur_p = params.get("palette_name", "neon_cyber")
            idx = combo_pal.findData(cur_p)
            if idx >= 0:
                combo_pal.setCurrentIndex(idx)
            combo_pal.currentIndexChanged.connect(lambda i, cb=combo_pal: self.parameter_changed.emit("palette_name", cb.itemData(i)))
            vis_layout.addWidget(combo_pal)

        self.content_layout.addWidget(vis_group)

        # 3. Particle Life Species Interaction Matrix (Only for Particle Life)
        if eid == "particle_life" and hasattr(engine, "matrix"):
            mat_group = QGroupBox(tr("section_matrix"))
            mat_layout = QVBoxLayout(mat_group)
            self.matrix_editor = MatrixEditor()
            self.matrix_editor.set_matrix(engine.matrix)
            self.matrix_editor.matrix_changed.connect(self._on_matrix_changed)
            self.matrix_editor.randomize_requested.connect(self._on_matrix_randomize)
            self.matrix_editor.zero_requested.connect(self._on_matrix_zero)
            mat_layout.addWidget(self.matrix_editor)
            self.content_layout.addWidget(mat_group)

        self.content_layout.addStretch()

    def _add_slider(
        self,
        param_name: str,
        title_key: str,
        min_v: float,
        max_v: float,
        curr_v: float,
        parent_layout: QVBoxLayout,
        scale: float = 1.0,
        is_float: bool = False,
    ) -> LabeledSlider:
        sl = LabeledSlider(title_key, min_v, max_v, curr_v, scale=scale, is_float=is_float)
        sl.valueChanged.connect(lambda val, k=param_name: self.parameter_changed.emit(k, val))
        parent_layout.addWidget(sl)
        self._sliders[param_name] = sl
        return sl

    def _on_matrix_changed(self, i: int, j: int, val: float) -> None:
        self.matrix_value_changed.emit(i, j, val)

    def _on_matrix_randomize(self) -> None:
        if self._current_engine and hasattr(self._current_engine, "randomize_matrix"):
            self._current_engine.randomize_matrix()
            self.matrix_editor.set_matrix(self._current_engine.matrix)
            self.parameter_changed.emit("matrix", self._current_engine.matrix.tolist())

    def _on_matrix_zero(self) -> None:
        if self._current_engine and hasattr(self._current_engine, "matrix"):
            self._current_engine.matrix.fill(0.0)
            self.matrix_editor.set_matrix(self._current_engine.matrix)
            self.parameter_changed.emit("matrix", self._current_engine.matrix.tolist())

    def retranslate_ui(self) -> None:
        self.title_label.setText(tr("inspector_title"))
        for sl in self._sliders.values():
            sl.retranslate()
