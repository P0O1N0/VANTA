"""
Interactive species-to-species interaction matrix editor for Particle Life.
Visualizes attractive and repulsive coefficients as a color-coded heatmap grid.
"""

from __future__ import annotations

from typing import Callable
import numpy as np
from PySide6.QtCore import Qt, Signal
from PySide6.QtGui import QColor
from PySide6.QtWidgets import (
    QDialog,
    QDialogButtonBox,
    QFrame,
    QGridLayout,
    QHBoxLayout,
    QLabel,
    QPushButton,
    QSlider,
    QVBoxLayout,
    QWidget,
)

from vanta.utilities.colors import get_species_hex


class MatrixCellDialog(QDialog):
    """Mini modal dialog to fine-tune a single matrix cell value with a slider."""

    def __init__(self, i: int, j: int, current_val: float, parent: QWidget | None = None):
        super().__init__(parent)
        self.setWindowTitle(f"Species {i+1} ➔ Species {j+1}")
        self.setFixedSize(260, 140)

        layout = QVBoxLayout(self)

        self.label = QLabel(f"Force: {current_val:+.2f}")
        self.label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.label.setStyleSheet("font-size: 14px; font-weight: bold;")
        layout.addWidget(self.label)

        self.slider = QSlider(Qt.Orientation.Horizontal)
        self.slider.setRange(-100, 100)
        self.slider.setValue(int(current_val * 100))
        self.slider.valueChanged.connect(self._on_slider)
        layout.addWidget(self.slider)

        btns = QDialogButtonBox(QDialogButtonBox.StandardButton.Ok | QDialogButtonBox.StandardButton.Cancel)
        btns.accepted.connect(self.accept)
        btns.rejected.connect(self.reject)
        layout.addWidget(btns)

    def _on_slider(self, val: int) -> None:
        self.label.setText(f"Force: {val / 100.0:+.2f}")

    def get_value(self) -> float:
        return self.slider.value() / 100.0


class MatrixEditor(QFrame):
    """Compact interactive heatmap grid editor for inter-species force matrix."""

    matrix_changed = Signal(int, int, float)  # (i, j, value)
    randomize_requested = Signal()
    zero_requested = Signal()

    def __init__(self, parent: QWidget | None = None):
        super().__init__(parent)
        self.setObjectName("panelFrame")
        self._matrix = np.zeros((4, 4), dtype=np.float32)
        self._buttons: list[list[QPushButton]] = []

        self._main_layout = QVBoxLayout(self)
        self._main_layout.setContentsMargins(6, 6, 6, 6)
        self._main_layout.setSpacing(6)

        self._grid_widget = QWidget()
        self._grid_layout = QGridLayout(self._grid_widget)
        self._grid_layout.setSpacing(2)
        self._grid_layout.setContentsMargins(0, 0, 0, 0)
        self._main_layout.addWidget(self._grid_widget)

        # Quick action buttons
        actions_box = QHBoxLayout()
        actions_box.setSpacing(4)

        self.btn_rand = QPushButton("Randomize")
        self.btn_rand.setStyleSheet("font-size: 11px; padding: 3px 6px;")
        self.btn_rand.clicked.connect(self.randomize_requested.emit)
        actions_box.addWidget(self.btn_rand)

        self.btn_zero = QPushButton("Clear")
        self.btn_zero.setStyleSheet("font-size: 11px; padding: 3px 6px;")
        self.btn_zero.clicked.connect(self.zero_requested.emit)
        actions_box.addWidget(self.btn_zero)

        self._main_layout.addLayout(actions_box)

    def set_matrix(self, matrix: np.ndarray) -> None:
        """Update grid layout and values to match numpy matrix shape and values."""
        self._matrix = np.array(matrix, dtype=np.float32)
        rows, cols = self._matrix.shape

        # Clear existing grid widgets
        while self._grid_layout.count():
            item = self._grid_layout.takeAt(0)
            w = item.widget()
            if w:
                w.deleteLater()

        self._buttons = []

        # Build column and row headers
        for c in range(cols):
            dot = QLabel("●")
            dot.setAlignment(Qt.AlignmentFlag.AlignCenter)
            dot.setStyleSheet(f"color: {get_species_hex(c)}; font-size: 10px;")
            self._grid_layout.addWidget(dot, 0, c + 1)

        for r in range(rows):
            dot = QLabel("●")
            dot.setAlignment(Qt.AlignmentFlag.AlignCenter)
            dot.setStyleSheet(f"color: {get_species_hex(r)}; font-size: 10px;")
            self._grid_layout.addWidget(dot, r + 1, 0)

            row_btns = []
            for c in range(cols):
                val = float(self._matrix[r, c])
                btn = QPushButton(f"{val:+.1f}")
                btn.setFixedSize(36, 26)
                self._style_cell_button(btn, val)
                btn.clicked.connect(lambda checked, i=r, j=c: self._open_cell_dialog(i, j))
                self._grid_layout.addWidget(btn, r + 1, c + 1)
                row_btns.append(btn)
            self._buttons.append(row_btns)

    def _style_cell_button(self, btn: QPushButton, val: float) -> None:
        """Color-code button: green tint for attraction (>0), red tint for repulsion (<0)."""
        if val > 0.05:
            # Attraction: Green tint
            intensity = int(min(val, 1.0) * 160)
            btn.setStyleSheet(f"background-color: rgba(35, 134, 54, {intensity}); color: #FFFFFF; font-size: 10px; border: 1px solid #30363D; border-radius: 2px;")
        elif val < -0.05:
            # Repulsion: Red tint
            intensity = int(min(abs(val), 1.0) * 160)
            btn.setStyleSheet(f"background-color: rgba(218, 54, 51, {intensity}); color: #FFFFFF; font-size: 10px; border: 1px solid #30363D; border-radius: 2px;")
        else:
            # Neutral: Dark gray
            btn.setStyleSheet("background-color: #21262D; color: #8B949E; font-size: 10px; border: 1px solid #30363D; border-radius: 2px;")

    def _open_cell_dialog(self, i: int, j: int) -> None:
        cur_val = float(self._matrix[i, j])
        dlg = MatrixCellDialog(i, j, cur_val, self)
        if dlg.exec() == QDialog.DialogCode.Accepted:
            new_val = dlg.get_value()
            self._matrix[i, j] = new_val
            btn = self._buttons[i][j]
            btn.setText(f"{new_val:+.1f}")
            self._style_cell_button(btn, new_val)
            self.matrix_changed.emit(i, j, new_val)
