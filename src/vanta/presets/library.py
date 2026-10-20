"""
Curated library of factory presets across all four simulation engines.
"""

from __future__ import annotations
from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True)
class Preset:
    id: str
    name: str
    engine_id: str
    category: str
    description: str
    palette_name: str
    seed: int
    parameters: dict[str, Any]


CURATED_PRESETS: list[Preset] = [
    # Engine A: Particle Life Presets
    Preset(
        id="nebula_swarm",
        name="Nebula Swarm",
        engine_id="particle_life",
        category="Cosmic",
        description="High-velocity orbital clusters with gravitationally balanced species forces.",
        palette_name="neon_cyber",
        seed=1042,
        parameters={
            "num_particles": 1800,
            "num_species": 5,
            "r_max": 95.0,
            "r_min": 14.0,
            "friction": 0.88,
            "max_velocity": 9.0,
            "force_factor": 1.2,
            "boundary_mode": "torus",
            "trail_fade": 0.93,
            "point_size": 2.5,
            "matrix": [
                [0.4, -0.6, 0.8, -0.2, 0.5],
                [0.5, 0.2, -0.7, 0.6, -0.3],
                [-0.4, 0.7, 0.3, -0.5, 0.8],
                [0.6, -0.3, 0.5, 0.1, -0.8],
                [-0.5, 0.8, -0.2, 0.7, 0.4],
            ],
        },
    ),
    Preset(
        id="balanced_ecosystem",
        name="Balanced Ecosystem",
        engine_id="particle_life",
        category="Biological",
        description="Complex chasing dynamics mimicking multi-tiered predator-prey relationships.",
        palette_name="neon_cyber",
        seed=2048,
        parameters={
            "num_particles": 1500,
            "num_species": 4,
            "r_max": 80.0,
            "r_min": 16.0,
            "friction": 0.84,
            "max_velocity": 7.5,
            "force_factor": 1.0,
            "boundary_mode": "torus",
            "trail_fade": 0.90,
            "point_size": 2.8,
            "matrix": [
                [0.2, 0.6, -0.8, 0.1],
                [-0.5, 0.3, 0.7, -0.6],
                [0.8, -0.6, 0.1, 0.5],
                [-0.4, 0.7, -0.5, 0.2],
            ],
        },
    ),
    Preset(
        id="competing_species",
        name="Competing Species",
        engine_id="particle_life",
        category="Biological",
        description="Strong inter-species repulsion causing segregated territorial cell colonies.",
        palette_name="neon_cyber",
        seed=3311,
        parameters={
            "num_particles": 2000,
            "num_species": 4,
            "r_max": 75.0,
            "r_min": 18.0,
            "friction": 0.82,
            "max_velocity": 6.5,
            "force_factor": 1.1,
            "boundary_mode": "bounce",
            "trail_fade": 0.88,
            "point_size": 3.0,
            "matrix": [
                [0.8, -0.9, -0.9, -0.9],
                [-0.9, 0.8, -0.9, -0.9],
                [-0.9, -0.9, 0.8, -0.9],
                [-0.9, -0.9, -0.9, 0.8],
            ],
        },
    ),

    # Engine B: Physarum Presets
    Preset(
        id="living_coral",
        name="Living Coral",
        engine_id="physarum",
        category="Biological",
        description="Branching morphological venation reminiscent of deep sea coral and slime mold.",
        palette_name="bioluminescence",
        seed=5501,
        parameters={
            "num_agents": 5000,
            "step_size": 1.4,
            "sensor_angle": 32.0,
            "sensor_dist": 14.0,
            "turn_angle": 22.5,
            "deposit_amount": 5.5,
            "decay_factor": 0.075,
            "palette_name": "bioluminescence",
        },
    ),
    Preset(
        id="toxic_network",
        name="Toxic Network",
        engine_id="physarum",
        category="Biological",
        description="High-frequency branching networks with rapid chemical signaling.",
        palette_name="toxic_emerald",
        seed=7719,
        parameters={
            "num_agents": 7000,
            "step_size": 1.8,
            "sensor_angle": 45.0,
            "sensor_dist": 10.0,
            "turn_angle": 35.0,
            "deposit_amount": 6.0,
            "decay_factor": 0.09,
            "palette_name": "toxic_emerald",
        },
    ),

    # Engine C: Flow Field Presets
    Preset(
        id="silk_current",
        name="Silk Current",
        engine_id="flow_field",
        category="Fluid Dynamics",
        description="Laminar fluid flow with elongated silky particle trails in velvet tones.",
        palette_name="spectral_velvet",
        seed=8842,
        parameters={
            "num_particles": 4500,
            "noise_scale": 0.010,
            "noise_octaves": 3,
            "particle_speed": 2.8,
            "trail_fade": 0.97,
            "point_size": 1.8,
            "palette_name": "spectral_velvet",
            "boundary_mode": "wrap",
        },
    ),
    Preset(
        id="electric_bloom",
        name="Electric Bloom",
        engine_id="flow_field",
        category="Cosmic",
        description="High-energy turbulent vector currents with vivid glowing particles.",
        palette_name="neon_cyber",
        seed=9913,
        parameters={
            "num_particles": 5000,
            "noise_scale": 0.022,
            "noise_octaves": 4,
            "particle_speed": 4.5,
            "trail_fade": 0.95,
            "point_size": 2.2,
            "palette_name": "neon_cyber",
            "boundary_mode": "wrap",
        },
    ),

    # Engine D: Reaction-Diffusion Presets
    Preset(
        id="diffusion_garden",
        name="Diffusion Garden",
        engine_id="reaction_diffusion",
        category="Abstract Math",
        description="Pearson Coral & Dividing Spots (Mitosis) pattern evolving into self-replicating cells.",
        palette_name="amber_ember",
        seed=4100,
        parameters={
            "feed_rate": 0.0545,
            "kill_rate": 0.0620,
            "du": 0.2097,
            "dv": 0.1050,
            "substeps": 6,
            "palette_name": "amber_ember",
        },
    ),
    Preset(
        id="soliton_waves",
        name="Soliton Waves",
        engine_id="reaction_diffusion",
        category="Abstract Math",
        description="Pulsing solitary waves and moving wave solitons under low feed conditions.",
        palette_name="bioluminescence",
        seed=5211,
        parameters={
            "feed_rate": 0.0300,
            "kill_rate": 0.0620,
            "du": 0.2097,
            "dv": 0.1050,
            "substeps": 7,
            "palette_name": "bioluminescence",
        },
    ),
    Preset(
        id="labyrinth_spirals",
        name="Labyrinth Spirals",
        engine_id="reaction_diffusion",
        category="Abstract Math",
        description="Intricate worm-like labyrinthine skin patterns and rotating chemical spirals.",
        palette_name="monochrome",
        seed=6322,
        parameters={
            "feed_rate": 0.0460,
            "kill_rate": 0.0630,
            "du": 0.2097,
            "dv": 0.1050,
            "substeps": 6,
            "palette_name": "monochrome",
        },
    ),
]


def get_presets_for_engine(engine_id: str) -> list[Preset]:
    """Return all curated presets for a specific simulation engine."""
    return [p for p in CURATED_PRESETS if p.engine_id == engine_id]


def get_preset_by_id(preset_id: str) -> Preset | None:
    """Find preset by its unique ID."""
    for p in CURATED_PRESETS:
        if p.id == preset_id:
            return p
    return None
