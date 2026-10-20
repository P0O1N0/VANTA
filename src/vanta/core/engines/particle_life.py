"""
Engine A: Continuous-Space Particle Life Simulation.
Features multi-species interactions, full asymmetric interaction matrix,
spatial grid partitioning for neighbor lookup, and boundary physics.
"""

from __future__ import annotations

import math
from typing import Any
import numpy as np

from vanta.core.base_engine import BaseEngine, RenderData
from vanta.utilities.colors import SPECIES_COLORS


class ParticleLifeEngine(BaseEngine):
    """
    Multi-species continuous-space particle simulation.
    Emergent clusters, gliders, orbits, and complex biological-like structures
    emerge from an asymmetric inter-species force matrix.
    """

    def __init__(self):
        super().__init__("particle_life", "Particle Life")
        self.num_particles = 1500
        self.num_species = 5
        self.r_max = 80.0
        self.r_min = 15.0
        self.force_factor = 1.0
        self.friction = 0.85
        self.max_velocity = 8.0
        self.boundary_mode = "torus"  # 'torus' | 'bounce'
        self.trail_fade = 0.92
        self.point_size = 2.5

        # Particle arrays
        self.positions = np.zeros((0, 2), dtype=np.float32)
        self.velocities = np.zeros((0, 2), dtype=np.float32)
        self.species = np.zeros(0, dtype=np.int32)
        self.colors = np.zeros((0, 4), dtype=np.uint8)

        # Species-to-species interaction matrix M[source_species, target_species]
        self.matrix = np.zeros((self.num_species, self.num_species), dtype=np.float32)

    def initialize(self, width: int, height: int, seed: int | None = None) -> None:
        self.width = max(width, 100)
        self.height = max(height, 100)
        if seed is not None:
            self.seed = seed

        rng = np.random.default_rng(self.seed)

        # Spawn particles uniformly inside bounds
        self.positions = rng.uniform(
            low=[0.0, 0.0],
            high=[self.width, self.height],
            size=(self.num_particles, 2),
        ).astype(np.float32)

        self.velocities = np.zeros((self.num_particles, 2), dtype=np.float32)
        self.species = rng.integers(0, self.num_species, size=self.num_particles, dtype=np.int32)

        # Assign colors per species
        self.colors = SPECIES_COLORS[self.species % len(SPECIES_COLORS)].copy()

        # Generate interaction matrix if uninitialized
        if self.matrix.shape != (self.num_species, self.num_species):
            self.randomize_matrix(rng)

        self.step_count = 0

    def randomize_matrix(self, rng: np.random.Generator | None = None) -> None:
        """Generate a balanced, visually engaging interaction matrix."""
        if rng is None:
            rng = np.random.default_rng()
        # Values in [-1.0, 1.0] with self-repulsion bias
        mat = rng.uniform(-1.0, 1.0, size=(self.num_species, self.num_species)).astype(np.float32)
        for i in range(self.num_species):
            # Moderate self-attraction or self-repulsion
            mat[i, i] = rng.uniform(-0.5, 0.7)
        self.matrix = mat

    def set_matrix_value(self, i: int, j: int, val: float) -> None:
        """Update single cell in interaction matrix."""
        if 0 <= i < self.num_species and 0 <= j < self.num_species:
            self.matrix[i, j] = float(np.clip(val, -1.0, 1.0))

    def reset(self) -> None:
        self.initialize(self.width, self.height, self.seed)

    def step(self, dt: float) -> None:
        if self.is_paused or self.num_particles == 0:
            return

        effective_dt = min(dt * self.speed, 0.1)

        # Compute forces using spatial grid acceleration
        forces = self._compute_forces_grid()

        # Update velocities with damping
        self.velocities = self.velocities * self.friction + forces * (effective_dt * self.force_factor * 60.0)

        # Velocity clamping
        speed_sq = np.sum(self.velocities ** 2, axis=1)
        over_max = speed_sq > (self.max_velocity ** 2)
        if np.any(over_max):
            scales = self.max_velocity / np.sqrt(speed_sq[over_max])
            self.velocities[over_max] *= scales[:, np.newaxis]

        # Integrate positions
        self.positions += self.velocities * (effective_dt * 60.0)

        # Apply boundary conditions
        if self.boundary_mode == "torus":
            self.positions[:, 0] = np.mod(self.positions[:, 0], self.width)
            self.positions[:, 1] = np.mod(self.positions[:, 1], self.height)
        else:
            # Bounce
            left = self.positions[:, 0] < 0
            right = self.positions[:, 0] >= self.width
            top = self.positions[:, 1] < 0
            bottom = self.positions[:, 1] >= self.height

            self.velocities[left | right, 0] *= -0.8
            self.velocities[top | bottom, 1] *= -0.8
            self.positions[:, 0] = np.clip(self.positions[:, 0], 0, self.width - 1)
            self.positions[:, 1] = np.clip(self.positions[:, 1], 0, self.height - 1)

        self.step_count += 1

    def _compute_forces_grid(self) -> np.ndarray:
        """
        Evaluate pairwise forces accelerated by uniform grid spatial partitioning.
        Complexity: O(N * k) where k is local neighbor count.
        """
        N = self.num_particles
        forces = np.zeros((N, 2), dtype=np.float32)

        cell_size = max(self.r_max, 20.0)
        grid_w = max(int(self.width / cell_size) + 1, 1)
        grid_h = max(int(self.height / cell_size) + 1, 1)

        # Assign particles to cells
        cx = np.clip((self.positions[:, 0] / cell_size).astype(np.int32), 0, grid_w - 1)
        cy = np.clip((self.positions[:, 1] / cell_size).astype(np.int32), 0, grid_h - 1)
        cell_ids = cy * grid_w + cx

        # Sort particles by cell ID for contiguous memory access
        sort_idx = np.argsort(cell_ids)
        sorted_pos = self.positions[sort_idx]
        sorted_sp = self.species[sort_idx]
        sorted_cell_ids = cell_ids[sort_idx]

        # Find cell start and count
        unique_cells, cell_starts, cell_counts = np.unique(
            sorted_cell_ids, return_index=True, return_counts=True
        )
        cell_lookup = {}
        for c_id, start, count in zip(unique_cells, cell_starts, cell_counts):
            cell_lookup[c_id] = (start, count)

        r_min = self.r_min
        r_max = self.r_max
        r_diff = max(r_max - r_min, 1e-4)

        # Neighbor offsets in 2D (9 cells including self)
        neighbor_offsets = [
            (-1, -1), (0, -1), (1, -1),
            (-1,  0), (0,  0), (1,  0),
            (-1,  1), (0,  1), (1,  1),
        ]

        # Batch evaluation per populated cell
        for c_id in unique_cells:
            start_i, count_i = cell_lookup[c_id]
            idx_i = sort_idx[start_i : start_i + count_i]
            pos_i = sorted_pos[start_i : start_i + count_i]
            sp_i = sorted_sp[start_i : start_i + count_i]

            cur_cy = c_id // grid_w
            cur_cx = c_id % grid_w

            # Gather all candidate neighbor particles in 3x3 surrounding cells
            cand_indices = []
            for dx, dy in neighbor_offsets:
                nx = cur_cx + dx
                ny = cur_cy + dy
                if self.boundary_mode == "torus":
                    nx = nx % grid_w
                    ny = ny % grid_h
                elif not (0 <= nx < grid_w and 0 <= ny < grid_h):
                    continue

                nc_id = ny * grid_w + nx
                if nc_id in cell_lookup:
                    n_start, n_count = cell_lookup[nc_id]
                    cand_indices.extend(range(n_start, n_start + n_count))

            if not cand_indices:
                continue

            cand_pos = sorted_pos[cand_indices]
            cand_sp = sorted_sp[cand_indices]

            # Vectorized pairwise calculation for particles in this cell
            # pos_i: (M, 2), cand_pos: (K, 2)
            dx = cand_pos[:, 0][np.newaxis, :] - pos_i[:, 0][:, np.newaxis]
            dy = cand_pos[:, 1][np.newaxis, :] - pos_i[:, 1][:, np.newaxis]

            # Wrap periodic distance
            if self.boundary_mode == "torus":
                dx = dx - np.round(dx / self.width) * self.width
                dy = dy - np.round(dy / self.height) * self.height

            dist_sq = dx * dx + dy * dy
            dist = np.sqrt(dist_sq)

            # Avoid self-interaction and division by zero
            mask_valid = (dist > 1e-4) & (dist < r_max)

            # Calculate force magnitude
            # Short-range repulsion: dist < r_min -> force in [-1, 0]
            # Long-range interaction: r_min <= dist < r_max -> force = M[sp_i, sp_j] * triangular_curve
            repulsion = (dist / r_min - 1.0)
            mid_factor = 1.0 - np.abs(2.0 * dist - r_min - r_max) / r_diff

            # Species interaction coefficient from matrix
            coeffs = self.matrix[sp_i[:, np.newaxis], cand_sp[np.newaxis, :]]
            force_mag = np.where(dist < r_min, repulsion, coeffs * mid_factor)
            force_mag = np.where(mask_valid, force_mag, 0.0)

            # Normalize direction safely without divide-by-zero warning
            inv_dist = np.zeros_like(dist)
            valid_dist = dist > 1e-4
            inv_dist[valid_dist] = 1.0 / dist[valid_dist]
            fx = np.sum(force_mag * dx * inv_dist, axis=1)
            fy = np.sum(force_mag * dy * inv_dist, axis=1)

            forces[idx_i, 0] = fx
            forces[idx_i, 1] = fy

        return forces

    def interact(self, x: float, y: float, button: int, mode: str = "attract") -> None:
        """Mouse interaction: attract or repel particles around cursor."""
        if self.num_particles == 0:
            return
        dx = x - self.positions[:, 0]
        dy = y - self.positions[:, 1]
        dist_sq = dx * dx + dy * dy
        radius_sq = 150.0 ** 2
        in_range = dist_sq < radius_sq
        if not np.any(in_range):
            return

        dist = np.sqrt(dist_sq[in_range]) + 1e-4
        direction = 1.0 if button == 1 else -1.0  # Left click attract, right click repel
        strength = 4.0 * (1.0 - dist / 150.0) * direction

        self.velocities[in_range, 0] += (dx[in_range] / dist) * strength
        self.velocities[in_range, 1] += (dy[in_range] / dist) * strength

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
            stats={"species": self.num_species, "boundary": self.boundary_mode},
        )

    def get_parameters(self) -> dict[str, Any]:
        return {
            "num_particles": self.num_particles,
            "num_species": self.num_species,
            "r_max": self.r_max,
            "r_min": self.r_min,
            "friction": self.friction,
            "max_velocity": self.max_velocity,
            "force_factor": self.force_factor,
            "boundary_mode": self.boundary_mode,
            "trail_fade": self.trail_fade,
            "point_size": self.point_size,
            "matrix": self.matrix.tolist(),
        }

    def set_parameters(self, params: dict[str, Any]) -> None:
        reinit_needed = False

        if "num_particles" in params:
            new_n = int(np.clip(params["num_particles"], 100, 10000))
            if new_n != self.num_particles:
                self.num_particles = new_n
                reinit_needed = True

        if "num_species" in params:
            new_s = int(np.clip(params["num_species"], 2, 8))
            if new_s != self.num_species:
                self.num_species = new_s
                self.matrix = np.zeros((new_s, new_s), dtype=np.float32)
                self.randomize_matrix()
                reinit_needed = True

        if "r_max" in params:
            self.r_max = float(np.clip(params["r_max"], 20.0, 200.0))
        if "r_min" in params:
            self.r_min = float(np.clip(params["r_min"], 5.0, 50.0))
        if "friction" in params:
            self.friction = float(np.clip(params["friction"], 0.5, 0.99))
        if "max_velocity" in params:
            self.max_velocity = float(np.clip(params["max_velocity"], 1.0, 25.0))
        if "force_factor" in params:
            self.force_factor = float(np.clip(params["force_factor"], 0.1, 5.0))
        if "boundary_mode" in params:
            self.boundary_mode = str(params["boundary_mode"])
        if "trail_fade" in params:
            self.trail_fade = float(np.clip(params["trail_fade"], 0.5, 0.99))
        if "point_size" in params:
            self.point_size = float(np.clip(params["point_size"], 1.0, 10.0))

        if "matrix" in params:
            mat_data = np.array(params["matrix"], dtype=np.float32)
            if mat_data.shape == (self.num_species, self.num_species):
                self.matrix = mat_data

        if reinit_needed:
            self.initialize(self.width, self.height, self.seed)
