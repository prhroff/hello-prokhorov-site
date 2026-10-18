"""The site's own link previews, rendered from HTML layouts (1200 × 630):

    python scripts/build-og-card.py      _og/site.html -> assets/img/og.jpg
                                         _og/site-ru.html -> assets/img/og-ru.jpg (the Russian pages)

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
CARDS = {"_og/site.html": ROOT / "assets/img/og.jpg", "_og/site-ru.html": ROOT / "assets/img/og-ru.jpg"}
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
        for src, out in CARDS.items():
            page.goto(f"http://127.0.0.1:{server.server_port}/{src}", wait_until="networkidle")
            page.evaluate("document.fonts.ready")
            page.screenshot(path=str(out), type="jpeg", quality=90)
            print(f"wrote {out.relative_to(ROOT).as_posix()}")
        browser.close()
finally:
    server.shutdown()
