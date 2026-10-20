"""
About dialog for VANTA studio displaying project attribution, links, and system summary.
"""

from __future__ import annotations

from PySide6.QtCore import Qt
from PySide6.QtWidgets import (
    QDialog,
    QDialogButtonBox,
    QHBoxLayout,
    QLabel,
    QVBoxLayout,
    QWidget,
)

from vanta.config.settings import (
    APP_DESCRIPTOR,
    APP_NAME,
    APP_VERSION,
    AUTHOR_GITHUB,
    AUTHOR_NAME,
    AUTHOR_TELEGRAM,
)
from vanta.localization.i18n import tr


class AboutDialog(QDialog):
    """About dialog with verified authorship, clickable contact links, and architecture credits."""

    def __init__(self, parent: QWidget | None = None):
        super().__init__(parent)
        self.setWindowTitle(tr("about_title"))
        self.setFixedSize(420, 310)

        self._init_ui()

    def _init_ui(self) -> None:
        layout = QVBoxLayout(self)
        layout.setContentsMargins(24, 24, 24, 20)
        layout.setSpacing(14)

        # Title and version
        title_box = QVBoxLayout()
        title_box.setSpacing(2)

        title_lbl = QLabel(f"{APP_NAME} <span style='font-size: 13px; color: #8A2BE2;'>v{APP_VERSION}</span>")
        title_lbl.setStyleSheet("font-size: 20px; font-weight: 800; color: #F0F6FC;")
        title_box.addWidget(title_lbl)

        desc_lbl = QLabel(APP_DESCRIPTOR)
        desc_lbl.setStyleSheet("font-size: 13px; color: #8B949E; font-weight: 500;")
        title_box.addWidget(desc_lbl)
        layout.addLayout(title_box)

        # Description text
        body_lbl = QLabel(tr("about_description"))
        body_lbl.setWordWrap(True)
        body_lbl.setStyleSheet("font-size: 12px; color: #C9D1D9; line-height: 1.4;")
        layout.addWidget(body_lbl)

        # Author Attribution & Links
        attr_box = QVBoxLayout()
        attr_box.setSpacing(4)

        author_lbl = QLabel(f"<b>{tr('author_attribution')}</b>")
        author_lbl.setStyleSheet("font-size: 13px; color: #F0F6FC;")
        attr_box.addWidget(author_lbl)

        # Clickable Telegram link
        tg_lbl = QLabel(f'<a href="{AUTHOR_TELEGRAM}" style="color: #00F5D4; text-decoration: none;">Telegram: @P0O1N0</a>')
        tg_lbl.setOpenExternalLinks(True)
        tg_lbl.setTextInteractionFlags(Qt.TextInteractionFlag.TextBrowserInteraction)
        attr_box.addWidget(tg_lbl)

        # Clickable GitHub link
        gh_lbl = QLabel(f'<a href="{AUTHOR_GITHUB}" style="color: #8A2BE2; text-decoration: none;">GitHub: github.com/P0O1N0</a>')
        gh_lbl.setOpenExternalLinks(True)
        gh_lbl.setTextInteractionFlags(Qt.TextInteractionFlag.TextBrowserInteraction)
        attr_box.addWidget(gh_lbl)

        layout.addLayout(attr_box)

        # License
        lic_lbl = QLabel(tr("about_license"))
        lic_lbl.setStyleSheet("font-size: 11px; color: #6E7681;")
        layout.addWidget(lic_lbl)

        layout.addStretch()

        btns = QDialogButtonBox(QDialogButtonBox.StandardButton.Ok)
        btns.accepted.connect(self.accept)
        layout.addWidget(btns)
