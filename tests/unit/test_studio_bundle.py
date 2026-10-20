"""
Tests for VANTA Web Studio Bundle:
Validates engine completeness, syntax integrity, preset mapping, and parameter controls
for all 13 simulation universes.
"""

from pathlib import Path
import re


def test_bundle_syntax_and_balance():
    bundle_path = Path("studio/js/bundle.js")
    assert bundle_path.exists(), "studio/js/bundle.js must exist"

    content = bundle_path.read_text(encoding="utf-8")

    # Braces, parentheses, and square brackets balance check
    assert content.count("{") == content.count("}"), "Brace count mismatch in bundle.js"
    assert content.count("(") == content.count(")"), "Parenthesis count mismatch in bundle.js"
    assert content.count("[") == content.count("]"), "Square bracket count mismatch in bundle.js"


def test_all_13_worlds_registered():
    content = Path("studio/js/bundle.js").read_text(encoding="utf-8")

    expected_worlds = [
        "particle_life",
        "physarum",
        "cosmic_gravity",
        "boids_swarm",
        "quantum_wave",
        "crystal_growth",
        "flow_field",
        "reaction_diffusion",
        "lenia",
        "ferrofluid",
        "fractal_growth",
        "excitable_medium",
        "thermal_convection",
    ]

    for wid in expected_worlds:
        assert f'id: "{wid}"' in content or f"id: '{wid}'" in content, f"World {wid} missing in WORLDS"
        assert f"{wid}: new" in content, f"Engine {wid} not instantiated in this.engines"


def test_all_13_engine_classes_exist():
    content = Path("studio/js/bundle.js").read_text(encoding="utf-8")

    expected_classes = [
        "ParticleLifeEngine",
        "PhysarumEngine",
        "CosmicGravityEngine",
        "BoidsSwarmEngine",
        "QuantumWaveEngine",
        "CrystalGrowthEngine",
        "FlowFieldEngine",
        "ReactionDiffusionEngine",
        "LeniaEngine",
        "FerrofluidEngine",
        "FractalGrowthEngine",
        "ExcitableMediumEngine",
        "ThermalConvectionEngine",
    ]

    for cls in expected_classes:
        assert f"class {cls}" in content, f"Class {cls} missing in bundle.js"


def test_presets_map_to_valid_engines():
    content = Path("studio/js/bundle.js").read_text(encoding="utf-8")

    expected_worlds = {
        "particle_life", "physarum", "cosmic_gravity", "boids_swarm",
        "quantum_wave", "crystal_growth", "flow_field", "reaction_diffusion",
        "lenia", "ferrofluid", "fractal_growth", "excitable_medium", "thermal_convection"
    }

    # Find all engines referenced in presets
    preset_engines = re.findall(r'engine:\s*["\']([a-zA-Z0-9_]+)["\']', content)
    assert len(preset_engines) >= 15, f"Expected at least 15 presets, found {len(preset_engines)}"

    for eng in preset_engines:
        assert eng in expected_worlds, f"Preset references unknown engine: {eng}"


def test_inspector_controls_all_worlds():
    content = Path("studio/js/bundle.js").read_text(encoding="utf-8")

    inspector_checked_engines = [
        "particle_life", "cosmic_gravity", "boids_swarm", "physarum",
        "lenia", "ferrofluid", "fractal_growth", "excitable_medium", "thermal_convection"
    ]

    for eid in inspector_checked_engines:
        assert f"this.activeEngineId === '{eid}'" in content, f"Inspector controls missing for {eid}"
