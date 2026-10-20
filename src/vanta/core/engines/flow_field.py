"""
Engine C: Procedural Curl-Noise Flow Field Simulation.
Divergence-free vector fields, particle advection, dynamic vortex injection,
and silky organic particle trails with velocity-mapped color ramps.
"""

from __future__ import annotations

from typing import Any
import numpy as np

from vanta.core.base_engine import BaseEngine, RenderData
from vanta.utilities.noise import generate_curl_noise_field
from vanta.utilities.colors import PALETTES


class FlowFieldEngine(BaseEngine):
    """
    Procedural flow field simulator with incompressible curl noise,
    particle advection, long organic trails, and mouse-injected vortices.
    """

    def __init__(self):
        super().__init__("flow_field", "Flow Field")
        self.num_particles = 4000
        self.noise_scale = 0.012
        self.noise_octaves = 3
        self.particle_speed = 3.0
        self.trail_fade = 0.96
        self.point_size = 2.0
        self.palette_name = "spectral_velvet"
        self.boundary_mode = "wrap"  # 'wrap' | 'respawn'

        # Vector field coarse grid resolution
        self.field_w = 120
        self.field_h = 90
        self.vx_grid = np.zeros((self.field_h, self.field_w), dtype=np.float32)
        self.vy_grid = np.zeros((self.field_h, self.field_w), dtype=np.float32)

        # Dynamic user vortices: list of (x, y, strength, radius)
        self.vortices: list[dict[str, float]] = []

        # Particle arrays
        self.positions = np.zeros((0, 2), dtype=np.float32)
        self.velocities = np.zeros((0, 2), dtype=np.float32)
        self.colors = np.zeros((0, 4), dtype=np.uint8)
        self.ages = np.zeros(0, dtype=np.int32)
        self.max_ages = np.zeros(0, dtype=np.int32)

    def initialize(self, width: int, height: int, seed: int | None = None) -> None:
        self.width = max(width, 100)
        self.height = max(height, 100)
        if seed is not None:
            self.seed = seed

        aspect = self.width / self.height
        self.field_h = 90
        self.field_w = int(90 * aspect)

        # Precompute curl noise grid
        self._recompute_field()

        self.rng = np.random.default_rng(self.seed)

        # Initialize particles uniformly
        self.positions = self.rng.uniform(
            low=[0.0, 0.0],
            high=[self.width, self.height],
            size=(self.num_particles, 2),
        ).astype(np.float32)

        self.velocities = np.zeros((self.num_particles, 2), dtype=np.float32)
        self.ages = self.rng.integers(0, 150, size=self.num_particles, dtype=np.int32)
        self.max_ages = self.rng.integers(120, 260, size=self.num_particles, dtype=np.int32)
        self.colors = np.zeros((self.num_particles, 4), dtype=np.uint8)

        self.vortices.clear()
        self.step_count = 0

    def _recompute_field(self) -> None:
        """Regenerate coarse curl noise vector field."""
        self.vx_grid, self.vy_grid = generate_curl_noise_field(
            self.field_w,
            self.field_h,
            scale=self.noise_scale,
            octaves=self.noise_octaves,
            seed=self.seed,
        )

    def reset(self) -> None:
        self.initialize(self.width, self.height, self.seed)

    def step(self, dt: float) -> None:
        if self.is_paused or self.num_particles == 0:
            return

        effective_dt = min(dt * self.speed, 0.1)

        # Sample vector field via bilinear or cell coordinates
        # Map particle window positions to field grid indices
        gx = np.clip((self.positions[:, 0] / self.width) * (self.field_w - 1), 0, self.field_w - 1).astype(np.int32)
        gy = np.clip((self.positions[:, 1] / self.height) * (self.field_h - 1), 0, self.field_h - 1).astype(np.int32)

        target_vx = self.vx_grid[gy, gx] * self.particle_speed
        target_vy = self.vy_grid[gy, gx] * self.particle_speed

        # Apply active mouse-injected vortices
        if self.vortices:
            for v in self.vortices:
                dx = self.positions[:, 0] - v["x"]
                dy = self.positions[:, 1] - v["y"]
                d_sq = dx * dx + dy * dy
                r_sq = v["radius"] ** 2
                mask = d_sq < r_sq
                if np.any(mask):
                    d = np.sqrt(d_sq[mask]) + 1e-4
                    # Tangential vortex velocity (-dy, dx)
                    factor = v["strength"] * (1.0 - d / v["radius"])
                    target_vx[mask] += (-dy[mask] / d) * factor
                    target_vy[mask] += (dx[mask] / d) * factor

        # Smooth velocity interpolation
        self.velocities = self.velocities * 0.88 + np.stack([target_vx, target_vy], axis=-1) * 0.12

        # Integrate positions
        self.positions += self.velocities * (effective_dt * 60.0)

        # Age particles and respawn expired ones
        self.ages += 1
        expired = self.ages >= self.max_ages

        # Boundary checks
        if self.boundary_mode == "wrap":
            self.positions[:, 0] = np.mod(self.positions[:, 0], self.width)
            self.positions[:, 1] = np.mod(self.positions[:, 1], self.height)
        else:
            out_of_bounds = (
                (self.positions[:, 0] < 0) | (self.positions[:, 0] >= self.width) |
                (self.positions[:, 1] < 0) | (self.positions[:, 1] >= self.height)
            )
            expired = expired | out_of_bounds

        if np.any(expired):
            n_exp = int(np.sum(expired))
            self.positions[expired] = self.rng.uniform(
                low=[0.0, 0.0],
                high=[self.width, self.height],
                size=(n_exp, 2),
            ).astype(np.float32)
            self.velocities[expired] = 0.0
            self.ages[expired] = 0

        # Update particle colors based on velocity orientation and speed
        angles = np.arctan2(self.velocities[:, 1], self.velocities[:, 0])
        norm_angles = (angles + np.pi) / (2 * np.pi)  # [0, 1]

        palette = PALETTES.get(self.palette_name, PALETTES["spectral_velvet"])
        indices = np.clip((norm_angles * (palette.lut_size - 1)).astype(np.int32), 0, palette.lut_size - 1)
        self.colors = palette.lut[indices].copy()

        self.step_count += 1

    def interact(self, x: float, y: float, button: int, mode: str = "vortex") -> None:
        """Inject rotational vortex or radial attractor at cursor location."""
        strength = 8.0 if button == 1 else -8.0
        self.vortices.append({
            "x": x,
            "y": y,
            "strength": strength,
            "radius": 180.0,
        })
        # Keep maximum 5 active vortices
        if len(self.vortices) > 5:
            self.vortices.pop(0)

    def get_render_data(self) -> RenderData:
        return RenderData(
            mode="particles",
            width=self.width,
            height=self.height,
            positions=self.positions,
            colors=self.colors,
            point_size=self.point_size,
            trail_fade=self.trail_fade,
            active_count=self.num_particles,
            step_count=self.step_count,
            stats={"octaves": self.noise_octaves, "scale": self.noise_scale, "vortices": len(self.vortices)},
        )

    def get_parameters(self) -> dict[str, Any]:
        return {
            "num_particles": self.num_particles,
            "noise_scale": self.noise_scale,
            "noise_octaves": self.noise_octaves,
            "particle_speed": self.particle_speed,
            "trail_fade": self.trail_fade,
            "point_size": self.point_size,
            "palette_name": self.palette_name,
            "boundary_mode": self.boundary_mode,
        }

    def set_parameters(self, params: dict[str, Any]) -> None:
        reinit_needed = False
        recompute_field = False

        if "num_particles" in params:
            new_n = int(np.clip(params["num_particles"], 500, 20000))
            if new_n != self.num_particles:
                self.num_particles = new_n
                reinit_needed = True

        if "noise_scale" in params:
            self.noise_scale = float(np.clip(params["noise_scale"], 0.003, 0.05))
            recompute_field = True

        if "noise_octaves" in params:
            self.noise_octaves = int(np.clip(params["noise_octaves"], 1, 5))
            recompute_field = True

        if "particle_speed" in params:
            self.particle_speed = float(np.clip(params["particle_speed"], 0.5, 12.0))
        if "trail_fade" in params:
            self.trail_fade = float(np.clip(params["trail_fade"], 0.70, 0.99))
        if "point_size" in params:
            self.point_size = float(np.clip(params["point_size"], 1.0, 8.0))
        if "palette_name" in params:
            self.palette_name = str(params["palette_name"])
        if "boundary_mode" in params:
            self.boundary_mode = str(params["boundary_mode"])

        if recompute_field and not reinit_needed:
            self._recompute_field()

        if reinit_needed:
            self.initialize(self.width, self.height, self.seed)
