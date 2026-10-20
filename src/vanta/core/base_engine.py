"""
Abstract base class and data structures for all VANTA simulation engines.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Any
import numpy as np


@dataclass
class RenderData:
    """Standardized render payload passed from simulation engines to renderers."""

    mode: str = "particles"  # 'particles' | 'field' | 'hybrid'
    width: int = 800
    height: int = 600

    # Particle rendering data
    positions: np.ndarray | None = None  # Shape (N, 2), float32 in [0, width] x [0, height]
    colors: np.ndarray | None = None     # Shape (N, 4) or (N, 3), uint8
    radii: np.ndarray | None = None      # Shape (N,), float32 or None for uniform

    # Field / Density rendering data
    field_rgba: np.ndarray | None = None  # Shape (H, W, 4), uint8 RGBA texture

    # Visual rendering options
    trail_fade: float = 0.92             # Alpha persistence factor
    point_size: float = 2.5              # Default particle radius
    bg_color: tuple[int, int, int] = (8, 10, 14)

    # Performance and state telemetry
    active_count: int = 0
    step_count: int = 0
    stats: dict[str, Any] = field(default_factory=dict)


class BaseEngine(ABC):
    """Abstract interface defining the lifecycle and operational contract of a simulation engine."""

    def __init__(self, engine_id: str, name: str):
        self.engine_id = engine_id
        self.name = name
        self.width = 800
        self.height = 600
        self.seed = 42
        self.step_count = 0
        self.is_paused = False
        self.speed = 1.0

    @abstractmethod
    def initialize(self, width: int, height: int, seed: int | None = None) -> None:
        """Initialize or resize simulation buffers with given dimensions and random seed."""
        pass

    @abstractmethod
    def step(self, dt: float) -> None:
        """Advance the simulation state by timestep dt."""
        pass

    @abstractmethod
    def reset(self) -> None:
        """Reset the simulation back to initial configuration."""
        pass

    @abstractmethod
    def get_render_data(self) -> RenderData:
        """Generate and return current render payload."""
        pass

    @abstractmethod
    def get_parameters(self) -> dict[str, Any]:
        """Return dict of current configurable parameters."""
        pass

    @abstractmethod
    def set_parameters(self, params: dict[str, Any]) -> None:
        """Validate and apply parameter changes."""
        pass

    @abstractmethod
    def interact(self, x: float, y: float, button: int, mode: str = "attract") -> None:
        """Handle canvas mouse interaction (click, drag, vortex injection, reactant seeding)."""
        pass

    def serialize(self) -> dict[str, Any]:
        """Serialize engine state and parameters to JSON-compatible dictionary."""
        return {
            "engine_id": self.engine_id,
            "seed": self.seed,
            "width": self.width,
            "height": self.height,
            "speed": self.speed,
            "step_count": self.step_count,
            "parameters": self.get_parameters(),
        }

    def deserialize(self, data: dict[str, Any]) -> None:
        """Restore parameters from dictionary."""
        if "seed" in data:
            self.seed = int(data["seed"])
        if "speed" in data:
            self.speed = float(data["speed"])
        if "parameters" in data:
            self.set_parameters(data["parameters"])
