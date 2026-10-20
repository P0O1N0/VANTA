"""
Export dialog for rendering still PNG images, frame sequences, or MP4 videos.
"""

from __future__ import annotations

from pathlib import Path
from PySide6.QtCore import Qt, QThread, Signal
from PySide6.QtWidgets import (
    QComboBox,
    QDialog,
    QFileDialog,
    QGroupBox,
    QHBoxLayout,
    QLabel,
    QLineEdit,
    QProgressBar,
    QPushButton,
    QRadioButton,
    QSpinBox,
    QVBoxLayout,
    QWidget,
)

from vanta.config.settings import get_exports_dir
from vanta.core.base_engine import BaseEngine
from vanta.export.image_exporter import ImageExporter
from vanta.export.video_exporter import VideoExporter
from vanta.localization.i18n import tr


class ExportWorker(QThread):
    """Background worker thread for frame sequence and video export."""

    progress_updated = Signal(int, int)
    finished_result = Signal(bool, str)

    def __init__(
        self,
        exporter: VideoExporter,
        engine: BaseEngine,
        dest_path: Path,
        duration: float,
        fps: int,
        width: int,
        height: int,
        is_video: bool,
    ):
        super().__init__()
        self.exporter = exporter
        self.engine = engine
        self.dest_path = dest_path
        self.duration = duration
        self.fps = fps
        self.width = width
        self.height = height
        self.is_video = is_video

    def run(self) -> None:
        try:
            if self.is_video:
                ok, msg = self.exporter.export_mp4(
                    self.engine,
                    self.dest_path,
                    self.duration,
                    self.fps,
                    self.width,
                    self.height,
                    progress_cb=self._on_progress,
                )
                self.finished_result.emit(ok, msg)
            else:
                self.exporter.export_sequence(
                    self.engine,
                    self.dest_path,
                    self.duration,
                    self.fps,
                    self.width,
                    self.height,
                    progress_cb=self._on_progress,
                )
                self.finished_result.emit(True, str(self.dest_path))
        except Exception as exc:
            self.finished_result.emit(False, str(exc))

    def _on_progress(self, current: int, total: int) -> None:
        self.progress_updated.emit(current, total)


