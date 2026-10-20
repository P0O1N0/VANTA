"""
VANTA logging utility with rotating file handlers and formatted console output.
"""

from __future__ import annotations

import logging
import sys
from logging.handlers import RotatingFileHandler
from pathlib import Path
from vanta.config.settings import get_logs_dir

_LOGGER: logging.Logger | None = None


def setup_logger(log_level: int = logging.INFO) -> logging.Logger:
    """Initialize and configure the root VANTA application logger."""
    global _LOGGER
    if _LOGGER is not None:
        return _LOGGER

    logger = logging.getLogger("vanta")
    logger.setLevel(log_level)
    logger.propagate = False

    # Prevent duplicate handlers
    if logger.handlers:
        return logger

    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(log_level)
    console_formatter = logging.Formatter(
        "[%(asctime)s] [%(levelname)s] [%(name)s.%(module)s]: %(message)s",
        datefmt="%H:%M:%S",
    )
    console_handler.setFormatter(console_formatter)
    logger.addHandler(console_handler)

    # Rotating file handler
    try:
        logs_dir = get_logs_dir()
        log_file = logs_dir / "vanta.log"
        # 5 MB max per file, 3 backups
        file_handler = RotatingFileHandler(
            log_file,
            maxBytes=5 * 1024 * 1024,
            backupCount=3,
            encoding="utf-8",
        )
        file_handler.setLevel(logging.DEBUG)
        file_formatter = logging.Formatter(
            "%(asctime)s [%(levelname)s] %(process)d [%(threadName)s] %(name)s.%(module)s:%(lineno)d: %(message)s"
        )
        file_handler.setFormatter(file_formatter)
        logger.addHandler(file_handler)
    except Exception as e:
        console_handler.handle(
            logging.LogRecord(
                "vanta",
                logging.WARNING,
                __file__,
                45,
                f"Failed to initialize file logger: {e}",
                (),
                None,
            )
        )

    _LOGGER = logger
    return logger


def get_logger(module_name: str | None = None) -> logging.Logger:
    """Return a logger instance under the vanta namespace."""
    if _LOGGER is None:
        setup_logger()
    if module_name:
        return logging.getLogger(f"vanta.{module_name}")
    return logging.getLogger("vanta")
