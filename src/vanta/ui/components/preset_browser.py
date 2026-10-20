"""
Preset Browser and Gallery for VANTA: search, category filters, and one-click application.
"""

from __future__ import annotations

from typing import Any
from PySide6.QtCore import Qt, Signal
from PySide6.QtWidgets import (
    QDialog,
    QFrame,
    QHBoxLayout,
    QLabel,
    QLineEdit,
    QListWidget,
    QListWidgetItem,
    QPushButton,
    QVBoxLayout,
    QWidget,
)

from vanta.localization.i18n import tr
from vanta.presets.preset_manager import PresetManager


class PresetCardWidget(QWidget):
    """Visual card displaying preset title, category badge, and concise description."""

    def __init__(self, preset_data: dict[str, Any], parent: QWidget | None = None):
        super().__init__(parent)
        layout = QVBoxLayout(self)
        layout.setContentsMargins(10, 8, 10, 8)
        layout.setSpacing(4)

        # Header row: Name + Category badge
        hdr = QHBoxLayout()
        name_lbl = QLabel(preset_data["name"])
        name_lbl.setStyleSheet("font-size: 13px; font-weight: bold; color: #F0F6FC;")
        hdr.addWidget(name_lbl)

        cat_lbl = QLabel(preset_data.get("category", "General"))
        cat_lbl.setStyleSheet(
            "font-size: 10px; color: #8A2BE2; background-color: #1F242C; "
            "border: 1px solid #3D2066; border-radius: 3px; padding: 2px 6px;"
        )
        hdr.addWidget(cat_lbl, alignment=Qt.AlignmentFlag.AlignRight)
        layout.addLayout(hdr)

        # Description
        desc = preset_data.get("description", "")
        if desc:
            desc_lbl = QLabel(desc)
            desc_lbl.setStyleSheet("font-size: 11px; color: #8B949E;")
            desc_lbl.setWordWrap(True)
            layout.addWidget(desc_lbl)


class PresetBrowserDialog(QDialog):
    """Dialog browsing curated factory presets and saved user presets."""

    preset_applied = Signal(dict)

    def __init__(self, preset_mgr: PresetManager, active_engine_id: str | None = None, parent: QWidget | None = None):
        super().__init__(parent)
        self.preset_mgr = preset_mgr
        self.active_engine_id = active_engine_id
        self.setWindowTitle(tr("preset_browser_title"))
        self.resize(520, 560)

        self._all_presets: list[dict[str, Any]] = []
        self._init_ui()
        self._load_presets()

    def _init_ui(self) -> None:
        layout = QVBoxLayout(self)
        layout.setContentsMargins(16, 16, 16, 16)
        layout.setSpacing(12)

        # 1. Search Bar
        self.search_edit = QLineEdit()
        self.search_edit.setPlaceholderText(tr("search_presets_placeholder"))
        self.search_edit.textChanged.connect(self._filter_presets)
        layout.addWidget(self.search_edit)

        # 2. Category Filter Buttons
        cat_box = QHBoxLayout()
        cat_box.setSpacing(6)
        categories = ["All", "Cosmic", "Biological", "Fluid Dynamics", "Abstract Math"]
        self.cat_buttons = []
        for cat in categories:
            btn = QPushButton(cat)
            btn.setCheckable(True)
            if cat == "All":
                btn.setChecked(True)
            btn.clicked.connect(lambda checked, c=cat: self._on_category_clicked(c))
            cat_box.addWidget(btn)
            self.cat_buttons.append(btn)
        layout.addLayout(cat_box)

        # 3. Presets List Widget
        self.list_widget = QListWidget()
        self.list_widget.setStyleSheet(
            "QListWidget::item { border-bottom: 1px solid #21262D; } "
            "QListWidget::item:selected { background-color: #1F242C; }"
        )
        self.list_widget.itemDoubleClicked.connect(self._on_item_double_clicked)
        layout.addWidget(self.list_widget)

        # 4. Action Buttons
        btn_box = QHBoxLayout()
        btn_box.addStretch()

        self.btn_apply = QPushButton(tr("btn_apply_preset"))
        self.btn_apply.setObjectName("primaryButton")
        self.btn_apply.clicked.connect(self._on_apply_clicked)
        btn_box.addWidget(self.btn_apply)

        layout.addLayout(btn_box)

    def _load_presets(self) -> None:
        self._all_presets = self.preset_mgr.get_presets(self.active_engine_id)
        self._render_list(self._all_presets)

    def _render_list(self, presets: list[dict[str, Any]]) -> None:
        self.list_widget.clear()
        for p in presets:
            item = QListWidgetItem(self.list_widget)
            card = PresetCardWidget(p)
            item.setSizeHint(card.sizeHint())
            item.setData(Qt.ItemDataRole.UserRole, p)
            self.list_widget.addItem(item)
            self.list_widget.setItemWidget(item, card)

    def _on_category_clicked(self, selected_cat: str) -> None:
        for btn in self.cat_buttons:
            btn.setChecked(btn.text() == selected_cat)
        self._filter_presets()

    def _filter_presets(self) -> None:
        query = self.search_edit.text().strip().lower()
        active_cat = "All"
        for btn in self.cat_buttons:
            if btn.isChecked():
                active_cat = btn.text()
                break

        filtered = []
        for p in self._all_presets:
            match_cat = (active_cat == "All") or (p.get("category") == active_cat)
            match_query = (not query) or (query in p["name"].lower()) or (query in p.get("description", "").lower())
            if match_cat and match_query:
                filtered.append(p)

        self._render_list(filtered)

    def _on_apply_clicked(self) -> None:
        cur_item = self.list_widget.currentItem()
        if cur_item:
            preset_data = cur_item.data(Qt.ItemDataRole.UserRole)
            self.preset_applied.emit(preset_data)
            self.accept()

    def _on_item_double_clicked(self, item: QListWidgetItem) -> None:
        preset_data = item.data(Qt.ItemDataRole.UserRole)
        self.preset_applied.emit(preset_data)
        self.accept()
