"""
VANTA Premium Animated Startup Screen.

Displays a dark, minimal, generative-art startup experience introducing VANTA,
acknowledging its creator (P O N / @P0O1N0), and maintaining an event-loop-based
4.0-second display duration before smoothly transitioning to the main studio window.
"""

from __future__ import annotations

import math
import time
from typing import Callable

from PySide6.QtCore import QPointF, QRectF, Qt, QTimer, Signal
from PySide6.QtGui import (
    QBrush,
    QColor,
    QFont,
    QLinearGradient,
    QPainter,
    QPainterPath,
    QPen,
    QRadialGradient,
)
from PySide6.QtWidgets import QApplication, QWidget

from vanta.config.settings import APP_DESCRIPTOR, APP_NAME, AUTHOR_NAME


class VantaSplashScreen(QWidget):
    """
    Refined, dark, and minimal animated startup screen for VANTA Generative Life Studio.

    Features:
    - Event-loop based timing (no blocking sleeps).
    - Enforces a minimum 4.0-second (4,000 ms) display time.
    - Mathematical generative motif with rotating orbital rings and soliton core.
    - Precise typographic hierarchy and creator attribution.
    - Smooth fade-in and fade-out transitions.
    """

    finished = Signal()

    def __init__(self, on_finished: Callable[[], None] | None = None, min_duration: float = 4.0):
        super().__init__(None, Qt.WindowType.FramelessWindowHint | Qt.WindowType.WindowStaysOnTopHint | Qt.WindowType.SplashScreen)
        self.setAttribute(Qt.WidgetAttribute.WA_TranslucentBackground, True)
        self.setFixedSize(640, 420)

        self._min_duration = min_duration
        self._start_time = time.monotonic()
        self._app_ready = False
        self._opacity = 0.0
        self._is_closing = False
        self._on_finished = on_finished

        # Center on primary screen
        screen = QApplication.primaryScreen()
        if screen:
            geo = screen.availableGeometry()
            self.move((geo.width() - self.width()) // 2, (geo.height() - self.height()) // 2)

        # 60 FPS animation timer
        self._timer = QTimer(self)
        self._timer.setInterval(16)
        self._timer.timeout.connect(self._on_tick)

    def start(self) -> None:
        """Start the animation timer and display the splash screen."""
        self._start_time = time.monotonic()
        self._timer.start()
        self.show()

    def set_app_ready(self) -> None:
        """Signal that underlying application initialization is fully complete."""
        self._app_ready = True

    def _on_tick(self) -> None:
        """Advance animation state every frame."""
        elapsed = time.monotonic() - self._start_time

        # Calculate entrance fade-in (0.0 to 0.4s)
        if elapsed < 0.4:
            self._opacity = min(1.0, elapsed / 0.4)
        elif elapsed < self._min_duration:
            self._opacity = 1.0
        else:
            # 4.0s has elapsed. If app is ready, initiate smooth fade-out
            if self._app_ready and not self._is_closing:
                fade_elapsed = elapsed - self._min_duration
                if fade_elapsed < 0.35:
                    self._opacity = max(0.0, 1.0 - (fade_elapsed / 0.35))
                else:
                    self._opacity = 0.0
                    self._is_closing = True
                    self._timer.stop()
                    self.close()
                    if self._on_finished:
                        self._on_finished()
                    self.finished.emit()
                    return
            else:
                self._opacity = 1.0

        self.update()

    def paintEvent(self, event) -> None:
        """Render the dark, minimal, generative-life splash composition."""
        painter = QPainter(self)
        painter.setRenderHint(QPainter.RenderHint.Antialiasing, True)
        painter.setRenderHint(QPainter.RenderHint.TextAntialiasing, True)

        elapsed = time.monotonic() - self._start_time
        progress = min(1.0, elapsed / self._min_duration)
        w = self.width()
        h = self.height()

        painter.setOpacity(self._opacity)

        # 1. Background Surface (Deep Graphite with subtle radial falloff)
        bg_rect = QRectF(0, 0, w, h)
        bg_path = QPainterPath()
        bg_path.addRoundedRect(bg_rect, 14, 14)

        grad = QRadialGradient(w / 2, h / 2, w * 0.75)
        grad.setColorAt(0.0, QColor(16, 20, 32))
        grad.setColorAt(0.7, QColor(10, 13, 22))
        grad.setColorAt(1.0, QColor(6, 8, 14))

        painter.fillPath(bg_path, QBrush(grad))

        # 1px Subtle Glass Border
        border_pen = QPen(QColor(255, 255, 255, 24), 1.0)
        painter.setPen(border_pen)
        painter.drawPath(bg_path)

        # 2. Generative Abstract Emblem (Soliton & Orbital Life Core)
        cx = w / 2
        cy = 125
        t_angle = elapsed * 1.25  # Smooth continuous rotation

        # Soft ambient glow behind emblem
        glow_grad = QRadialGradient(cx, cy, 65)
        glow_grad.setColorAt(0.0, QColor(0, 245, 212, 38))
        glow_grad.setColorAt(0.5, QColor(138, 43, 226, 22))
        glow_grad.setColorAt(1.0, QColor(0, 0, 0, 0))
        painter.setPen(Qt.PenStyle.NoPen)
        painter.setBrush(QBrush(glow_grad))
        painter.drawEllipse(QPointF(cx, cy), 65, 65)

        # Outer orbital ring (subtle dashed cyan)
        outer_pen = QPen(QColor(0, 245, 212, 90), 1.2)
        outer_pen.setDashPattern([3, 5])
        painter.setPen(outer_pen)
        painter.setBrush(Qt.BrushStyle.NoBrush)
        painter.save()
        painter.translate(cx, cy)
        painter.rotate(math.degrees(t_angle * 0.45))
        painter.drawEllipse(QPointF(0, 0), 44, 44)
        painter.restore()

        # Inner counter-rotating ring with phase nodes
        inner_pen = QPen(QColor(192, 132, 252, 110), 1.0)
        painter.setPen(inner_pen)
        painter.save()
        painter.translate(cx, cy)
        painter.rotate(-math.degrees(t_angle * 0.65))
        painter.drawEllipse(QPointF(0, 0), 28, 28)

        # 3 Orbiting micro-satellites (trigonometric cellular nodes)
        painter.setPen(Qt.PenStyle.NoPen)
        for i in range(3):
            angle = (i * (2 * math.pi / 3))
            nx = 28 * math.cos(angle)
            ny = 28 * math.sin(angle)
            painter.setBrush(QBrush(QColor(0, 245, 212, 220)))
            painter.drawEllipse(QPointF(nx, ny), 2.5, 2.5)
        painter.restore()

        # Central Soliton Nucleus
        pulse = 0.5 + 0.5 * math.sin(elapsed * 3.5)
        core_radius = 8.5 + pulse * 1.5
        core_grad = QRadialGradient(cx, cy, core_radius)
        core_grad.setColorAt(0.0, QColor(255, 255, 255, 240))
        core_grad.setColorAt(0.6, QColor(0, 245, 212, 200))
        core_grad.setColorAt(1.0, QColor(138, 43, 226, 0))
        painter.setBrush(QBrush(core_grad))
        painter.drawEllipse(QPointF(cx, cy), core_radius, core_radius)

        # 3. Typography: Primary Title "VANTA"
        title_font = QFont("Segoe UI", 32, QFont.Weight.Bold)
        title_font.setLetterSpacing(QFont.SpacingType.AbsoluteSpacing, 7.0)
        painter.setFont(title_font)
        painter.setPen(QColor(255, 255, 255))
        painter.drawText(QRectF(0, 205, w, 44), Qt.AlignmentFlag.AlignCenter, APP_NAME)

        # Subtitle: "GENERATIVE LIFE STUDIO"
        sub_font = QFont("Segoe UI", 9, QFont.Weight.DemiBold)
        sub_font.setLetterSpacing(QFont.SpacingType.AbsoluteSpacing, 4.0)
        painter.setFont(sub_font)
        painter.setPen(QColor(0, 245, 212, 220))
        painter.drawText(QRectF(0, 254, w, 24), Qt.AlignmentFlag.AlignCenter, APP_DESCRIPTOR.upper())

        # Thin Separator Accent
        sep_pen = QPen(QColor(255, 255, 255, 20), 1.0)
        painter.setPen(sep_pen)
        painter.drawLine(QPointF(cx - 40, 288), QPointF(cx + 40, 288))

        # 4. Creator Attribution:
        # "Created by P O N"
        author_font = QFont("Segoe UI", 10, QFont.Weight.Medium)
        author_font.setLetterSpacing(QFont.SpacingType.AbsoluteSpacing, 1.8)
        painter.setFont(author_font)
        painter.setPen(QColor(160, 174, 192))
        painter.drawText(QRectF(0, 304, w, 22), Qt.AlignmentFlag.AlignCenter, f"Created by {AUTHOR_NAME}")

        # "@P0O1N0"
        handle_font = QFont("Consolas", 9, QFont.Weight.DemiBold)
        handle_font.setLetterSpacing(QFont.SpacingType.AbsoluteSpacing, 1.2)
        painter.setFont(handle_font)
        painter.setPen(QColor(192, 132, 252, 220))
        painter.drawText(QRectF(0, 328, w, 20), Qt.AlignmentFlag.AlignCenter, "@P0O1N0")

        # 5. Fine Progress Hairline (Smooth 4.0-second completion)
        bar_w = 260.0
        bar_h = 2.0
        bar_x = (w - bar_w) / 2
        bar_y = 376.0

        # Background Track
        painter.setPen(Qt.PenStyle.NoPen)
        painter.setBrush(QBrush(QColor(255, 255, 255, 18)))
        painter.drawRoundedRect(QRectF(bar_x, bar_y, bar_w, bar_h), 1, 1)

        # Active Fill
        fill_w = max(4.0, bar_w * progress)
        fill_grad = QLinearGradient(bar_x, bar_y, bar_x + bar_w, bar_y)
        fill_grad.setColorAt(0.0, QColor(0, 245, 212, 220))
        fill_grad.setColorAt(1.0, QColor(138, 43, 226, 240))
        painter.setBrush(QBrush(fill_grad))
        painter.drawRoundedRect(QRectF(bar_x, bar_y, fill_w, bar_h), 1, 1)

        painter.end()
