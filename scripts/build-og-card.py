"""The site's own link preview (assets/img/og.jpg), rendered from an HTML layout.

    python scripts/build-og-card.py      _og/site.html -> assets/img/og.jpg (1200 × 630)

Every page without its own og_image: (home, Work, Services, Info, Contact, Get in Touch, Blog,
Privacy, 404, in both languages) shows this picture. The layout in _og/site.html uses the site's
font and pictures by their site paths (/assets/…), so it is served from the project root for the
render. Needs Playwright and Microsoft Edge (or set CHROME_PATH). After a render, run
scripts/build-html.py: the pages' og:image address carries the file's hash.
"""
import functools
import http.server
import os
import threading
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets/img/og.jpg"
BROWSER = os.environ.get("CHROME_PATH", r"C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe")


class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Quiet, directory=str(ROOT)))
threading.Thread(target=server.serve_forever, daemon=True).start()
try:
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=BROWSER)
        page = browser.new_page(viewport={"width": 1200, "height": 630})
        page.goto(f"http://127.0.0.1:{server.server_port}/_og/site.html", wait_until="networkidle")
        page.evaluate("document.fonts.ready")
        page.screenshot(path=str(OUT), type="jpeg", quality=90)
        browser.close()
finally:
    server.shutdown()
print(f"wrote {OUT.relative_to(ROOT).as_posix()}")