class ExportDialog(QDialog):
    """Modal dialog configuring and triggering still image or sequence export."""

    export_completed = Signal(str)

    def __init__(self, engine: BaseEngine, parent: QWidget | None = None):
        super().__init__(parent)
        self.engine = engine
        self.setWindowTitle(tr("export_dialog_title"))
        self.setFixedSize(480, 420)

        self._init_ui()

    def _init_ui(self) -> None:
        layout = QVBoxLayout(self)
        layout.setContentsMargins(18, 18, 18, 18)
        layout.setSpacing(12)

        # 1. Export Type Selection
        type_group = QGroupBox("Export Format")
        type_layout = QVBoxLayout(type_group)

        self.radio_still = QRadioButton(tr("export_type_png"))
        self.radio_still.setChecked(True)
        self.radio_still.toggled.connect(self._on_type_toggled)
        type_layout.addWidget(self.radio_still)

        self.radio_sequence = QRadioButton(tr("export_type_sequence"))
        type_layout.addWidget(self.radio_sequence)
        layout.addWidget(type_group)

        # 2. Resolution Selection
        res_box = QHBoxLayout()
        res_lbl = QLabel(tr("export_resolution"))
        res_box.addWidget(res_lbl)

        self.combo_res = QComboBox()
        self.combo_res.addItem("Current Canvas Size", (0, 0))
        self.combo_res.addItem("720p HD (1280 × 720)", (1280, 720))
        self.combo_res.addItem("1080p Full HD (1920 × 1080)", (1920, 1080))
        self.combo_res.addItem("4K Ultra HD (3840 × 2160)", (3840, 2160))
        res_box.addWidget(self.combo_res)
        layout.addLayout(res_box)

        # 3. Sequence / Video options
        self.seq_group = QGroupBox("Sequence Options")
        seq_layout = QHBoxLayout(self.seq_group)

        dur_lbl = QLabel(tr("export_duration_sec"))
        seq_layout.addWidget(dur_lbl)
        self.spin_duration = QSpinBox()
        self.spin_duration.setRange(1, 30)
        self.spin_duration.setValue(3)
        seq_layout.addWidget(self.spin_duration)

        fps_lbl = QLabel(tr("export_framerate"))
        seq_layout.addWidget(fps_lbl)
        self.spin_fps = QSpinBox()
        self.spin_fps.setRange(15, 60)
        self.spin_fps.setValue(30)
        seq_layout.addWidget(self.spin_fps)

        self.seq_group.setEnabled(False)
        layout.addWidget(self.seq_group)

        # 4. Destination path
        path_box = QHBoxLayout()
        default_file = get_exports_dir() / f"{self.engine.engine_id}_export.png"
        self.edit_path = QLineEdit(str(default_file))
        path_box.addWidget(self.edit_path)

        self.btn_browse = QPushButton("Browse...")
        self.btn_browse.clicked.connect(self._on_browse)
        path_box.addWidget(self.btn_browse)
        layout.addLayout(path_box)

        # 5. Progress Bar
        self.progress_bar = QProgressBar()
        self.progress_bar.setVisible(False)
        layout.addWidget(self.progress_bar)

        layout.addStretch()

        # 6. Action buttons
        btn_box = QHBoxLayout()
        self.btn_cancel = QPushButton("Cancel")
        self.btn_cancel.clicked.connect(self.reject)
        btn_box.addWidget(self.btn_cancel)

        self.btn_start = QPushButton(tr("btn_start_export"))
        self.btn_start.setObjectName("primaryButton")
        self.btn_start.clicked.connect(self._on_start_export)
        btn_box.addWidget(self.btn_start)

        layout.addLayout(btn_box)

    def _on_type_toggled(self, is_still: bool) -> None:
        self.seq_group.setEnabled(not is_still)
        cur = Path(self.edit_path.text())
        if is_still:
            self.edit_path.setText(str(cur.with_suffix(".png")))
        else:
            self.edit_path.setText(str(cur.parent / cur.stem))

    def _on_browse(self) -> None:
        if self.radio_still.isChecked():
            path, _ = QFileDialog.getSaveFileName(
                self, "Save Image", str(get_exports_dir()), "PNG Image (*.png)"
            )
        else:
            path = QFileDialog.getExistingDirectory(self, "Select Output Directory", str(get_exports_dir()))
        if path:
            self.edit_path.setText(path)

    def _on_start_export(self) -> None:
        target_path = Path(self.edit_path.text())
        res_data = self.combo_res.currentData()
        w = res_data[0] if res_data[0] > 0 else self.engine.width
        h = res_data[1] if res_data[1] > 0 else self.engine.height

        if self.radio_still.isChecked():
            exporter = ImageExporter()
            try:
                res = exporter.export_still_image(self.engine, target_path, width=w, height=h)
                self.export_completed.emit(str(res))
                self.accept()
            except Exception as e:
                self.btn_start.setText(f"Error: {e}")
        else:
            # Frame sequence export in background thread
            self.progress_bar.setVisible(True)
            self.progress_bar.setRange(0, self.spin_duration.value() * self.spin_fps.value())
            self.btn_start.setEnabled(False)

            exporter = VideoExporter()
            self.worker = ExportWorker(
                exporter=exporter,
                engine=self.engine,
                dest_path=target_path,
                duration=float(self.spin_duration.value()),
                fps=self.spin_fps.value(),
                width=w,
                height=h,
                is_video=False,
            )
            self.worker.progress_updated.connect(self.progress_bar.setValue)
            self.worker.finished_result.connect(self._on_worker_finished)
            self.worker.start()

    def _on_worker_finished(self, success: bool, msg: str) -> None:
        self.btn_start.setEnabled(True)
        if success:
            self.export_completed.emit(msg)
            self.accept()
        else:
            self.btn_start.setText(f"Error: {msg}")
