"""The Privacy Policy as a PDF, printed from the same source as the /privacy/ page.

    python scripts/build-pdf.py      writes assets/docs/privacy-policy.pdf

Takes the policy's text from src/pages/privacy.html (the .article, without anything marked
data-web-only), sets it in the site's own font on A4 with the page number in the footer, and
prints it with a Chromium browser already on the machine (Edge or Chrome, headless): no
packages to install. Run it again whenever the policy changes, then the release build.
"""
import re
import shutil
import subprocess
import sys
import tempfile
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src/pages/privacy.html"
OUT = ROOT / "assets/docs/privacy-policy.pdf"
FONT = (ROOT / "assets/fonts/inter-opsz.woff2").as_uri()
SITE = "helloprokhorov.com"

BROWSERS = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
]


def browser():
    for path in BROWSERS:
        if Path(path).exists():
            return path
    for name in ("msedge", "google-chrome", "chromium", "chromium-browser", "chrome"):
        if shutil.which(name):
            return shutil.which(name)
    sys.exit("No Edge or Chrome found to print the PDF with.")


def policy():
    text = SRC.read_text(encoding="utf-8")
    meta = dict(line.split(":", 1) for line in text[4:text.index("\n---\n")].splitlines() if ":" in line and not line.startswith("#"))
    body = text[text.index("\n---\n") + 5:]
    body = re.sub(r"\s*<(\w+)[^>]*\bdata-web-only\b[^>]*>.*?</\1>", "", body, flags=re.S)
    return meta, body.strip()


PAGE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>{title} — {site}</title>
<style>
  @font-face {{ font-family: "Inter"; src: url("{font}") format("woff2"); font-weight: 100 900; }}
  @page {{
    size: A4; margin: 22mm 20mm 24mm;
    @bottom-left {{ content: "{site} · {title}"; font: 400 8pt "Inter", sans-serif; color: #757575; }}
    @bottom-right {{ content: "Page " counter(page) " of " counter(pages); font: 400 8pt "Inter", sans-serif; color: #757575; }}
  }}
  html {{ -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
  body {{ margin: 0; color: #121212; font: 400 10pt/1.55 "Inter", sans-serif; letter-spacing: -0.01em; }}
  .masthead {{ display: flex; justify-content: space-between; align-items: baseline; padding-bottom: 10mm; font-size: 9pt; color: #757575; }}
  .masthead b {{ color: #121212; font-weight: 500; }}
  h1 {{ margin: 0 0 3mm; font-size: 30pt; font-weight: 500; line-height: 1; letter-spacing: -0.045em; }}
  .legal__dates {{ margin: 0 0 9mm; padding-bottom: 5mm; border-bottom: 0.5pt solid #d9d9d9; color: #757575; font-size: 9pt; }}
  h2 {{ margin: 8mm 0 2.5mm; font-size: 13pt; font-weight: 500; letter-spacing: -0.03em; break-after: avoid; }}
  h3 {{ margin: 5mm 0 1.5mm; font-size: 10.5pt; font-weight: 500; break-after: avoid; }}
  p, ul {{ margin: 0 0 2.5mm; }}
  ul {{ padding-left: 4.5mm; }}
  li {{ margin-bottom: 1.2mm; }}
  li, p {{ orphans: 3; widows: 3; }}
  strong {{ font-weight: 500; }}
  a {{ color: inherit; text-decoration: underline; text-decoration-thickness: 0.5pt; text-underline-offset: 1.5pt; }}
  .colophon {{ margin-top: 10mm; padding-top: 4mm; border-top: 0.5pt solid #d9d9d9; color: #757575; font-size: 8.5pt; }}
</style>
</head>
<body>
  <div class="masthead"><b>Prokhorov®</b><span>{site}</span></div>
  <h1>{title}</h1>
{body}
  <p class="colophon">The current version of this policy is published at https://{site}/privacy/</p>
</body>
</html>
"""


def main():
    meta, body = policy()
    title = meta["title"].strip()
    html = PAGE.format(title=title, site=SITE, font=FONT, body=body)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        page = Path(tmp) / "privacy-policy.html"
        page.write_text(html, encoding="utf-8")
        subprocess.run([browser(), "--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--no-first-run",
                        f"--user-data-dir={Path(tmp) / 'profile'}", f"--print-to-pdf={OUT}", page.as_uri()],
                       check=True, capture_output=True, timeout=120)
    print(f"  {OUT.relative_to(ROOT).as_posix()}  ({OUT.stat().st_size // 1024} KB, updated {meta.get('updated', '').strip() or date.today()})")


if __name__ == "__main__":
    main()
