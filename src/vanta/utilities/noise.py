"""
Fast 2D gradient noise and curl noise implementation for procedural vector fields.
"""

from __future__ import annotations

import numpy as np


class PerlinNoise2D:
    """Vectorized 2D Perlin Gradient Noise generator using permutation tables."""

    def __init__(self, seed: int = 42):
        self.seed = seed
        rng = np.random.default_rng(seed)
        p = np.arange(256, dtype=np.int32)
        rng.shuffle(p)
        self.p = np.tile(p, 2)

        # 8 normalized 2D gradient vectors
        angles = np.linspace(0, 2 * np.pi, 8, endpoint=False)
        self.gradients = np.stack([np.cos(angles), np.sin(angles)], axis=-1)

    @staticmethod
    def _fade(t: np.ndarray) -> np.ndarray:
        """6t^5 - 15t^4 + 10t^3 smooth quintic polynomial."""
        return t * t * t * (t * (t * 6.0 - 15.0) + 10.0)

    def generate_grid(self, width: int, height: int, scale: float = 0.02, octaves: int = 3, persistence: float = 0.5) -> np.ndarray:
        """Generate a 2D scalar noise grid of shape (height, width) normalized to [-1, 1]."""
        x = np.linspace(0, width * scale, width, endpoint=False)
        y = np.linspace(0, height * scale, height, endpoint=False)
        xv, yv = np.meshgrid(x, y)

        total = np.zeros((height, width), dtype=np.float32)
        amplitude = 1.0
        frequency = 1.0
        max_val = 0.0

        for _ in range(octaves):
            total += self._noise_plane(xv * frequency, yv * frequency) * amplitude
            max_val += amplitude
            amplitude *= persistence
            frequency *= 2.0

        return total / max_val

    def _noise_plane(self, x: np.ndarray, y: np.ndarray) -> np.ndarray:
        xi = np.floor(x).astype(np.int32) & 255
        yi = np.floor(y).astype(np.int32) & 255

        xf = x - np.floor(x)
        yf = y - np.floor(y)

        u = self._fade(xf)
        v = self._fade(yf)

        aa = self.p[self.p[xi] + yi]
        ab = self.p[self.p[xi] + yi + 1]
        ba = self.p[self.p[xi + 1] + yi]
        bb = self.p[self.p[xi + 1] + yi + 1]

        # Dot product with gradient vectors
        g_aa = self.gradients[aa % 8]
        g_ba = self.gradients[ba % 8]
        g_ab = self.gradients[ab % 8]
        g_bb = self.gradients[bb % 8]

        d_aa = g_aa[:, :, 0] * xf + g_aa[:, :, 1] * yf
        d_ba = g_ba[:, :, 0] * (xf - 1.0) + g_ba[:, :, 1] * yf
        d_ab = g_ab[:, :, 0] * xf + g_ab[:, :, 1] * (yf - 1.0)
        d_bb = g_bb[:, :, 0] * (xf - 1.0) + g_bb[:, :, 1] * (yf - 1.0)

        x1 = d_aa + u * (d_ba - d_aa)
        x2 = d_ab + u * (d_bb - d_ab)
        return x1 + v * (x2 - x1)


def generate_curl_noise_field(
    width: int,
    height: int,
    scale: float = 0.015,
    octaves: int = 3,
    seed: int = 42,
    eps: float = 1.0,
) -> tuple[np.ndarray, np.ndarray]:
    """
    Generate an incompressible (divergence-free) 2D vector field (Vx, Vy) using curl of potential.
    Vx = dPsi/dy, Vy = -dPsi/dx
    """
    noise = PerlinNoise2D(seed=seed)
    # Generate potential field with 1 pixel margin for central differences
    psi = noise.generate_grid(width + 2, height + 2, scale=scale, octaves=octaves)

    # Central difference derivatives
    # dPsi/dx = (psi[y, x+1] - psi[y, x-1]) / (2 * eps)
    # dPsi/dy = (psi[y+1, x] - psi[y-1, x]) / (2 * eps)
    dpsi_dx = (psi[1:-1, 2:] - psi[1:-1, :-2]) / (2.0 * eps)
    dpsi_dy = (psi[2:, 1:-1] - psi[:-2, 1:-1]) / (2.0 * eps)

    vx = dpsi_dy
    vy = -dpsi_dx

    # Normalize magnitude safely
    mag = np.sqrt(vx * vx + vy * vy) + 1e-6
    vx = vx / mag
    vy = vy / mag

    return vx.astype(np.float32), vy.astype(np.float32)
