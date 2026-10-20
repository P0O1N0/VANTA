"""
High-resolution PNG image exporter and thumbnail generator for VANTA.
"""

from __future__ import annotations

from pathlib import Path
from PySide6.QtGui import QImage
from vanta.core.base_engine import BaseEngine
from vanta.rendering.software_renderer import SoftwareRenderer
from vanta.storage.database import Database
from vanta.utilities.logger import get_logger

logger = get_logger("export.image")


class ImageExporter:
    """Exports simulation frames to PNG images and generates preset thumbnails."""

    def __init__(self, db: Database | None = None):
        self.db = db

    def export_still_image(
        self,
        engine: BaseEngine,
        filepath: Path | str,
        width: int = 1920,
        height: int = 1080,
    ) -> Path:
        """Render high-resolution still image using offscreen software renderer."""
        dest = Path(filepath).resolve()
        if dest.suffix.lower() != ".png":
            dest = dest.with_suffix(".png")

        dest.parent.mkdir(parents=True, exist_ok=True)

        from PySide6.QtWidgets import QApplication
        app = QApplication.instance()
        if app is None:
            app = QApplication(["--platform", "offscreen"])

        # Offscreen renderer
        renderer = SoftwareRenderer()
        renderer.resize(width, height)

        # Grab current engine render data
        render_data = engine.get_render_data()
        renderer.set_render_data(render_data)

        # Render offscreen image
        qimg = renderer.render_to_image(width, height)
        success = qimg.save(str(dest), "PNG", 100)

        if not success:
            raise IOError(f"Failed to save PNG image to {dest}")

        if self.db:
            try:
                self.db.record_export(
                    filename=dest.name,
                    filepath=str(dest),
                    export_type="PNG Still",
                    engine_id=engine.engine_id,
                    width=width,
                    height=height,
                )
            except Exception as e:
                logger.warning(f"Could not record export event: {e}")

        logger.info(f"Exported high-res PNG ({width}x{height}) to {dest}")
        return dest

    def generate_thumbnail(
        self,
        engine: BaseEngine,
        dest_path: Path | str,
        thumb_size: tuple[int, int] = (240, 160),
    ) -> Path:
        """Render small thumbnail image for preset gallery or project cards."""
        return self.export_still_image(
            engine=engine,
            filepath=dest_path,
            width=thumb_size[0],
            height=thumb_size[1],
        )
