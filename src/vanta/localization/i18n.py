"""
Internationalization (i18n) manager and RTL layout coordinator for VANTA.
"""

from __future__ import annotations

from typing import Callable
from vanta.localization.en import TRANSLATIONS_EN
from vanta.localization.fa import TRANSLATIONS_FA

_CURRENT_LOCALE = "fa"  # Persian default, switchable to English
_LISTENERS: list[Callable[[], None]] = []


def set_locale(locale: str) -> None:
    """Set the application active locale ('fa' or 'en') and notify listeners."""
    global _CURRENT_LOCALE
    clean = locale.lower()
    if clean in ("fa", "farsi", "persian"):
        _CURRENT_LOCALE = "fa"
    else:
        _CURRENT_LOCALE = "en"

    # Notify subscribed UI listeners
    for callback in list(_LISTENERS):
        try:
            callback()
        except Exception:
            pass


def get_locale() -> str:
    """Return active locale code ('fa' or 'en')."""
    return _CURRENT_LOCALE


def is_rtl() -> bool:
    """Return True if active locale is Right-to-Left (Persian)."""
    return _CURRENT_LOCALE == "fa"


def tr(key: str, default: str | None = None) -> str:
    """
    Translate key to active locale string.
    Falls back to English catalog, then default, then key itself.
    """
    catalog = TRANSLATIONS_FA if _CURRENT_LOCALE == "fa" else TRANSLATIONS_EN
    if key in catalog:
        return catalog[key]

    # Fallback to English
    if key in TRANSLATIONS_EN:
        return TRANSLATIONS_EN[key]

    return default if default is not None else key


def register_locale_change_listener(callback: Callable[[], None]) -> None:
    """Subscribe a widget or window to re-translate when language changes."""
    if callback not in _LISTENERS:
        _LISTENERS.append(callback)


def unregister_locale_change_listener(callback: Callable[[], None]) -> None:
    """Unsubscribe a widget or window."""
    if callback in _LISTENERS:
        _LISTENERS.remove(callback)
