"""
Base renderer abstract interface and common rendering abstractions for VANTA.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any
from PySide6.QtGui import QImage
from vanta.core.base_engine import RenderData


class BaseRenderer:
    """Abstract interface implemented by both OpenGL and Software renderers."""

    def set_render_data(self, data: RenderData) -> None:
        """Deliver current frame render payload to the renderer."""
        raise NotImplementedError

    def render_to_image(self, width: int | None = None, height: int | None = None) -> QImage:
        """Render the current frame to an offscreen QImage for export or thumbnail."""
        raise NotImplementedError

    def clear_canvas(self) -> None:
        """Clear visual accumulation and trail buffers."""
        raise NotImplementedError

    def get_backend_name(self) -> str:
        """Return human-readable renderer backend name."""
        raise NotImplementedError
