"""VANTA localization package."""
from vanta.localization.i18n import (
    tr,
    set_locale,
    get_locale,
    is_rtl,
    register_locale_change_listener,
    unregister_locale_change_listener,
)

__all__ = [
    "tr",
    "set_locale",
    "get_locale",
    "is_rtl",
    "register_locale_change_listener",
    "unregister_locale_change_listener",
]
