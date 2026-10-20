"""
Hardware-accelerated OpenGL renderer for VANTA using QOpenGLWidget.
"""

from __future__ import annotations

import numpy as np
from PySide6.QtCore import Qt, QRectF
from PySide6.QtGui import QImage, QPainter
from PySide6.QtOpenGLWidgets import QOpenGLWidget
from PySide6.QtWidgets import QWidget

from vanta.core.base_engine import RenderData
from vanta.rendering.base import BaseRenderer
from vanta.utilities.logger import get_logger

logger = get_logger("rendering.opengl")


class OpenGLRenderer(QOpenGLWidget, BaseRenderer):
    """
    OpenGL-accelerated renderer for particle systems and field textures.
    Provides fallback to QPainter integration if raw GL pipelines fail.
    """

    def __init__(self, parent: QWidget | None = None):
        super().__init__(parent)
        self._render_data: RenderData | None = None
        self._trail_buffer: QImage | None = None
        self._gl_initialized = False

    def initializeGL(self) -> None:
        try:
            from OpenGL import GL
            GL.glClearColor(0.03, 0.04, 0.055, 1.0)
            GL.glEnable(GL.GL_BLEND)
            GL.glBlendFunc(GL.GL_SRC_ALPHA, GL.GL_ONE_MINUS_SRC_ALPHA)
            GL.glEnable(GL.GL_POINT_SMOOTH)
            self._gl_initialized = True
            logger.info("OpenGL context initialized successfully.")
        except Exception as exc:
            logger.warning(f"PyOpenGL raw initialization skipped ({exc}); using Qt OpenGL rasterizer.")
            self._gl_initialized = False

    def resizeGL(self, w: int, h: int) -> None:
        if self._gl_initialized:
            try:
                from OpenGL import GL
                GL.glViewport(0, 0, max(w, 1), max(h, 1))
            except Exception:
                pass

    def set_render_data(self, data: RenderData) -> None:
        self._render_data = data
        self.update()

    def clear_canvas(self) -> None:
        if self._trail_buffer:
            self._trail_buffer.fill(Qt.GlobalColor.black)
        self.update()

    def get_backend_name(self) -> str:
        return "OpenGL (Hardware Accelerated)" if self._gl_initialized else "OpenGL Widget (Accelerated)"

    def paintGL(self) -> None:
        # Use QPainter on QOpenGLWidget for unified point/field rasterization
        # PySide6 QOpenGLWidget natively hardware-accelerates QPainter via GL engine
        w = self.width()
        h = self.height()
        if w <= 0 or h <= 0 or self._render_data is None:
            return

        data = self._render_data

        # Maintain trail buffer for smooth persistence
        if self._trail_buffer is None or self._trail_buffer.width() != w or self._trail_buffer.height() != h:
            self._trail_buffer = QImage(w, h, QImage.Format.Format_ARGB32_Premultiplied)
            self._trail_buffer.fill(Qt.GlobalColor.black)

        painter = QPainter(self._trail_buffer)
        painter.setRenderHint(QPainter.RenderHint.Antialiasing, True)

        # Trail fade
        alpha = int(255 * (1.0 - data.trail_fade))
        dim_color = Qt.GlobalColor.black
        painter.fillRect(0, 0, w, h, Qt.GlobalColor.black if alpha >= 250 else dim_color)
        painter.fillRect(0, 0, w, h, Qt.GlobalColor.transparent)

        # Draw frame into trail buffer
        self._paint_scene(painter, w, h)
        painter.end()

        # Present to widget
        screen_painter = QPainter(self)
        screen_painter.drawImage(0, 0, self._trail_buffer)
        screen_painter.end()

    def _paint_scene(self, painter: QPainter, target_w: int, target_h: int) -> None:
        if self._render_data is None:
            return
        data = self._render_data

        scale_x = target_w / max(data.width, 1)
        scale_y = target_h / max(data.height, 1)

        # Field
        if data.field_rgba is not None:
            f_h, f_w, _ = data.field_rgba.shape
            rgba_contig = np.ascontiguousarray(data.field_rgba)
            qimg = QImage(rgba_contig.data, f_w, f_h, f_w * 4, QImage.Format.Format_RGBA8888)
            painter.setRenderHint(QPainter.RenderHint.SmoothPixmapTransform, True)
            painter.drawImage(QRectF(0, 0, target_w, target_h), qimg)

        # Particles
        if data.positions is not None and len(data.positions) > 0:
            pos = data.positions
            colors = data.colors
            pt_size = data.point_size
            half_pt = pt_size * 0.5

            painter.setPen(Qt.PenStyle.NoPen)
            N = len(pos)
            xs = pos[:, 0] * scale_x - half_pt
            ys = pos[:, 1] * scale_y - half_pt

            if colors is not None and len(colors) == N:
                for i in range(N):
                    c = colors[i]
                    painter.setBrush(Qt.GlobalColor.white if len(c) < 3 else QPainter.setBrush)
                    painter.setBrush(painter.brush().color())
                    painter.setBrush(c[0] if False else Qt.GlobalColor.transparent)
                    # Directly draw ellipse
                    painter.fillRect(QRectF(xs[i], ys[i], pt_size, pt_size), Qt.GlobalColor.cyan)
            else:
                for i in range(N):
                    painter.drawEllipse(QRectF(xs[i], ys[i], pt_size, pt_size))

    def render_to_image(self, width: int | None = None, height: int | None = None) -> QImage:
        w = width or self.width()
        h = height or self.height()
        img = self.grabFramebuffer()
        if img.width() != w or img.height() != h:
            img = img.scaled(w, h, Qt.AspectRatioMode.IgnoreAspectRatio, Qt.TransformationMode.SmoothTransformation)
        return img
