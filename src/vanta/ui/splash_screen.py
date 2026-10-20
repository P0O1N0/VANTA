"""
VANTA Bespoke Animated Startup Screen.

Displays a dark, minimal, generative-life startup experience introducing VANTA,
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
    - Architectural geometric emblem with soliton harmonic manifold.
    - Living ambient harmonic stardust particle veil.
    - Live kinetic tabular counter and simulation phase telemetry.
    - Precise typographic hierarchy and creator attribution.
    - Smooth fade-in and outro dissolve.
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

        # Ambient floating stardust nodes (dx, dy, radius, phase)
        self._particles = [
            (math.sin(i * 1.7) * 260, math.cos(i * 2.3) * 160, 0.8 + (i % 3) * 0.4, i * 0.4)
            for i in range(32)
        ]

        # Phase telemetry milestones
        self._phases = [
            (0.18, "NUCLEATING PHASE MANIFOLDS"),
            (0.42, "CALIBRATING REACTION-DIFFUSION MATRICES"),
            (0.68, "INITIALIZING SYNAPTIC VECTOR FIELDS"),
            (0.88, "SYNCHRONIZING HYDRODYNAMIC BOUNDARIES"),
            (1.00, "RESONANCE ACHIEVED // STUDIO READY"),
        ]

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
        cx = w / 2

        painter.setOpacity(self._opacity)

        # 1. Background Surface (Deep Obsidian Void with subtle radial falloff)
        bg_rect = QRectF(0, 0, w, h)
        bg_path = QPainterPath()
        bg_path.addRoundedRect(bg_rect, 14, 14)

        grad = QRadialGradient(cx, h / 2, w * 0.75)
        grad.setColorAt(0.0, QColor(14, 18, 28))
        grad.setColorAt(0.7, QColor(8, 10, 16))
        grad.setColorAt(1.0, QColor(4, 5, 8))

        painter.fillPath(bg_path, QBrush(grad))

        # 1px Subtle Glass Border
        border_pen = QPen(QColor(255, 255, 255, 18), 1.0)
        painter.setPen(border_pen)
        painter.drawPath(bg_path)

        # 2. Ambient Harmonic Stardust Particles
        painter.setPen(Qt.PenStyle.NoPen)
        for px, py, pr, pphase in self._particles:
            cur_x = cx + px + math.sin(elapsed * 0.8 + pphase) * 12.0
            cur_y = (h / 2) + py + math.cos(elapsed * 0.8 + pphase) * 10.0
            p_pulse = 0.5 + 0.5 * math.sin(elapsed * 2.0 + pphase)
            p_color = QColor(94, 234, 212, int(45 * p_pulse)) if (pphase > 2.0) else QColor(241, 245, 249, int(40 * p_pulse))
            painter.setBrush(QBrush(p_color))
            painter.drawEllipse(QPointF(cur_x, cur_y), pr, pr)

        # 3. Top Telemetry Chip
        telem_font = QFont("Consolas", 8, QFont.Weight.Medium)
        telem_font.setLetterSpacing(QFont.SpacingType.AbsoluteSpacing, 1.8)
        painter.setFont(telem_font)
        painter.setPen(QColor(100, 116, 139))
        painter.drawText(QRectF(0, 24, w, 18), Qt.AlignmentFlag.AlignCenter, "[ FIELD DYNAMICS ENGINE :: BUILD 2026.10 ]")

        # 4. Architectural Bespoke Emblem (Soliton & Modernist V)
        cy = 110
        t_angle = elapsed * 1.1

        # Radiant halo
        halo_pulse = 0.5 + 0.5 * math.sin(elapsed * 2.5)
        halo_rad = 34 + halo_pulse * 6
        halo_grad = QRadialGradient(cx, cy, halo_rad)
        halo_grad.setColorAt(0.0, QColor(94, 234, 212, 35))
        halo_grad.setColorAt(0.5, QColor(129, 140, 248, 16))
        halo_grad.setColorAt(1.0, QColor(0, 0, 0, 0))
        painter.setBrush(QBrush(halo_grad))
        painter.drawEllipse(QPointF(cx, cy), halo_rad, halo_rad)

        # Outer Reticle (Dashed Precision Ring)
        reticle_pen = QPen(QColor(255, 255, 255, 24), 1.0)
        reticle_pen.setDashPattern([3, 7])
        painter.setPen(reticle_pen)
        painter.setBrush(Qt.BrushStyle.NoBrush)
        painter.save()
        painter.translate(cx, cy)
        painter.rotate(math.degrees(elapsed * 0.2))
        painter.drawEllipse(QPointF(0, 0), 40, 40)
        painter.restore()

        # Registration Crosshairs
        reg_pen = QPen(QColor(255, 255, 255, 45), 1.0)
        painter.setPen(reg_pen)
        painter.drawLine(QPointF(cx, cy - 44), QPointF(cx, cy - 38))
        painter.drawLine(QPointF(cx, cy + 38), QPointF(cx, cy + 44))
        painter.drawLine(QPointF(cx - 44, cy), QPointF(cx - 38, cy))
        painter.drawLine(QPointF(cx + 38, cy), QPointF(cx + 44, cy))

        # Soliton Harmonic Ribbon (Bezier Path)
        soliton_path = QPainterPath()
        soliton_path.moveTo(cx - 18, cy - 8)
        soliton_path.quadTo(cx, cy + 16, cx + 18, cy - 8)
        soliton_path.cubicTo(cx + 28, cy - 20, cx + 24, cy - 30, cx + 12, cy - 30)
        soliton_path.cubicTo(cx - 2, cy - 30, cx - 8, cy - 14, cx - 8, cy + 2)
        soliton_pen = QPen(QColor(94, 234, 212, 180), 1.6)
        soliton_pen.setCapStyle(Qt.PenCapStyle.RoundCap)
        painter.setPen(soliton_pen)
        painter.drawPath(soliton_path)

        # Architectural V Arms
        v_pen = QPen(QColor(226, 232, 240, 220), 2.6)
        v_pen.setCapStyle(Qt.PenCapStyle.RoundCap)
        painter.setPen(v_pen)
        painter.drawLine(QPointF(cx - 24, cy - 18), QPointF(cx, cy + 26))
        painter.drawLine(QPointF(cx + 24, cy - 18), QPointF(cx, cy + 26))

        # Central Singularity Focal Core
        core_grad = QRadialGradient(cx, cy - 3, 5.0)
        core_grad.setColorAt(0.0, QColor(255, 255, 255, 255))
        core_grad.setColorAt(0.5, QColor(94, 234, 212, 200))
        core_grad.setColorAt(1.0, QColor(94, 234, 212, 0))
        painter.setPen(Qt.PenStyle.NoPen)
        painter.setBrush(QBrush(core_grad))
        painter.drawEllipse(QPointF(cx, cy - 3), 4.5, 4.5)

        # 5. Typographic Hierarchy: Primary Title "VANTA"
        title_font = QFont("Segoe UI", 34, QFont.Weight.Bold)
        title_font.setLetterSpacing(QFont.SpacingType.AbsoluteSpacing, 8.0)
        painter.setFont(title_font)
        painter.setPen(QColor(248, 250, 252))
        painter.drawText(QRectF(0, 188, w, 44), Qt.AlignmentFlag.AlignCenter, APP_NAME)

        # Subtitle: "GENERATIVE LIFE STUDIO"
        sub_font = QFont("Segoe UI", 8, QFont.Weight.DemiBold)
        sub_font.setLetterSpacing(QFont.SpacingType.AbsoluteSpacing, 4.5)
        painter.setFont(sub_font)
        painter.setPen(QColor(148, 163, 184))
        painter.drawText(QRectF(0, 236, w, 20), Qt.AlignmentFlag.AlignCenter, APP_DESCRIPTOR.upper())

        # Hairline Subtitle Accents
        accent_pen = QPen(QColor(255, 255, 255, 25), 1.0)
        painter.setPen(accent_pen)
        painter.drawLine(QPointF(cx - 150, 246), QPointF(cx - 110, 246))
        painter.drawLine(QPointF(cx + 110, 246), QPointF(cx + 150, 246))

        # 6. Creator Attribution Pill: "Created by P O N / @P0O1N0"
        pill_w = 260.0
        pill_h = 28.0
        pill_x = (w - pill_w) / 2
        pill_y = 276.0

        pill_rect = QRectF(pill_x, pill_y, pill_w, pill_h)
        pill_path = QPainterPath()
        pill_path.addRoundedRect(pill_rect, 14, 14)

        painter.fillPath(pill_path, QBrush(QColor(255, 255, 255, 8)))
        pill_border = QPen(QColor(255, 255, 255, 18), 1.0)
        painter.setPen(pill_border)
        painter.drawPath(pill_path)

        # Status Dot (Emerald Pulse)
        dot_pulse = 0.4 + 0.6 * math.sin(elapsed * 3.0)
        painter.setPen(Qt.PenStyle.NoPen)
        painter.setBrush(QBrush(QColor(94, 234, 212, int(255 * dot_pulse))))
        painter.drawEllipse(QPointF(pill_x + 18, pill_y + 14), 3.0, 3.0)

        # Attribution Text
        attr_font = QFont("Segoe UI", 9, QFont.Weight.Medium)
        attr_font.setLetterSpacing(QFont.SpacingType.AbsoluteSpacing, 1.2)
        painter.setFont(attr_font)
        painter.setPen(QColor(203, 213, 225))
        painter.drawText(QRectF(pill_x + 28, pill_y, 130, pill_h), Qt.AlignmentFlag.AlignVCenter | Qt.AlignmentFlag.AlignLeft, f"Created by {AUTHOR_NAME}")

        # Separator & Handle
        painter.setPen(QColor(255, 255, 255, 50))
        painter.drawText(QRectF(pill_x + 160, pill_y, 10, pill_h), Qt.AlignmentFlag.AlignCenter, "/")

        handle_font = QFont("Consolas", 8, QFont.Weight.DemiBold)
        handle_font.setLetterSpacing(QFont.SpacingType.AbsoluteSpacing, 1.2)
        painter.setFont(handle_font)
        painter.setPen(QColor(192, 132, 252))
        painter.drawText(QRectF(pill_x + 172, pill_y, 76, pill_h), Qt.AlignmentFlag.AlignVCenter | Qt.AlignmentFlag.AlignLeft, "@P0O1N0")

        # 7. Live Kinetic Counter & Simulation Phase Telemetry
        ease_progress = 1.0 - math.pow(1.0 - progress, 3)
        display_percent = min(100, int(ease_progress * 100))

        # Determine active phase text
        phase_text = self._phases[-1][1]
        for th, text in self._phases:
            if progress <= th:
                phase_text = text
                break

        meter_w = 340.0
        meter_x = (w - meter_w) / 2
        meter_y = 344.0

        # Phase Status
        phase_font = QFont("Consolas", 7, QFont.Weight.Normal)
        phase_font.setLetterSpacing(QFont.SpacingType.AbsoluteSpacing, 1.0)
        painter.setFont(phase_font)
        painter.setPen(QColor(100, 116, 139))
        painter.drawText(QRectF(meter_x, meter_y, meter_w - 60, 16), Qt.AlignmentFlag.AlignVCenter | Qt.AlignmentFlag.AlignLeft, phase_text)

        # Tabular Counter
        counter_font = QFont("Consolas", 8, QFont.Weight.Bold)
        painter.setFont(counter_font)
        painter.setPen(QColor(241, 245, 249))
        painter.drawText(QRectF(meter_x + meter_w - 50, meter_y, 50, 16), Qt.AlignmentFlag.AlignVCenter | Qt.AlignmentFlag.AlignRight, f"{display_percent:03d}%")

        # 8. Razor Hairline Progress Track (1.5px)
        track_y = meter_y + 22.0
        painter.setPen(Qt.PenStyle.NoPen)
        painter.setBrush(QBrush(QColor(255, 255, 255, 16)))
        painter.drawRoundedRect(QRectF(meter_x, track_y, meter_w, 1.5), 1, 1)

        # Active Fill
        fill_w = max(4.0, meter_w * progress)
        fill_grad = QLinearGradient(meter_x, track_y, meter_x + meter_w, track_y)
        fill_grad.setColorAt(0.0, QColor(99, 102, 241, 200))
        fill_grad.setColorAt(0.85, QColor(94, 234, 212, 240))
        fill_grad.setColorAt(1.0, QColor(255, 255, 255, 255))
        painter.setBrush(QBrush(fill_grad))
        painter.drawRoundedRect(QRectF(meter_x, track_y, fill_w, 1.5), 1, 1)

        painter.end()
