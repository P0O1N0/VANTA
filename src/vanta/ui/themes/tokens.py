"""
Design system tokens for VANTA: colors, dimensions, borders, and typography.
"""

from __future__ import annotations
from dataclasses import dataclass


@dataclass(frozen=True)
class ThemeTokens:
    # Surface colors
    bg_canvas: str
    bg_base: str
    bg_surface: str
    bg_surface_elevated: str
    bg_surface_hover: str
    bg_surface_active: str

    # Border & Line colors
    border_subtle: str
    border_medium: str
    border_focus: str

    # Text hierarchy
    text_primary: str
    text_secondary: str
    text_tertiary: str
    text_disabled: str

    # Brand & Interactive Accents
    accent_primary: str
    accent_hover: str
    accent_active: str
    accent_secondary: str  # Cyan / highlight
    accent_muted: str

    # Status & Feedback
    color_success: str
    color_warning: str
    color_danger: str
    color_info: str

    # Sliders & controls
    slider_track: str
    slider_groove: str


DARK_TOKENS = ThemeTokens(
    bg_canvas="#080A0E",
    bg_base="#0E1117",
    bg_surface="#161B22",
    bg_surface_elevated="#1F242C",
    bg_surface_hover="#262C36",
    bg_surface_active="#2E3542",
    border_subtle="#21262D",
    border_medium="#30363D",
    border_focus="#8A2BE2",
    text_primary="#F0F6FC",
    text_secondary="#8B949E",
    text_tertiary="#6E7681",
    text_disabled="#484F58",
    accent_primary="#8A2BE2",  # Neon Purple
    accent_hover="#9D44EE",
    accent_active="#7A1CD2",
    accent_secondary="#00F5D4",  # Neon Cyan
    accent_muted="#3D2066",
    color_success="#238636",
    color_warning="#D29922",
    color_danger="#DA3633",
    color_info="#388BFD",
    slider_track="#8A2BE2",
    slider_groove="#21262D",
)

LIGHT_TOKENS = ThemeTokens(
    bg_canvas="#E5E8EC",
    bg_base="#F6F8FA",
    bg_surface="#FFFFFF",
    bg_surface_elevated="#F0F2F5",
    bg_surface_hover="#E9ECEF",
    bg_surface_active="#DEE2E6",
    border_subtle="#E1E4E8",
    border_medium="#D0D7DE",
    border_focus="#7928CA",
    text_primary="#1F2328",
    text_secondary="#57606A",
    text_tertiary="#6E7781",
    text_disabled="#8C959F",
    accent_primary="#7928CA",  # Royal Violet
    accent_hover="#8C3CD9",
    accent_active="#6818B9",
    accent_secondary="#009688",
    accent_muted="#EBDCF9",
    color_success="#1A7F37",
    color_warning="#9A6700",
    color_danger="#CF222E",
    color_info="#0969DA",
    slider_track="#7928CA",
    slider_groove="#D0D7DE",
)

# Typography definitions
FONT_FAMILY_PERSIAN = "Vazirmatn, Segoe UI, Tahoma, sans-serif"
FONT_FAMILY_LATIN = "Inter, Segoe UI, -apple-system, sans-serif"
FONT_FAMILY_MONO = "JetBrains Mono, Consolas, Courier New, monospace"
