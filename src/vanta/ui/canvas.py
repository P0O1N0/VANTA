"""
Canvas viewport widget hosting active renderer and translating user mouse/keyboard input to simulation events.
"""

from __future__ import annotations

from PySide6.QtCore import Qt, QPointF
from PySide6.QtGui import QMouseEvent, QWheelEvent
from PySide6.QtWidgets import QStackedLayout, QWidget

from vanta.core.base_engine import BaseEngine, RenderData
from vanta.rendering.base import BaseRenderer
from vanta.rendering.opengl_renderer import OpenGLRenderer
from vanta.rendering.software_renderer import SoftwareRenderer
from vanta.utilities.logger import get_logger

logger = get_logger("ui.canvas")


class SimulationCanvas(QWidget):
    """
    Main interactive simulation viewport.
    Hosts OpenGL or Software renderer and routes direct manipulation to the active engine.
    """

    def __init__(self, parent: QWidget | None = None, prefer_opengl: bool = True):
        super().__init__(parent)
        self.setMouseTracking(True)
        self.setFocusPolicy(Qt.FocusPolicy.StrongFocus)

        self._engine: BaseEngine | None = None
        self._is_mouse_down = False
        self._current_mouse_button = 0

        # Layout to host renderer widget
        self._layout = QStackedLayout(self)
        self._layout.setContentsMargins(0, 0, 0, 0)

        # Initialize preferred and fallback renderers
        self.software_renderer = SoftwareRenderer(self)
        self.opengl_renderer: OpenGLRenderer | None = None
        self.active_renderer: BaseRenderer

        if prefer_opengl:
            try:
                self.opengl_renderer = OpenGLRenderer(self)
                self._layout.addWidget(self.opengl_renderer)
                self.active_renderer = self.opengl_renderer
                logger.info("Canvas using OpenGLRenderer.")
            except Exception as exc:
                logger.warning(f"OpenGL renderer instantiation failed ({exc}); falling back to SoftwareRenderer.")
                self._layout.addWidget(self.software_renderer)
                self.active_renderer = self.software_renderer
        else:
            self._layout.addWidget(self.software_renderer)
            self.active_renderer = self.software_renderer

    def set_engine(self, engine: BaseEngine) -> None:
        """Bind active simulation engine to canvas and synchronize dimensions."""
        self._engine = engine
        self._engine.initialize(self.width(), self.height(), seed=self._engine.seed)
        self.active_renderer.clear_canvas()

    def update_frame(self) -> None:
        """Push current engine render payload to the active renderer."""
        if self._engine:
            data = self._engine.get_render_data()
            self.active_renderer.set_render_data(data)

    def switch_renderer(self, backend: str) -> None:
        """Switch active rendering pipeline ('opengl' or 'software')."""
        if backend == "opengl" and self.opengl_renderer is not None:
            self._layout.setCurrentWidget(self.opengl_renderer)
            self.active_renderer = self.opengl_renderer
            logger.info("Switched to OpenGLRenderer.")
        else:
            if self.software_renderer not in [self._layout.widget(i) for i in range(self._layout.count())]:
                self._layout.addWidget(self.software_renderer)
            self._layout.setCurrentWidget(self.software_renderer)
            self.active_renderer = self.software_renderer
            logger.info("Switched to SoftwareRenderer.")
        self.active_renderer.clear_canvas()

    def resizeEvent(self, event) -> None:
        super().resizeEvent(event)
        w = max(self.width(), 100)
        h = max(self.height(), 100)
        if self._engine:
            self._engine.width = w
            self._engine.height = h

    def mousePressEvent(self, event: QMouseEvent) -> None:
        self._is_mouse_down = True
        self._current_mouse_button = 1 if event.button() == Qt.MouseButton.LeftButton else 2
        self._dispatch_interaction(event.position())
        super().mousePressEvent(event)

    def mouseMoveEvent(self, event: QMouseEvent) -> None:
        if self._is_mouse_down:
            self._dispatch_interaction(event.position())
        super().mouseMoveEvent(event)

    def mouseReleaseEvent(self, event: QMouseEvent) -> None:
        self._is_mouse_down = False
        self._current_mouse_button = 0
        super().mouseReleaseEvent(event)

    def _dispatch_interaction(self, pos: QPointF) -> None:
        """Pass mouse coordinate interaction to active simulation engine."""
        if self._engine and self._current_mouse_button > 0:
            self._engine.interact(
                x=pos.x(),
                y=pos.y(),
                button=self._current_mouse_button,
                mode="interact",
            )
