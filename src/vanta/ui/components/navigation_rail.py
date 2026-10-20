"""
Collapsible left navigation rail for switching engines, opening presets, and managing projects.
"""

from __future__ import annotations

from PySide6.QtCore import Qt, Signal
from PySide6.QtWidgets import (
    QButtonGroup,
    QFrame,
    QHBoxLayout,
    QLabel,
    QPushButton,
    QVBoxLayout,
    QWidget,
)

from vanta.core.engine_registry import EngineRegistry
from vanta.localization.i18n import tr


class NavigationRail(QFrame):
    """Side navigation rail providing fast access to engines and studio library."""

    engine_selected = Signal(str)
    presets_clicked = Signal()
    projects_clicked = Signal()

    def __init__(self, parent: QWidget | None = None):
        super().__init__(parent)
        self.setObjectName("panelFrame")
        self.setFixedWidth(210)
        self._buttons: dict[str, QPushButton] = {}
        self._button_group = QButtonGroup(self)
        self._button_group.setExclusive(True)

        self._init_ui()

    def _init_ui(self) -> None:
        layout = QVBoxLayout(self)
        layout.setContentsMargins(8, 12, 8, 12)
        layout.setSpacing(6)

        # Header
        self.header_label = QLabel(tr("menu_engines"))
        self.header_label.setStyleSheet("font-size: 11px; font-weight: bold; color: #8B949E; padding-left: 6px;")
        layout.addWidget(self.header_label)

        # Engine buttons
        engine_icons = {
            "particle_life": "⚛",
            "physarum": "🌿",
            "flow_field": "🌊",
            "reaction_diffusion": "🧬",
        }

        for eid in EngineRegistry.list_engine_ids():
            icon = engine_icons.get(eid, "•")
            meta = EngineRegistry.get_metadata(eid)
            btn = QPushButton(f"{icon}  {tr(meta.get('name_key', eid))}")
            btn.setObjectName("navButton")
            btn.setCheckable(True)
            btn.clicked.connect(lambda checked, e=eid: self.engine_selected.emit(e))

            self._buttons[eid] = btn
            self._button_group.addButton(btn)
            layout.addWidget(btn)

        # Default selection
        if "particle_life" in self._buttons:
            self._buttons["particle_life"].setChecked(True)

        layout.addSpacing(12)

        # Separator line
        sep = QFrame()
        sep.setFrameShape(QFrame.Shape.HLine)
        sep.setStyleSheet("color: #30363D;")
        layout.addWidget(sep)

        # Presets & Library
        self.btn_presets = QPushButton(f"✨ {tr('menu_presets')}")
        self.btn_presets.setObjectName("navButton")
        self.btn_presets.clicked.connect(self.presets_clicked.emit)
        layout.addWidget(self.btn_presets)

        layout.addStretch()

    def set_active_engine(self, engine_id: str) -> None:
        """Update selected state programmatically."""
        if engine_id in self._buttons:
            self._buttons[engine_id].setChecked(True)

    def retranslate_ui(self) -> None:
        self.header_label.setText(tr("menu_engines"))
        self.btn_presets.setText(f"✨ {tr('menu_presets')}")

        engine_icons = {
            "particle_life": "⚛",
            "physarum": "🌿",
            "flow_field": "🌊",
            "reaction_diffusion": "🧬",
        }
        for eid, btn in self._buttons.items():
            meta = EngineRegistry.get_metadata(eid)
            icon = engine_icons.get(eid, "•")
            btn.setText(f"{icon}  {tr(meta.get('name_key', eid))}")
