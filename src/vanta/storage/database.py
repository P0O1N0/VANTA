"""
SQLite database management for VANTA local settings and metadata.
"""

from __future__ import annotations

import json
import sqlite3
from contextlib import contextmanager
from pathlib import Path
from typing import Any, Generator

from vanta.config.settings import get_database_path
from vanta.storage.migrations import apply_migrations
from vanta.utilities.logger import get_logger

logger = get_logger("storage.database")


class Database:
    """Thread-safe SQLite database wrapper with WAL mode and parameterized queries."""

    def __init__(self, db_path: Path | str | None = None):
        if db_path is None:
            self.db_path = get_database_path()
        else:
            self.db_path = Path(db_path)

        self._init_db()

    @contextmanager
    def _get_connection(self) -> Generator[sqlite3.Connection, None, None]:
        """Create a new SQLite connection with WAL journal mode, auto-closing on exit."""
        conn = sqlite3.connect(str(self.db_path), timeout=10.0)
        conn.row_factory = sqlite3.Row
        try:
            conn.execute("PRAGMA journal_mode = WAL")
            conn.execute("PRAGMA synchronous = NORMAL")
            yield conn
        finally:
            conn.close()

    def _init_db(self) -> None:
        """Initialize database file and run schema migrations."""
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        with self._get_connection() as conn:
            apply_migrations(conn)

    # Settings operations
    def get_setting(self, key: str, default: Any = None) -> Any:
        """Retrieve a stored setting value (deserialized from JSON)."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT value FROM settings WHERE key = ?", (key,))
            row = cursor.fetchone()
            if row:
                try:
                    return json.loads(row["value"])
                except Exception:
                    return row["value"]
            return default

    def set_setting(self, key: str, value: Any) -> None:
        """Upsert a setting value as JSON."""
        val_str = json.dumps(value)
        with self._get_connection() as conn:
            conn.execute(
                "INSERT INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) "
                "ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP",
                (key, val_str),
            )
            conn.commit()

    # Recent projects
    def add_recent_project(self, path: str, name: str, engine_id: str, preset_name: str = "") -> None:
        """Add or bump a recent project entry."""
        with self._get_connection() as conn:
            conn.execute(
                "INSERT INTO recent_projects (path, name, engine_id, preset_name, last_opened) "
                "VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP) "
                "ON CONFLICT(path) DO UPDATE SET last_opened = CURRENT_TIMESTAMP, name = excluded.name, "
                "engine_id = excluded.engine_id, preset_name = excluded.preset_name",
                (path, name, engine_id, preset_name),
            )
            conn.commit()

    def get_recent_projects(self, limit: int = 10) -> list[dict[str, Any]]:
        """Return recently opened projects ordered by last_opened descending."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT id, path, name, engine_id, preset_name, last_opened FROM recent_projects "
                "ORDER BY last_opened DESC LIMIT ?",
                (limit,),
            )
            return [dict(row) for row in cursor.fetchall()]

    # Custom presets
    def save_custom_preset(
        self,
        name: str,
        engine_id: str,
        params: dict[str, Any],
        palette_name: str = "neon_cyber",
        description: str = "",
        category: str = "Custom",
    ) -> None:
        """Save or overwrite a user-defined preset."""
        params_json = json.dumps(params)
        with self._get_connection() as conn:
            conn.execute(
                "INSERT INTO custom_presets (name, engine_id, category, description, params_json, palette_name, updated_at) "
                "VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP) "
                "ON CONFLICT(name, engine_id) DO UPDATE SET "
                "params_json = excluded.params_json, palette_name = excluded.palette_name, "
                "description = excluded.description, category = excluded.category, updated_at = CURRENT_TIMESTAMP",
                (name, engine_id, category, description, params_json, palette_name),
            )
            conn.commit()

    def get_custom_presets(self, engine_id: str | None = None) -> list[dict[str, Any]]:
        """Get custom user presets, optionally filtered by engine."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            if engine_id:
                cursor.execute(
                    "SELECT id, name, engine_id, category, description, params_json, palette_name, is_favorite, created_at "
                    "FROM custom_presets WHERE engine_id = ? ORDER BY name ASC",
                    (engine_id,),
                )
            else:
                cursor.execute(
                    "SELECT id, name, engine_id, category, description, params_json, palette_name, is_favorite, created_at "
                    "FROM custom_presets ORDER BY name ASC"
                )
            results = []
            for row in cursor.fetchall():
                d = dict(row)
                d["params"] = json.loads(d["params_json"])
                results.append(d)
            return results

    def delete_custom_preset(self, preset_id: int) -> bool:
        """Delete a custom preset by ID."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM custom_presets WHERE id = ?", (preset_id,))
            conn.commit()
            return cursor.rowcount > 0

    # Export history
    def record_export(self, filename: str, filepath: str, export_type: str, engine_id: str, width: int, height: int) -> None:
        """Log an image or video export event."""
        with self._get_connection() as conn:
            conn.execute(
                "INSERT INTO export_history (filename, filepath, export_type, engine_id, width, height) "
                "VALUES (?, ?, ?, ?, ?, ?)",
                (filename, filepath, export_type, engine_id, width, height),
            )
            conn.commit()
