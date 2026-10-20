"""
Engine D: Gray-Scott Reaction-Diffusion Model.
Two interacting chemical concentrations U and V generating Turing patterns,
cellular mitosis, coral growth, solitons, and labyrinthine spirals.
"""

from __future__ import annotations

from typing import Any
import numpy as np

from vanta.core.base_engine import BaseEngine, RenderData
from vanta.utilities.colors import PALETTES


class ReactionDiffusionEngine(BaseEngine):
    """
    Gray-Scott 2D Reaction-Diffusion numerical simulator.
    Solves coupled partial differential equations using an isotropic 9-point Laplacian stencil.
    """

    def __init__(self):
        super().__init__("reaction_diffusion", "Reaction-Diffusion")
        # Standard Gray-Scott baseline parameters (Mitosis / Coral pattern)
        self.feed_rate = 0.0545
        self.kill_rate = 0.0620
        self.du = 0.2097
        self.dv = 0.1050
        self.substeps = 6
        self.palette_name = "amber_ember"

        # Grid resolution
        self.grid_w = 240
        self.grid_h = 180

        # Concentration fields: U initially 1.0 everywhere, V initially 0.0
        self.u = np.ones((self.grid_h, self.grid_w), dtype=np.float32)
        self.v = np.zeros((self.grid_h, self.grid_w), dtype=np.float32)

    def initialize(self, width: int, height: int, seed: int | None = None) -> None:
        self.width = max(width, 100)
        self.height = max(height, 100)
        if seed is not None:
            self.seed = seed

        aspect = self.width / self.height
        self.grid_h = 180
        self.grid_w = int(180 * aspect)

        # Reset grids
        self.u = np.ones((self.grid_h, self.grid_w), dtype=np.float32)
        self.v = np.zeros((self.grid_h, self.grid_w), dtype=np.float32)

        # Seed initial spots with reactant V based on seed
        rng = np.random.default_rng(self.seed)
        num_seeds = rng.integers(3, 8)
        for _ in range(num_seeds):
            cx = rng.integers(20, self.grid_w - 20)
            cy = rng.integers(20, self.grid_h - 20)
            r = rng.integers(6, 14)
            y_idx, x_idx = np.ogrid[cy - r : cy + r, cx - r : cx + r]
            mask = (x_idx - cx) ** 2 + (y_idx - cy) ** 2 <= r ** 2
            self.u[cy - r : cy + r, cx - r : cx + r][mask] = 0.50
            self.v[cy - r : cy + r, cx - r : cx + r][mask] = 0.25

        # Add minor noise for breaking symmetry
        self.v += rng.uniform(0.0, 0.02, size=(self.grid_h, self.grid_w)).astype(np.float32)

        self.step_count = 0

    def reset(self) -> None:
        self.initialize(self.width, self.height, self.seed)

    def step(self, dt: float) -> None:
        if self.is_paused:
            return

        # Perform numerical substeps per visual frame
        for _ in range(self.substeps):
            self._update_fields()

        self.step_count += self.substeps

    def _update_fields(self) -> None:
        """
        Compute Gray-Scott Euler integration step with 9-point Laplacian:
        Laplacian weights: center -1.0, orthogonals 0.2, diagonals 0.05
        """
        u = self.u
        v = self.v

        # 9-point isotropic discrete Laplacian stencil using periodic rolls
        lap_u = (
            -u +
            0.20 * (np.roll(u, 1, axis=0) + np.roll(u, -1, axis=0) + np.roll(u, 1, axis=1) + np.roll(u, -1, axis=1)) +
            0.05 * (
                np.roll(np.roll(u, 1, axis=0), 1, axis=1) +
                np.roll(np.roll(u, 1, axis=0), -1, axis=1) +
                np.roll(np.roll(u, -1, axis=0), 1, axis=1) +
                np.roll(np.roll(u, -1, axis=0), -1, axis=1)
            )
        )

        lap_v = (
            -v +
            0.20 * (np.roll(v, 1, axis=0) + np.roll(v, -1, axis=0) + np.roll(v, 1, axis=1) + np.roll(v, -1, axis=1)) +
            0.05 * (
                np.roll(np.roll(v, 1, axis=0), 1, axis=1) +
                np.roll(np.roll(v, 1, axis=0), -1, axis=1) +
                np.roll(np.roll(v, -1, axis=0), 1, axis=1) +
                np.roll(np.roll(v, -1, axis=0), -1, axis=1)
            )
        )

        uvv = u * v * v
        du_dt = self.du * lap_u - uvv + self.feed_rate * (1.0 - u)
        dv_dt = self.dv * lap_v + uvv - (self.feed_rate + self.kill_rate) * v

        # Euler step
        self.u = np.clip(u + du_dt, 0.0, 1.0)
        self.v = np.clip(v + dv_dt, 0.0, 1.0)

    def interact(self, x: float, y: float, button: int, mode: str = "seed") -> None:
        """Seed reactant V at mouse cursor location."""
        gx = int((x / self.width) * self.grid_w)
        gy = int((y / self.height) * self.grid_h)

        radius = 8
        y_min = max(gy - radius, 0)
        y_max = min(gy + radius, self.grid_h)
        x_min = max(gx - radius, 0)
        x_max = min(gx + radius, self.grid_w)

        y_idx, x_idx = np.ogrid[y_min:y_max, x_min:x_max]
        mask = (x_idx - gx) ** 2 + (y_idx - gy) ** 2 <= radius ** 2

        if button == 1:
            # Add V reactant
            self.u[y_min:y_max, x_min:x_max][mask] = 0.50
            self.v[y_min:y_max, x_min:x_max][mask] = 0.35
        else:
            # Clear / reset area to pure U
            self.u[y_min:y_max, x_min:x_max][mask] = 1.0
            self.v[y_min:y_max, x_min:x_max][mask] = 0.0

    def get_render_data(self) -> RenderData:
        palette = PALETTES.get(self.palette_name, PALETTES["amber_ember"])
        # Map chemical field V to RGBA false-color texture
        # Contrast stretch V concentration for vibrant visualization
        norm_v = np.clip(self.v * 3.2, 0.0, 1.0)
        rgba = palette.map_array_to_rgb(norm_v)

        return RenderData(
            mode="field",
            width=self.width,
            height=self.height,
            field_rgba=rgba,
            active_count=self.grid_w * self.grid_h,
            step_count=self.step_count,
            stats={"grid": f"{self.grid_w}x{self.grid_h}", "F": f"{self.feed_rate:.4f}", "k": f"{self.kill_rate:.4f}"},
        )

    def get_parameters(self) -> dict[str, Any]:
        return {
            "feed_rate": self.feed_rate,
            "kill_rate": self.kill_rate,
            "du": self.du,
            "dv": self.dv,
            "substeps": self.substeps,
            "palette_name": self.palette_name,
        }

    def set_parameters(self, params: dict[str, Any]) -> None:
        if "feed_rate" in params:
            self.feed_rate = float(np.clip(params["feed_rate"], 0.005, 0.090))
        if "kill_rate" in params:
            self.kill_rate = float(np.clip(params["kill_rate"], 0.030, 0.075))
        if "du" in params:
            self.du = float(np.clip(params["du"], 0.05, 0.40))
        if "dv" in params:
            self.dv = float(np.clip(params["dv"], 0.02, 0.20))
        if "substeps" in params:
            self.substeps = int(np.clip(params["substeps"], 1, 16))
        if "palette_name" in params:
            self.palette_name = str(params["palette_name"])
