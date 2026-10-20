"""
Registry and factory for simulation engines in VANTA.
"""

from __future__ import annotations

from typing import Type
from vanta.core.base_engine import BaseEngine
from vanta.core.engines.particle_life import ParticleLifeEngine
from vanta.core.engines.physarum import PhysarumEngine
from vanta.core.engines.flow_field import FlowFieldEngine
from vanta.core.engines.reaction_diffusion import ReactionDiffusionEngine


class EngineRegistry:
    """Central catalog and instantiation factory for all available simulation engines."""

    _ENGINES: dict[str, Type[BaseEngine]] = {
        "particle_life": ParticleLifeEngine,
        "physarum": PhysarumEngine,
        "flow_field": FlowFieldEngine,
        "reaction_diffusion": ReactionDiffusionEngine,
    }

    _METADATA: dict[str, dict[str, str]] = {
        "particle_life": {
            "name_key": "engine_particle_life",
            "desc_key": "engine_particle_life_desc",
            "default_palette": "neon_cyber",
        },
        "physarum": {
            "name_key": "engine_physarum",
            "desc_key": "engine_physarum_desc",
            "default_palette": "bioluminescence",
        },
        "flow_field": {
            "name_key": "engine_flow_field",
            "desc_key": "engine_flow_field_desc",
            "default_palette": "spectral_velvet",
        },
        "reaction_diffusion": {
            "name_key": "engine_reaction_diffusion",
            "desc_key": "engine_reaction_diffusion_desc",
            "default_palette": "amber_ember",
        },
    }

    @classmethod
    def list_engine_ids(cls) -> list[str]:
        """Return list of all registered engine keys."""
        return list(cls._ENGINES.keys())

    @classmethod
    def get_metadata(cls, engine_id: str) -> dict[str, str]:
        """Return UI metadata for engine."""
        return cls._METADATA.get(engine_id, {})

    @classmethod
    def create_engine(cls, engine_id: str) -> BaseEngine:
        """Instantiate an engine by ID."""
        if engine_id not in cls._ENGINES:
            raise ValueError(f"Unknown engine '{engine_id}'. Available: {list(cls._ENGINES.keys())}")
        return cls._ENGINES[engine_id]()
