"""
Database schema migrations for VANTA SQLite persistence.
"""

from __future__ import annotations

import sqlite3
from vanta.utilities.logger import get_logger

logger = get_logger("storage.migrations")

CURRENT_SCHEMA_VERSION = 1

MIGRATION_V1 = """
-- Schema version tracking
CREATE TABLE IF NOT EXISTS schema_migrations (
    version INTEGER PRIMARY KEY,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Application settings
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recent projects
CREATE TABLE IF NOT EXISTS recent_projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    engine_id TEXT NOT NULL,
    preset_name TEXT,
    thumbnail_path TEXT,
    last_opened TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Custom user presets
CREATE TABLE IF NOT EXISTS custom_presets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    engine_id TEXT NOT NULL,
    category TEXT DEFAULT 'Custom',
    description TEXT,
    params_json TEXT NOT NULL,
    palette_name TEXT DEFAULT 'neon_cyber',
    is_favorite INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, engine_id)
);

-- Export history
CREATE TABLE IF NOT EXISTS export_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    filepath TEXT NOT NULL,
    export_type TEXT NOT NULL,
    engine_id TEXT NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"""


def apply_migrations(conn: sqlite3.Connection) -> None:
    """Run pending database schema migrations inside a transaction."""
    cursor = conn.cursor()

    # Create migration table if missing
    cursor.execute(
        "CREATE TABLE IF NOT EXISTS schema_migrations (version INTEGER PRIMARY KEY, applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
    )
    cursor.execute("SELECT MAX(version) FROM schema_migrations")
    row = cursor.fetchone()
    current_ver = row[0] if (row and row[0] is not None) else 0

    if current_ver < 1:
        logger.info("Applying SQLite migration v1...")
        cursor.executescript(MIGRATION_V1)
        cursor.execute("INSERT INTO schema_migrations (version) VALUES (1)")
        conn.commit()
        logger.info("Migration v1 applied successfully.")
