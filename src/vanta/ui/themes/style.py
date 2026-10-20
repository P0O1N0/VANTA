"""
Qt Style Sheet (QSS) generator for VANTA modern dark and light themes.
"""

from __future__ import annotations

from vanta.localization.i18n import is_rtl
from vanta.ui.themes.tokens import (
    DARK_TOKENS,
    LIGHT_TOKENS,
    FONT_FAMILY_LATIN,
    FONT_FAMILY_PERSIAN,
    FONT_FAMILY_MONO,
    ThemeTokens,
)


def generate_stylesheet(theme_name: str = "dark") -> str:
    """Generate comprehensive QSS stylesheet string for the requested theme."""
    tokens = LIGHT_TOKENS if theme_name.lower() == "light" else DARK_TOKENS
    font_family = FONT_FAMILY_PERSIAN if is_rtl() else FONT_FAMILY_LATIN

    return f"""
    /* Global Application Stylesheet */
    QWidget {{
        background-color: {tokens.bg_base};
        color: {tokens.text_primary};
        font-family: {font_family};
        font-size: 13px;
        selection-background-color: {tokens.accent_primary};
        selection-color: #FFFFFF;
        outline: none;
    }}

    QMainWindow, QDialog {{
        background-color: {tokens.bg_base};
    }}

    /* Panels and Grouping */
    QFrame#panelFrame {{
        background-color: {tokens.bg_surface};
        border: 1px solid {tokens.border_subtle};
        border-radius: 6px;
    }}

    QGroupBox {{
        font-weight: bold;
        border: 1px solid {tokens.border_subtle};
        border-radius: 6px;
        margin-top: 14px;
        padding-top: 14px;
        background-color: {tokens.bg_surface};
    }}
    QGroupBox::title {{
        subcontrol-origin: margin;
        subcontrol-position: top left;
        padding: 0 6px;
        color: {tokens.text_secondary};
    }}

    /* Buttons */
    QPushButton {{
        background-color: {tokens.bg_surface_elevated};
        color: {tokens.text_primary};
        border: 1px solid {tokens.border_medium};
        border-radius: 4px;
        padding: 5px 12px;
        font-weight: 500;
        min-height: 20px;
    }}
    QPushButton:hover {{
        background-color: {tokens.bg_surface_hover};
        border-color: {tokens.border_focus};
    }}
    QPushButton:pressed {{
        background-color: {tokens.bg_surface_active};
    }}
    QPushButton:disabled {{
        background-color: {tokens.bg_base};
        color: {tokens.text_disabled};
        border-color: {tokens.border_subtle};
    }}

    QPushButton#primaryButton {{
        background-color: {tokens.accent_primary};
        color: #FFFFFF;
        border: 1px solid {tokens.accent_hover};
    }}
    QPushButton#primaryButton:hover {{
        background-color: {tokens.accent_hover};
    }}
    QPushButton#primaryButton:pressed {{
        background-color: {tokens.accent_active};
    }}

    /* Navigation item buttons */
    QPushButton#navButton {{
        text-align: left;
        background-color: transparent;
        border: none;
        border-radius: 4px;
        padding: 8px 12px;
        font-weight: normal;
        color: {tokens.text_secondary};
    }}
    QPushButton#navButton:hover {{
        background-color: {tokens.bg_surface_hover};
        color: {tokens.text_primary};
    }}
    QPushButton#navButton:checked {{
        background-color: {tokens.bg_surface_elevated};
        color: {tokens.accent_primary};
        border-left: 3px solid {tokens.accent_primary};
        font-weight: bold;
    }}

    /* Inputs & Edits */
    QLineEdit, QSpinBox, QDoubleSpinBox {{
        background-color: {tokens.bg_base};
        color: {tokens.text_primary};
        border: 1px solid {tokens.border_medium};
        border-radius: 4px;
        padding: 4px 8px;
    }}
    QLineEdit:focus, QSpinBox:focus, QDoubleSpinBox:focus {{
        border: 1px solid {tokens.border_focus};
    }}

    /* Combo Boxes */
    QComboBox {{
        background-color: {tokens.bg_surface_elevated};
        color: {tokens.text_primary};
        border: 1px solid {tokens.border_medium};
        border-radius: 4px;
        padding: 4px 8px;
        min-height: 22px;
    }}
    QComboBox:hover {{
        border-color: {tokens.border_focus};
    }}
    QComboBox::drop-down {{
        subcontrol-origin: padding;
        subcontrol-position: top right;
        width: 20px;
        border-left: none;
    }}
    QComboBox QAbstractItemView {{
        background-color: {tokens.bg_surface};
        color: {tokens.text_primary};
        border: 1px solid {tokens.border_medium};
        selection-background-color: {tokens.accent_primary};
        selection-color: #FFFFFF;
    }}

    /* Sliders */
    QSlider::groove:horizontal {{
        height: 4px;
        background: {tokens.slider_groove};
        border-radius: 2px;
    }}
    QSlider::sub-page:horizontal {{
        background: {tokens.slider_track};
        border-radius: 2px;
    }}
    QSlider::handle:horizontal {{
        background: {tokens.text_primary};
        border: 1px solid {tokens.border_medium};
        width: 14px;
        margin-top: -5px;
        margin-bottom: -5px;
        border-radius: 7px;
    }}
    QSlider::handle:horizontal:hover {{
        background: {tokens.accent_secondary};
        border-color: {tokens.accent_secondary};
    }}

    /* Scrollbars */
    QScrollBar:vertical {{
        background: transparent;
        width: 8px;
        margin: 0px;
    }}
    QScrollBar::handle:vertical {{
        background: {tokens.border_medium};
        border-radius: 4px;
        min-height: 24px;
    }}
    QScrollBar::handle:vertical:hover {{
        background: {tokens.text_tertiary};
    }}
    QScrollBar::add-line:vertical, QScrollBar::sub-line:vertical {{
        height: 0px;
    }}
    QScrollBar:horizontal {{
        background: transparent;
        height: 8px;
    }}
    QScrollBar::handle:horizontal {{
        background: {tokens.border_medium};
        border-radius: 4px;
        min-width: 24px;
    }}
    QScrollBar::add-line:horizontal, QScrollBar::sub-line:horizontal {{
        width: 0px;
    }}

    /* Status Bar & Tooltips */
    QStatusBar {{
        background-color: {tokens.bg_surface};
        color: {tokens.text_secondary};
        border-top: 1px solid {tokens.border_subtle};
        font-family: {FONT_FAMILY_MONO};
        font-size: 11px;
    }}

    QToolTip {{
        background-color: {tokens.bg_surface_elevated};
        color: {tokens.text_primary};
        border: 1px solid {tokens.border_medium};
        border-radius: 4px;
        padding: 4px 8px;
        font-size: 12px;
    }}

    /* Tabs */
    QTabWidget::pane {{
        border: 1px solid {tokens.border_subtle};
        background-color: {tokens.bg_surface};
    }}
    QTabBar::tab {{
        background-color: {tokens.bg_base};
        color: {tokens.text_secondary};
        padding: 6px 14px;
        border: 1px solid {tokens.border_subtle};
        border-bottom: none;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
    }}
    QTabBar::tab:selected {{
        background-color: {tokens.bg_surface};
        color: {tokens.text_primary};
        border-top: 2px solid {tokens.accent_primary};
    }}
    """
