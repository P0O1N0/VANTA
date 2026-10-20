"""
Engine B: Agent-based Physarum Polycephalum (Slime Mold) Simulation.
Based on Jeff Jones' sensory-motor loop: sensing, steering, chemical deposition,
spatial diffusion, and exponential decay. Emergent biological networks.
"""

from __future__ import annotations

from typing import Any
import numpy as np

from vanta.core.base_engine import BaseEngine, RenderData
from vanta.utilities.colors import PALETTES, ColorPalette


class PhysarumEngine(BaseEngine):
    """
    Physarum polycephalum multi-agent biological network simulation.
    Agents steer toward chemical trails, deposit chemoattractants,
    and form self-organizing organic vein networks.
    """

    def __init__(self):
        super().__init__("physarum", "Physarum (Slime Mold)")
        self.num_agents = 4000
        self.speed = 1.0
        self.step_size = 1.5
        self.sensor_angle = float(np.radians(35.0))
        self.sensor_dist = 12.0
        self.turn_angle = float(np.radians(25.0))
        self.deposit_amount = 5.0
        self.decay_factor = 0.08
        self.palette_name = "bioluminescence"

        # Simulation grid resolution (can be 1:1 or scaled for performance)
        self.grid_w = 400
        self.grid_h = 300
        self.trail_map = np.zeros((self.grid_h, self.grid_w), dtype=np.float32)

        # Agent state arrays: shape (N,)
        self.agent_x = np.zeros(0, dtype=np.float32)
        self.agent_y = np.zeros(0, dtype=np.float32)
        self.agent_angle = np.zeros(0, dtype=np.float32)

    def initialize(self, width: int, height: int, seed: int | None = None) -> None:
        self.width = max(width, 100)
        self.height = max(height, 100)
        if seed is not None:
            self.seed = seed

        self.rng = np.random.default_rng(self.seed)

        # Grid resolution scaled to aspect ratio
        aspect = self.width / self.height
        self.grid_h = 300
        self.grid_w = int(300 * aspect)
        self.trail_map = np.zeros((self.grid_h, self.grid_w), dtype=np.float32)

        # Spawn agents in random circular ring or uniform cluster
        angles = self.rng.uniform(0, 2 * np.pi, size=self.num_agents).astype(np.float32)
        radii = self.rng.uniform(0, min(self.grid_w, self.grid_h) * 0.35, size=self.num_agents).astype(np.float32)
        cx = self.grid_w * 0.5
        cy = self.grid_h * 0.5

        self.agent_x = cx + radii * np.cos(angles)
        self.agent_y = cy + radii * np.sin(angles)
        # Orient agents inwards/outwards or random
        self.agent_angle = self.rng.uniform(0, 2 * np.pi, size=self.num_agents).astype(np.float32)

        self.step_count = 0

    def reset(self) -> None:
        self.initialize(self.width, self.height, self.seed)

    def step(self, dt: float) -> None:
        if self.is_paused or self.num_agents == 0:
            return

        gw = self.grid_w
        gh = self.grid_h
        N = self.num_agents

        # 1. Sensory Stage: Sample 3 sensor points (forward, left, right)
        so = self.sensor_angle
        sd = self.sensor_dist

        ang_f = self.agent_angle
        ang_l = self.agent_angle - so
        ang_r = self.agent_angle + so

        # Sensor positions (toroidal wrap)
        fx = np.mod((self.agent_x + sd * np.cos(ang_f)).astype(np.int32), gw)
        fy = np.mod((self.agent_y + sd * np.sin(ang_f)).astype(np.int32), gh)

        lx = np.mod((self.agent_x + sd * np.cos(ang_l)).astype(np.int32), gw)
        ly = np.mod((self.agent_y + sd * np.sin(ang_l)).astype(np.int32), gh)

        rx = np.mod((self.agent_x + sd * np.cos(ang_r)).astype(np.int32), gw)
        ry = np.mod((self.agent_y + sd * np.sin(ang_r)).astype(np.int32), gh)

        s_f = self.trail_map[fy, fx]
        s_l = self.trail_map[ly, lx]
        s_r = self.trail_map[ry, rx]

        # 2. Motor Stage: Steer based on gradient
        steer = np.zeros(N, dtype=np.float32)
        # Case 1: Front is strictly highest -> keep moving straight (steer = 0)
        # Case 2: Left > Right -> turn left (-turn_angle)
        # Case 3: Right > Left -> turn right (+turn_angle)
        # Case 4: Equal / ambiguous -> random jitter
        turn_left = (s_l > s_r) & (s_l > s_f)
        turn_right = (s_r > s_l) & (s_r > s_f)
        ambiguous = (s_l == s_r) & (s_l > s_f)

        steer[turn_left] = -self.turn_angle
        steer[turn_right] = self.turn_angle

        if np.any(ambiguous):
            jitter = self.rng.choice([-self.turn_angle, self.turn_angle], size=int(np.sum(ambiguous)))
            steer[ambiguous] = jitter

        self.agent_angle += steer

        # 3. Move forward
        step_len = self.step_size * self.speed
        self.agent_x = np.mod(self.agent_x + step_len * np.cos(self.agent_angle), gw)
        self.agent_y = np.mod(self.agent_y + step_len * np.sin(self.agent_angle), gh)

        # 4. Deposit Stage: Add chemical signal
        ix = np.clip(self.agent_x.astype(np.int32), 0, gw - 1)
        iy = np.clip(self.agent_y.astype(np.int32), 0, gh - 1)
        np.add.at(self.trail_map, (iy, ix), self.deposit_amount)

        # 5. Diffusion & Decay Stage (Fast 3x3 separable box blur)
        # Periodic boundary 3x3 average
        t = self.trail_map
        t_blur = (
            t +
            np.roll(t, 1, axis=0) + np.roll(t, -1, axis=0) +
            np.roll(t, 1, axis=1) + np.roll(t, -1, axis=1) +
            np.roll(np.roll(t, 1, axis=0), 1, axis=1) +
            np.roll(np.roll(t, 1, axis=0), -1, axis=1) +
            np.roll(np.roll(t, -1, axis=0), 1, axis=1) +
            np.roll(np.roll(t, -1, axis=0), -1, axis=1)
        ) * (1.0 / 9.0)

        # Exponential decay and clamping
        self.trail_map = np.clip(t_blur * (1.0 - self.decay_factor), 0.0, 100.0)

        self.step_count += 1

    def interact(self, x: float, y: float, button: int, mode: str = "seed") -> None:
        """Deposit concentrated chemical attractant at mouse coordinates."""
        # Convert window coords to grid coords
        gx = int((x / self.width) * self.grid_w)
        gy = int((y / self.height) * self.grid_h)

        radius = 12
        y_min = max(gy - radius, 0)
        y_max = min(gy + radius, self.grid_h)
        x_min = max(gx - radius, 0)
        x_max = min(gx + radius, self.grid_w)

        y_idx, x_idx = np.ogrid[y_min:y_max, x_min:x_max]
        mask = (x_idx - gx) ** 2 + (y_idx - gy) ** 2 <= radius ** 2

        self.trail_map[y_min:y_max, x_min:x_max][mask] += 30.0

    def get_render_data(self) -> RenderData:
        # Map trail map intensity to RGBA texture using active color palette
        palette = PALETTES.get(self.palette_name, PALETTES["bioluminescence"])
        # Normalize display intensity [0, 1] using dynamic range or soft sigmoid
        normalized = np.tanh(self.trail_map * 0.1)
        rgba = palette.map_array_to_rgb(normalized)

        return RenderData(
            mode="field",
            width=self.width,
            height=self.height,
            field_rgba=rgba,
            active_count=self.num_agents,
            step_count=self.step_count,
            stats={"grid": f"{self.grid_w}x{self.grid_h}", "palette": self.palette_name},
        )

    def get_parameters(self) -> dict[str, Any]:
        return {
            "num_agents": self.num_agents,
            "step_size": self.step_size,
            "sensor_angle": float(np.degrees(self.sensor_angle)),
            "sensor_dist": self.sensor_dist,
            "turn_angle": float(np.degrees(self.turn_angle)),
            "deposit_amount": self.deposit_amount,
            "decay_factor": self.decay_factor,
            "palette_name": self.palette_name,
        }

    def set_parameters(self, params: dict[str, Any]) -> None:
        reinit_needed = False

        if "num_agents" in params:
            new_n = int(np.clip(params["num_agents"], 500, 30000))
            if new_n != self.num_agents:
                self.num_agents = new_n
                reinit_needed = True

        if "step_size" in params:
            self.step_size = float(np.clip(params["step_size"], 0.5, 6.0))
        if "sensor_angle" in params:
            self.sensor_angle = float(np.radians(np.clip(params["sensor_angle"], 5.0, 90.0)))
        if "sensor_dist" in params:
            self.sensor_dist = float(np.clip(params["sensor_dist"], 2.0, 50.0))
        if "turn_angle" in params:
            self.turn_angle = float(np.radians(np.clip(params["turn_angle"], 5.0, 90.0)))
        if "deposit_amount" in params:
            self.deposit_amount = float(np.clip(params["deposit_amount"], 0.5, 20.0))
        if "decay_factor" in params:
            self.decay_factor = float(np.clip(params["decay_factor"], 0.01, 0.30))
        if "palette_name" in params:
            self.palette_name = str(params["palette_name"])

        if reinit_needed:
            self.initialize(self.width, self.height, self.seed)
