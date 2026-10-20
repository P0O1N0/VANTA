"""
Video and frame-sequence export pipeline for VANTA.
Supports offline deterministic rendering, FFmpeg auto-detection, and sequence fallback.
"""

from __future__ import annotations

import shutil
import subprocess
from pathlib import Path
from typing import Callable
from PySide6.QtGui import QImage

from vanta.core.base_engine import BaseEngine
from vanta.rendering.software_renderer import SoftwareRenderer
from vanta.storage.database import Database
from vanta.utilities.logger import get_logger

logger = get_logger("export.video")


def check_ffmpeg_available() -> tuple[bool, str]:
    """Check if ffmpeg binary is installed and executable in PATH."""
    path = shutil.which("ffmpeg")
    if not path:
        return False, "FFmpeg binary not found in system PATH."
    try:
        proc = subprocess.run([path, "-version"], capture_output=True, text=True, timeout=3.0)
        first_line = proc.stdout.splitlines()[0] if proc.stdout else "FFmpeg detected"
        return True, first_line
    except Exception as e:
        return False, str(e)


class VideoExporter:
    """Exports deterministic simulation sequences to numbered PNG frames or MP4."""

    def __init__(self, db: Database | None = None):
        self.db = db
        self.is_cancelled = False

    def cancel(self) -> None:
        """Signal export task cancellation."""
        self.is_cancelled = True

    def export_sequence(
        self,
        engine: BaseEngine,
        output_dir: Path | str,
        duration_sec: float = 3.0,
        fps: int = 30,
        width: int = 1280,
        height: int = 720,
        progress_cb: Callable[[int, int], None] | None = None,
    ) -> Path:
        """
        Render deterministic frame-by-frame image sequence.
        Advances simulation with fixed dt = 1.0 / fps.
        """
        self.is_cancelled = False
        out_path = Path(output_dir).resolve()
        out_path.mkdir(parents=True, exist_ok=True)

        total_frames = int(duration_sec * fps)
        dt = 1.0 / max(fps, 1)

        from PySide6.QtWidgets import QApplication
        app = QApplication.instance()
        if app is None:
            app = QApplication(["--platform", "offscreen"])

        renderer = SoftwareRenderer()
        renderer.resize(width, height)

        logger.info(f"Starting frame sequence export: {total_frames} frames ({width}x{height}) at {fps} FPS.")

        for frame_idx in range(total_frames):
            if self.is_cancelled:
                logger.info("Export cancelled by user.")
                break

            # 1. Step simulation with exact fixed dt
            engine.step(dt)

            # 2. Render frame
            data = engine.get_render_data()
            renderer.set_render_data(data)
            qimg = renderer.render_to_image(width, height)

            # 3. Save frame file
            frame_file = out_path / f"frame_{frame_idx:05d}.png"
            qimg.save(str(frame_file), "PNG")

            if progress_cb:
                progress_cb(frame_idx + 1, total_frames)

        logger.info(f"Frame sequence exported successfully to {out_path}")
        return out_path

    def export_mp4(
        self,
        engine: BaseEngine,
        dest_file: Path | str,
        duration_sec: float = 3.0,
        fps: int = 30,
        width: int = 1280,
        height: int = 720,
        progress_cb: Callable[[int, int], None] | None = None,
    ) -> tuple[bool, str]:
        """
        Render and compile MP4 video using FFmpeg if available,
        or save image sequence as reliable fallback.
        """
        ffmpeg_ok, ffmpeg_info = check_ffmpeg_available()
        dest_path = Path(dest_file).resolve()

        if not ffmpeg_ok:
            # Fallback: export PNG sequence into folder
            seq_dir = dest_path.parent / dest_path.stem
            self.export_sequence(engine, seq_dir, duration_sec, fps, width, height, progress_cb)
            msg = (
                f"FFmpeg is not installed. Exported lossless PNG frame sequence to:\n{seq_dir}\n\n"
                f"To encode to MP4 manually, run:\n"
                f"ffmpeg -framerate {fps} -i frame_%05d.png -c:v libx264 -pix_fmt yuv420p {dest_path.name}"
            )
            return False, msg

        # Temporary frame directory
        temp_dir = dest_path.parent / f"_temp_{dest_path.stem}"
        temp_dir.mkdir(parents=True, exist_ok=True)

        try:
            self.export_sequence(engine, temp_dir, duration_sec, fps, width, height, progress_cb)
            if self.is_cancelled:
                shutil.rmtree(temp_dir, ignore_errors=True)
                return False, "Export cancelled."

            # Encode with ffmpeg
            cmd = [
                "ffmpeg",
                "-y",
                "-framerate", str(fps),
                "-i", str(temp_dir / "frame_%05d.png"),
                "-c:v", "libx264",
                "-pix_fmt", "yuv420p",
                "-crf", "18",
                str(dest_path),
            ]
            res = subprocess.run(cmd, capture_output=True, text=True, timeout=60.0)
            if res.returncode != 0:
                return False, f"FFmpeg encoding error: {res.stderr}"

            # Clean up temp frames
            shutil.rmtree(temp_dir, ignore_errors=True)
            return True, f"Video exported successfully to {dest_path}"

        except Exception as e:
            shutil.rmtree(temp_dir, ignore_errors=True)
            return False, f"Export error: {e}"
