"""
Color palette management, interpolation, and gradient lookups for VANTA.
"""

from __future__ import annotations

import numpy as np


class ColorPalette:
    """Precomputed RGBA lookup table for scientific and artistic false-color rendering."""

    def __init__(self, name: str, key_colors: list[tuple[float, float, float]], lut_size: int = 256):
        self.name = name
        self.lut_size = lut_size
        self.lut = self._build_lut(key_colors, lut_size)

    @staticmethod
    def _build_lut(key_colors: list[tuple[float, float, float]], size: int) -> np.ndarray:
        """Interpolate smooth color ramp across key colors into uint8 (size, 4) table."""
        n_keys = len(key_colors)
        if n_keys == 1:
            color = np.array(key_colors[0], dtype=np.float32)
            lut = np.tile(color, (size, 1))
        else:
            key_pts = np.linspace(0, 1, n_keys)
            eval_pts = np.linspace(0, 1, size)
            r_keys = [c[0] for c in key_colors]
            g_keys = [c[1] for c in key_colors]
            b_keys = [c[2] for c in key_colors]

            r = np.interp(eval_pts, key_pts, r_keys)
            g = np.interp(eval_pts, key_pts, g_keys)
            b = np.interp(eval_pts, key_pts, b_keys)
            lut = np.stack([r, g, b], axis=-1)

        # Scale to uint8 and append alpha=255
        rgb_uint8 = np.clip(lut * 255.0, 0, 255).astype(np.uint8)
        alpha = np.full((size, 1), 255, dtype=np.uint8)
        return np.concatenate([rgb_uint8, alpha], axis=-1)

    def sample_scalar(self, val: float) -> tuple[int, int, int]:
        """Sample RGB tuple for a normalized scalar in [0, 1]."""
        idx = int(np.clip(val, 0.0, 1.0) * (self.lut_size - 1))
        c = self.lut[idx]
        return int(c[0]), int(c[1]), int(c[2])

    def map_array_to_rgb(self, scalar_array: np.ndarray) -> np.ndarray:
        """Map normalized 2D float array in [0, 1] to uint8 (H, W, 4) RGBA image."""
        indices = np.clip((scalar_array * (self.lut_size - 1)).astype(np.int32), 0, self.lut_size - 1)
        return self.lut[indices]


# Curated Palettes for simulation engines
PALETTES: dict[str, ColorPalette] = {
    "neon_cyber": ColorPalette(
        "Neon Cyber",
        [
            (0.04, 0.02, 0.09),  # Deep violet
            (0.24, 0.08, 0.54),  # Royal purple
            (0.00, 0.85, 0.95),  # Cyan
            (0.98, 0.98, 1.00),  # White highlight
        ],
    ),
    "bioluminescence": ColorPalette(
        "Bioluminescence",
        [
            (0.02, 0.05, 0.07),  # Abyssal blue
            (0.00, 0.45, 0.48),  # Deep teal
            (0.15, 0.95, 0.65),  # Seafoam green
            (0.85, 1.00, 0.90),  # Luminous mint
        ],
    ),
    "amber_ember": ColorPalette(
        "Amber Ember",
        [
            (0.05, 0.02, 0.01),  # Charcoal
            (0.65, 0.12, 0.04),  # Crimson
            (0.98, 0.55, 0.05),  # Molten amber
            (1.00, 0.92, 0.60),  # Solar yellow
        ],
    ),
    "spectral_velvet": ColorPalette(
        "Spectral Velvet",
        [
            (0.08, 0.02, 0.12),  # Obsidian purple
            (0.55, 0.10, 0.45),  # Magenta
            (0.95, 0.35, 0.55),  # Rose
            (1.00, 0.85, 0.70),  # Cream peach
        ],
    ),
    "monochrome": ColorPalette(
        "Monochrome Minimal",
        [
            (0.05, 0.05, 0.06),  # Carbon
            (0.30, 0.32, 0.35),  # Slate
            (0.70, 0.73, 0.76),  # Silver
            (0.98, 0.98, 0.99),  # Pure white
        ],
    ),
    "toxic_emerald": ColorPalette(
        "Toxic Emerald",
        [
            (0.01, 0.05, 0.02),
            (0.05, 0.40, 0.15),
            (0.20, 0.90, 0.30),
            (0.90, 1.00, 0.80),
        ],
    ),
}

# Standard species colors for Particle Life
SPECIES_COLORS = np.array(
    [
        [255, 75, 75, 255],    # Red
        [75, 220, 100, 255],   # Green
        [60, 160, 255, 255],   # Blue
        [255, 215, 0, 255],    # Gold
        [190, 75, 255, 255],   # Purple
        [0, 240, 240, 255],    # Cyan
        [255, 130, 45, 255],   # Orange
        [255, 105, 180, 255],  # Hot pink
    ],
    dtype=np.uint8,
)


def get_species_color(species_id: int) -> tuple[int, int, int]:
    """Return RGB tuple for a given species index."""
    idx = species_id % len(SPECIES_COLORS)
    c = SPECIES_COLORS[idx]
    return int(c[0]), int(c[1]), int(c[2])


def get_species_hex(species_id: int) -> str:
    """Return hex color string for species."""
    r, g, b = get_species_color(species_id)
    return f"#{r:02x}{g:02x}{b:02x}"
