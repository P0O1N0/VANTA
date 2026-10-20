"""
Preset management: merging factory curated presets with user-defined custom presets.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from vanta.presets.library import CURATED_PRESETS, Preset, get_presets_for_engine
from vanta.storage.database import Database
from vanta.utilities.logger import get_logger

logger = get_logger("presets.manager")


class PresetManager:
    """Coordinates curated factory presets and SQLite-stored custom presets."""

    def __init__(self, db: Database | None = None):
        self.db = db or Database()

    def get_presets(self, engine_id: str | None = None) -> list[dict[str, Any]]:
        """Return combined list of factory and custom presets."""
        results: list[dict[str, Any]] = []

        # 1. Curated factory presets
        factory = get_presets_for_engine(engine_id) if engine_id else CURATED_PRESETS
        for p in factory:
            results.append({
                "id": p.id,
                "name": p.name,
                "engine_id": p.engine_id,
                "category": p.category,
                "description": p.description,
                "palette_name": p.palette_name,
                "seed": p.seed,
                "parameters": p.parameters,
                "is_custom": False,
            })

        # 2. User custom presets from database
        try:
            custom = self.db.get_custom_presets(engine_id)
            for c in custom:
                results.append({
                    "id": f"custom_{c['id']}",
                    "db_id": c["id"],
                    "name": c["name"],
                    "engine_id": c["engine_id"],
                    "category": c.get("category", "Custom"),
                    "description": c.get("description", ""),
                    "palette_name": c.get("palette_name", "neon_cyber"),
                    "seed": 42,
                    "parameters": c["params"],
                    "is_custom": True,
                })
        except Exception as e:
            logger.error(f"Error fetching custom presets: {e}")

        return results

    def save_custom_preset(
        self,
        name: str,
        engine_id: str,
        parameters: dict[str, Any],
        palette_name: str = "neon_cyber",
        description: str = "",
    ) -> None:
        """Persist a new user preset into SQLite."""
        self.db.save_custom_preset(
            name=name,
            engine_id=engine_id,
            params=parameters,
            palette_name=palette_name,
            description=description,
            category="Custom",
        )
        logger.info(f"Custom preset '{name}' saved for engine '{engine_id}'.")

    def export_preset_json(self, preset_dict: dict[str, Any], filepath: Path | str) -> None:
        """Export preset definition to external .json file."""
        p = Path(filepath)
        data = {
            "vanta_preset_version": "1.0",
            "name": preset_dict["name"],
            "engine_id": preset_dict["engine_id"],
            "category": preset_dict.get("category", "Exported"),
            "palette_name": preset_dict.get("palette_name", "neon_cyber"),
            "parameters": preset_dict["parameters"],
        }
        p.write_text(json.dumps(data, indent=2), encoding="utf-8")

    def import_preset_json(self, filepath: Path | str) -> dict[str, Any]:
        """Import preset from .json file and persist into database."""
        p = Path(filepath)
        raw = json.loads(p.read_text(encoding="utf-8"))
        name = raw.get("name", p.stem)
        engine_id = raw["engine_id"]
        params = raw["parameters"]
        palette = raw.get("palette_name", "neon_cyber")
        self.save_custom_preset(name, engine_id, params, palette)
        return raw
