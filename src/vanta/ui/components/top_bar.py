"""
Top control bar for VANTA studio: playback, speed, seed, theme, language, and export.
"""

from __future__ import annotations

from PySide6.QtCore import Qt, Signal
from PySide6.QtWidgets import (
    QComboBox,
    QFrame,
    QHBoxLayout,
    QLabel,
    QPushButton,
    QSlider,
    QWidget,
)

from vanta.config.settings import APP_NAME, APP_DESCRIPTOR
from vanta.localization.i18n import tr, is_rtl


class TopBar(QFrame):
    """Refined application header with global simulation controls and studio actions."""

    # Signals
    play_toggled = Signal(bool)          # True = play, False = pause
    step_requested = Signal()
    reset_requested = Signal()
    random_seed_requested = Signal()
    speed_changed = Signal(float)
    quality_changed = Signal(str)
    theme_toggled = Signal()
    language_toggled = Signal()
    export_requested = Signal()
    about_requested = Signal()

    def __init__(self, parent: QWidget | None = None):
        super().__init__(parent)
        self.setObjectName("panelFrame")
        self.setFixedHeight(54)
        self._is_playing = True

        self._init_ui()

    def _init_ui(self) -> None:
        layout = QHBoxLayout(self)
        layout.setContentsMargins(14, 0, 14, 0)
        layout.setSpacing(10)

        # 1. Branding: Logo Title + Subtitle
        brand_box = QHBoxLayout()
        brand_box.setSpacing(8)

        self.title_label = QLabel(APP_NAME)
        self.title_label.setStyleSheet("font-size: 16px; font-weight: 800; color: #8A2BE2; letter-spacing: 1px;")
        brand_box.addWidget(self.title_label)

        self.desc_label = QLabel(f"• {APP_DESCRIPTOR}")
        self.desc_label.setStyleSheet("font-size: 11px; color: #8B949E; font-weight: 500;")
        brand_box.addWidget(self.desc_label)

        layout.addLayout(brand_box)
        layout.addSpacing(12)

        # 2. Playback controls: Play/Pause, Step, Reset
        self.btn_play = QPushButton(tr("btn_pause"))
        self.btn_play.setObjectName("primaryButton")
        self.btn_play.setFixedWidth(72)
        self.btn_play.clicked.connect(self._on_play_clicked)
        layout.addWidget(self.btn_play)

        self.btn_step = QPushButton(tr("btn_step"))
        self.btn_step.setFixedWidth(64)
        self.btn_step.clicked.connect(self.step_requested.emit)
        layout.addWidget(self.btn_step)

        self.btn_reset = QPushButton(tr("btn_reset"))
        self.btn_reset.setFixedWidth(68)
        self.btn_reset.clicked.connect(self.reset_requested.emit)
        layout.addWidget(self.btn_reset)

        layout.addSpacing(8)

        # 3. Speed slider
        self.speed_label = QLabel("1.0x")
        self.speed_label.setStyleSheet("font-size: 11px; font-weight: bold; min-width: 32px;")

        self.speed_slider = QSlider(Qt.Orientation.Horizontal)
        self.speed_slider.setRange(2, 30)  # 0.2x to 3.0x
        self.speed_slider.setValue(10)     # 1.0x
        self.speed_slider.setFixedWidth(80)
        self.speed_slider.valueChanged.connect(self._on_speed_changed)

        layout.addWidget(self.speed_slider)
        layout.addWidget(self.speed_label)

        # 4. Seed randomizer
        self.btn_seed = QPushButton(tr("btn_seed_random"))
        self.btn_seed.clicked.connect(self.random_seed_requested.emit)
        layout.addWidget(self.btn_seed)

        layout.addStretch()

        # 5. Quality Profile Selector
        self.combo_quality = QComboBox()
        self.combo_quality.addItem(tr("profile_balanced"), "balanced")
        self.combo_quality.addItem(tr("profile_lite"), "lite")
        self.combo_quality.addItem(tr("profile_high"), "high")
        self.combo_quality.currentIndexChanged.connect(self._on_quality_changed)
        layout.addWidget(self.combo_quality)

        # 6. Theme and Language Toggles
        self.btn_theme = QPushButton(tr("theme_light"))
        self.btn_theme.clicked.connect(self.theme_toggled.emit)
        layout.addWidget(self.btn_theme)

        self.btn_lang = QPushButton(tr("language_switch"))
        self.btn_lang.clicked.connect(self.language_toggled.emit)
        layout.addWidget(self.btn_lang)

        # 7. Export button
        self.btn_export = QPushButton(f"📷 {tr('btn_export')}")
        self.btn_export.setObjectName("primaryButton")
        self.btn_export.clicked.connect(self.export_requested.emit)
        layout.addWidget(self.btn_export)

        # 8. About dialog button
        self.btn_about = QPushButton(tr("btn_about"))
        self.btn_about.clicked.connect(self.about_requested.emit)
        layout.addWidget(self.btn_about)

    def _on_play_clicked(self) -> None:
        self._is_playing = not self._is_playing
        self.btn_play.setText(tr("btn_pause") if self._is_playing else tr("btn_play"))
        self.play_toggled.emit(self._is_playing)

    def set_playing_state(self, is_playing: bool) -> None:
        self._is_playing = is_playing
        self.btn_play.setText(tr("btn_pause") if self._is_playing else tr("btn_play"))

    def _on_speed_changed(self, val: int) -> None:
        spd = val / 10.0
        self.speed_label.setText(f"{spd:.1f}x")
        self.speed_changed.emit(spd)

    def _on_quality_changed(self, idx: int) -> None:
        profile_key = self.combo_quality.itemData(idx)
        self.quality_changed.emit(profile_key)

    def retranslate_ui(self) -> None:
        """Update visible labels and buttons when locale changes."""
        self.desc_label.setText(f"• {APP_DESCRIPTOR}")
        self.btn_play.setText(tr("btn_pause") if self._is_playing else tr("btn_play"))
        self.btn_step.setText(tr("btn_step"))
        self.btn_reset.setText(tr("btn_reset"))
        self.btn_seed.setText(tr("btn_seed_random"))
        self.btn_lang.setText(tr("language_switch"))
        self.btn_export.setText(f"📷 {tr('btn_export')}")
        self.btn_about.setText(tr("btn_about"))

        cur_idx = self.combo_quality.currentIndex()
        self.combo_quality.setItemText(0, tr("profile_balanced"))
        self.combo_quality.setItemText(1, tr("profile_lite"))
        self.combo_quality.setItemText(2, tr("profile_high"))
        self.combo_quality.setCurrentIndex(cur_idx)
