"""
VANTA Studio Local Server & Native App-Mode Launcher.
Serves offline WebGL/Canvas assets on 127.0.0.1:8765 and opens standalone Edge/Chrome window.
"""

from __future__ import annotations

import http.server
import os
import shutil
import socketserver
import subprocess
import sys
import threading
import time
from pathlib import Path

PORT = 8765
STUDIO_DIR = Path(__file__).resolve().parent.parent / "studio"


class VantaHttpHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(STUDIO_DIR), **kwargs)

    def end_headers(self):
        # Enable local caching & CORS for offline assets
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def log_message(self, format, *args):
        # Suppress noisy HTTP request logging
        pass


def launch_native_browser(url: str) -> None:
    """Launch Microsoft Edge or Google Chrome in standalone native app-window mode."""
    edge_paths = [
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    ]
    chrome_paths = [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    ]

    for p in edge_paths + chrome_paths:
        if os.path.exists(p):
            try:
                cmd = [
                    p,
                    f"--app={url}",
                    "--window-size=1440,920",
                    "--disable-features=Translate",
                    "--app-auto-launched",
                ]
                subprocess.Popen(cmd)
                return
            except Exception:
                pass

    # Fallback to default system browser
    import webbrowser
    webbrowser.open(url)


def main():
    os.chdir(STUDIO_DIR)
    url = f"http://127.0.0.1:{PORT}/"

    # Start server in daemon thread or main process
    handler = VantaHttpHandler
    socketserver.TCPServer.allow_reuse_address = True

    try:
        with socketserver.TCPServer(("127.0.0.1", PORT), handler) as httpd:
            print(f"[VANTA Studio] Serving offline studio at {url}")
            # Launch browser after a brief delay
            threading.Thread(target=lambda: (time.sleep(0.3), launch_native_browser(url)), daemon=True).start()
            httpd.serve_forever()
    except OSError as e:
        # Port already in use, simply launch browser directly
        launch_native_browser(url)


if __name__ == "__main__":
    main()
