"""Social pictures for the case pages, from their own cover images.

    python scripts/build-og.py      writes assets/img/og/<case>.jpg (then set og_image: in the case's front matter)

Each case with a picture on its /work/ card (front matter card:, card_pos:) gets a 1200 × 630
JPEG cut from the largest size of that picture, around the point the card keeps (or og_pos:). A case
without a picture keeps the site card (assets/img/og.jpg). Needs Pillow, as build-assets.py.
"""
import json
import re
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
MANIFEST = json.loads((ROOT / "assets/img/manifest.json").read_text())
OUT = ROOT / "assets/img/og"
W, H = 1200, 630


def front(path):
    text = path.read_text(encoding="utf-8")
    block = text[4:text.index("\n---\n", 3)] if text.startswith("---\n") else ""
    return dict(line.split(":", 1) for line in block.splitlines() if ":" in line and not line.startswith("#"))


def focus(pos):
    """'60% 40%' -> (0.6, 0.4); centre by default."""
    nums = [float(n) / 100 for n in re.findall(r"([\d.]+)%", pos or "")]
    return (nums + [0.5, 0.5])[:2]


OUT.mkdir(parents=True, exist_ok=True)
for page in sorted((ROOT / "src/pages/work").glob("*.html")):
    if page.name.startswith("_"):
        continue
    meta = {k.strip(): v.strip() for k, v in front(page).items()}
    name = meta.get("card")
    if not name or name not in MANIFEST:
        print(f"  {page.stem:16} no picture — keeps the site card")
        continue
    src = Image.open(ROOT / f"assets/img/{name}-{MANIFEST[name]['widths'][-1]}.webp").convert("RGB")
    fx, fy = focus(meta.get("og_pos") or meta.get("card_pos"))     # og_pos: when the social cut needs its own point
    scale = max(W / src.width, H / src.height)
    img = src.resize((round(src.width * scale), round(src.height * scale)), Image.LANCZOS)
    left = min(max(round(img.width * fx - W / 2), 0), img.width - W)
    top = min(max(round(img.height * fy - H / 2), 0), img.height - H)
    img.crop((left, top, left + W, top + H)).save(OUT / f"{page.stem}.jpg", "JPEG", quality=84, optimize=True, progressive=True)
    print(f"  {page.stem:16} assets/img/og/{page.stem}.jpg  (from {name})")
