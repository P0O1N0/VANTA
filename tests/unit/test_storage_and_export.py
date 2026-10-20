"""
Unit tests for Database, ProjectManager (.vanta format), and ImageExporter.
"""

import tempfile
from pathlib import Path
import pytest
from vanta.core.engine_registry import EngineRegistry
from vanta.export.image_exporter import ImageExporter
from vanta.projects.project_manager import ProjectManager
from vanta.storage.database import Database


def test_database_settings_and_presets():
    """Verify SQLite CRUD operations for settings, recent projects, and custom presets."""
    with tempfile.TemporaryDirectory() as tmp_dir:
        db_path = Path(tmp_dir) / "test_vanta.db"
        db = Database(db_path)

        # Test settings
        db.set_setting("theme", "dark")
        db.set_setting("volume", 0.85)
        assert db.get_setting("theme") == "dark"
        assert db.get_setting("volume") == 0.85
        assert db.get_setting("non_existent", "default_val") == "default_val"

        # Test custom preset
        db.save_custom_preset(
            name="My Test Preset",
            engine_id="particle_life",
            params={"num_particles": 999},
            palette_name="neon_cyber",
        )
        presets = db.get_custom_presets("particle_life")
        assert len(presets) == 1
        assert presets[0]["name"] == "My Test Preset"
        assert presets[0]["params"]["num_particles"] == 999

        # Test deletion
        deleted = db.delete_custom_preset(presets[0]["id"])
        assert deleted is True
        assert len(db.get_custom_presets("particle_life")) == 0


def test_project_save_and_load_roundtrip():
    """Verify atomic project save and schema validation on load."""
    with tempfile.TemporaryDirectory() as tmp_dir:
        db_path = Path(tmp_dir) / "test.db"
        db = Database(db_path)
        pm = ProjectManager(db)

        engine = EngineRegistry.create_engine("flow_field")
        engine.initialize(400, 300, seed=42)

        proj_data = pm.create_project_data(
            name="Test Flow Project",
            engine_id="flow_field",
            parameters=engine.get_parameters(),
            seed=42,
            palette_name="spectral_velvet",
        )

        save_path = Path(tmp_dir) / "test_project.vanta"
        pm.save_project(save_path, proj_data)
        assert save_path.exists()

        # Load and validate
        loaded = pm.load_project(save_path)
        assert loaded["name"] == "Test Flow Project"
        assert loaded["engine_id"] == "flow_field"
        assert loaded["seed"] == 42
        assert loaded["parameters"]["noise_scale"] == engine.get_parameters()["noise_scale"]


def test_image_exporter_still():
    """Verify high-res PNG export produces valid non-empty image file."""
    with tempfile.TemporaryDirectory() as tmp_dir:
        exporter = ImageExporter()
        engine = EngineRegistry.create_engine("reaction_diffusion")
        engine.initialize(240, 180, seed=123)
        engine.step(0.016)

        out_file = Path(tmp_dir) / "output_test.png"
        res_path = exporter.export_still_image(engine, out_file, width=320, height=240)
        assert res_path.exists()
        assert res_path.stat().st_size > 1000  # Non-trivial image file
