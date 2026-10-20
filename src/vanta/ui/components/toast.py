"""
Floating non-blocking toast notifications for user feedback and export confirmations.
"""

from __future__ import annotations

from PySide6.QtCore import Qt, QTimer
from PySide6.QtWidgets import QFrame, QHBoxLayout, QLabel, QWidget


class Toast(QFrame):
    """Floating notification banner that automatically fades away after a duration."""

    def __init__(self, message: str, parent: QWidget, is_error: bool = False, duration_ms: int = 3500):
        super().__init__(parent)
        self.setObjectName("panelFrame")

        bg = "#381014" if is_error else "#16231A"
        border = "#DA3633" if is_error else "#238636"
        text_color = "#FFA6A6" if is_error else "#7EE787"

        self.setStyleSheet(
            f"background-color: {bg}; border: 1px solid {border}; border-radius: 6px; padding: 6px 14px;"
        )

        layout = QHBoxLayout(self)
        layout.setContentsMargins(12, 8, 12, 8)

        lbl = QLabel(message)
        lbl.setStyleSheet(f"color: {text_color}; font-size: 12px; font-weight: 500;")
        layout.addWidget(lbl)

        self.adjustSize()
        self._position(parent)
        self.show()

        QTimer.singleShot(duration_ms, self._dismiss)

    def _position(self, parent: QWidget) -> None:
        p_w = parent.width()
        p_h = parent.height()
        w = self.width()
        h = self.height()
        # Position at bottom center of parent
        self.move(int((p_w - w) / 2), int(p_h - h - 24))

    def _dismiss(self) -> None:
        self.deleteLater()
