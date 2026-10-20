# Security Policy

## Supported Versions
Only the latest release of VANTA receives active security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

VANTA is an offline-first desktop application designed with strict security considerations:
- No remote telemetry or analytics.
- No network connections required at runtime.
- No unsafe `pickle` or arbitrary code deserialization in `.vanta` project files.
- Local data stored safely in standard user profile directories.

If you discover a security vulnerability or file parsing exploit, please report it privately to the maintainer:
- **Telegram:** [@P0O1N0](https://t.me/P0O1N0)
- **GitHub Security Advisory:** Submit through the repository's Security tab.

Please do not disclose security vulnerabilities publicly until a patch has been released.
