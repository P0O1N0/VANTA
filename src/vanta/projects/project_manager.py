"""
Project serialization and management for VANTA (.vanta JSON project format).
Implements atomic writes, schema validation, safe deserialization (no pickle),
and recent project tracking.
"""

from __future__ import annotations

import json
import os
import shutil
import tempfile
from pathlib import Path
from typing import Any

from vanta.config.settings import APP_VERSION, get_projects_dir
from vanta.storage.database import Database
from vanta.utilities.logger import get_logger

logger = get_logger("projects.manager")

CURRENT_PROJECT_FORMAT_VERSION = "1.0.0"


class ProjectManager:
    """Manages creation, safe atomic saving, loading, and validation of .vanta files."""

    def __init__(self, db: Database | None = None):
        self.db = db or Database()
        self.current_project_path: Path | None = None
        self.is_dirty: bool = False

    def create_project_data(
        self,
        name: str,
        engine_id: str,
        parameters: dict[str, Any],
        seed: int,
        palette_name: str = "neon_cyber",
        description: str = "",
    ) -> dict[str, Any]:
        """Construct standard .vanta project manifest dictionary."""
        return {
            "vanta_format": "VANTA_PROJECT",
            "format_version": CURRENT_PROJECT_FORMAT_VERSION,
            "app_version": APP_VERSION,
            "name": name,
            "description": description,
            "engine_id": engine_id,
            "seed": seed,
            "palette_name": palette_name,
            "parameters": parameters,
        }

    def save_project(self, filepath: Path | str, project_data: dict[str, Any]) -> None:
        """
        Safely and atomically write project to disk via temporary file replacement.
        Prevents file corruption if an interruption occurs during write.
        """
        dest_path = Path(filepath).resolve()
        if dest_path.suffix.lower() != ".vanta":
            dest_path = dest_path.with_suffix(".vanta")

        dest_path.parent.mkdir(parents=True, exist_ok=True)

        content = json.dumps(project_data, indent=2, ensure_ascii=False)

        # Atomic write pattern: write to temp file in same directory, then rename
        temp_dir = dest_path.parent
        with tempfile.NamedTemporaryFile("w", dir=temp_dir, delete=False, encoding="utf-8") as tf:
            tf.write(content)
            temp_name = tf.name

        # Atomically replace destination file
        shutil.move(temp_name, dest_path)

        self.current_project_path = dest_path
        self.is_dirty = False

        # Record in recent projects
        try:
            self.db.add_recent_project(
                path=str(dest_path),
                name=project_data.get("name", dest_path.stem),
                engine_id=project_data.get("engine_id", "unknown"),
            )
        except Exception as e:
            logger.warning(f"Could not record recent project: {e}")

        logger.info(f"Project saved atomically to {dest_path}")

    def load_project(self, filepath: Path | str) -> dict[str, Any]:
        """
        Load, parse, and validate a .vanta project file.
        Strict schema validation rejects corrupted or malicious files.
        """
        path = Path(filepath).resolve()
        if not path.exists():
            raise FileNotFoundError(f"Project file not found: {path}")

        # Limit max project file size to 10 MB to prevent memory exhaustion
        file_size = path.stat().st_size
        if file_size > 10 * 1024 * 1024:
            raise ValueError(f"Project file size exceeds 10 MB limit ({file_size} bytes)")

        raw_text = path.read_text(encoding="utf-8")
        data = json.loads(raw_text)

        # Validation
        if not isinstance(data, dict):
            raise ValueError("Malformed project file: root must be a JSON object")

        if data.get("vanta_format") != "VANTA_PROJECT":
            raise ValueError("Invalid file format: missing 'VANTA_PROJECT' identifier")

        if "engine_id" not in data or "parameters" not in data:
            raise ValueError("Missing critical project keys: 'engine_id' and 'parameters' are required")

        self.current_project_path = path
        self.is_dirty = False

        # Bump in database recent projects
        try:
            self.db.add_recent_project(
                path=str(path),
                name=data.get("name", path.stem),
                engine_id=data.get("engine_id", "unknown"),
            )
        except Exception as e:
            logger.warning(f"Could not update recent project: {e}")

        logger.info(f"Loaded valid project from {path}")
        return data
