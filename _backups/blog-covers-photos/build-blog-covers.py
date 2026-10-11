"""Build the blog post covers: a stock photo, full bleed, with the post's heading on a card.

For every post in src/blog/ that has a photo at ../blog-covers/photos/<slug>.jpg:

  * assets/img/blog-<slug>-{800,1600,2400}.{avif,webp}  the cover, 3 : 2 (card, featured
    card and post hero crop it to 5 : 3, 16 : 9 and 3 : 2; the cards stay clear of every crop)
  * assets/img/og/blog-<slug>.jpg                       the link preview, 1200 x 630
  * an entry in assets/img/manifest.json, and image / og_image in the post's front matter

The cover: the photo, a little muted; a card tilted behind and a card in front carrying only the
heading, a dotted rule and the Prokhorov® mark; a fine grain over all of it. The colours are the post's
topic (TOPICS in site_config.py), the same ones its tag and the /blog/ filter use. Re-run after
changing a heading or a topic.

    python scripts/build-blog-covers.py              all posts with a photo
    python scripts/build-blog-covers.py my-post      one post

Photos: CC0 stock (credits in ../blog-covers/photos/CREDITS.md). Optional focus point per
post in FOCUS below (fractions of the photo; the crop keeps that point as central as it can).
"""
import json
import math
import random
import re
import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFont

HERE = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(HERE / "scripts"))
import site_config as C  # noqa: E402

BLOG = HERE / "src" / "blog"
PHOTOS = HERE.parent / "blog-covers" / "photos"
OUT = HERE / "assets" / "img"
FONT = HERE / "assets" / "fonts" / "inter-opsz.woff2"
DEFS = HERE / "src" / "partials" / "defs.html"      # the Prokhorov® mark, as the site draws it

TOPIC = {t["slug"]: t for t in C.TOPICS}
FALLBACK = dict(card="#e6e6e6", back="#9a9a9a", ink="#121212")   # a post without a known topic
WIDTHS = [800, 1600, 2400]

FOCUS = {                    # slug: (x, y) focus point in the photo
    "what-a-ux-audit-actually-finds": (0.5, 0.45),
}


def mark_points():
    """The Prokhorov® mark (#pk-mark in defs.html: straight segments only) as polygon points in
    its own units, and the box they span."""
    d = re.search(r'id="pk-mark" d="([^"]+)"', DEFS.read_text(encoding="utf-8")).group(1)
    nums = [float(n) for n in re.findall(r"-?\d*\.?\d+", d)]
    pts = list(zip(nums[0::2], nums[1::2]))
    xs, ys = [x for x, _ in pts], [y for _, y in pts]
    return pts, (min(xs), min(ys), max(xs), max(ys))


MARK = mark_points()


def draw_mark(im, cx, cy, size, fill):
    """The mark, `size` px wide, centred on (cx, cy), with smooth edges (drawn 4x)."""
    pts, (x0, y0, x1, y1) = MARK
    k = size / (x1 - x0)
    w, h = math.ceil((x1 - x0) * k) + 2, math.ceil((y1 - y0) * k) + 2
    mask = Image.new("L", (w * 4, h * 4), 0)
    ImageDraw.Draw(mask).polygon([((x - x0) * k * 4 + 4, (y - y0) * k * 4 + 4) for x, y in pts], fill=255)
    mask = mask.resize((w, h), Image.LANCZOS)
    im.paste(Image.new("RGBA", (w, h), fill + (255,)), (round(cx - w / 2), round(cy - h / 2)), mask)


def rgb(hex_):
    return tuple(int(hex_[i:i + 2], 16) for i in (1, 3, 5))


def front(text):
    meta, end = {}, text.index("\n---\n", 3)
    for line in text[4:end].splitlines():
        if line.strip() and not line.lstrip().startswith("#"):
            k, _, v = line.partition(":")
            meta[k.strip()] = v.strip()
    return meta, text[end + 5:]


def font(size, weight):
    f = ImageFont.truetype(str(FONT), round(size))
    f.set_variation_by_axes([min(32, max(14, size / 2.4)), weight])   # optical size follows the size
    return f


def width(text, f, track):
    return f.getlength(text) + track * max(0, len(text) - 1)


def draw_text(d, x, y, text, f, track, fill):
    """Text with letter spacing: each glyph at the prefix width, so kerning is kept."""
    for i, ch in enumerate(text):
        d.text((x + f.getlength(text[:i]) + track * i, y), ch, font=f, fill=fill)


def wrap(text, f, track, max_w):
    lines, line = [], ""
    for word in text.split():
        trial = f"{line} {word}".strip()
        if line and width(trial, f, track) > max_w:
            lines.append(line)
            line = word
        else:
            line = trial
    return lines + [line]


def rounded(size, radius, fill):
    """A rounded rectangle with smooth edges (drawn 4x and scaled down)."""
    w, h = size
    mask = Image.new("L", (w * 4, h * 4), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, w * 4 - 1, h * 4 - 1), radius=radius * 4, fill=255)
    im = Image.new("RGBA", size, fill + (255,))
    im.putalpha(mask.resize(size, Image.LANCZOS))
    return im


def card(heading, colours, s):
    """The front card at scale s (1 = 1280 x 1040, for the 2400 x 1600 cover): the heading,
    a dotted rule and the Prokhorov® mark in a circle, nothing else."""
    W, H = round(1280 * s), round(1040 * s)
    ink = rgb(colours["ink"])
    im = rounded((W, H), round(52 * s), rgb(colours["card"]))
    d = ImageDraw.Draw(im)
    pad = round(100 * s)

    # the heading: as large as fits in four lines above the rule
    max_w, room = W - 2 * pad, H - 2 * pad - 260 * s
    for size in range(168, 90, -4):
        f = font(size * s, 440)
        track = -0.03 * size * s
        lines = wrap(heading, f, track, max_w)
        if len(lines) <= 4 and len(lines) * size * s <= room:
            break
    y = pad + round(20 * s)
    for line in lines:
        draw_text(d, pad, y, line, f, track, ink)
        y += size * s

    # the dotted rule and the Prokhorov® mark in a circle, as on a printed card
    ry = H - round(250 * s)
    dot, step = max(1.0, 3.2 * s), 9.5 * s
    x = pad
    while x < W - pad:
        d.ellipse((x, ry - dot / 2, x + dot, ry + dot / 2), fill=ink)
        x += step
    r, cx, cy = 42 * s, pad + 42 * s, H - pad - 42 * s
    d.ellipse((cx - r, cy - r, cx + r, cy + r), outline=ink, width=max(1, round(3.4 * s)))
    draw_mark(im, cx, cy, 36 * s, ink)
    return im


def back_card(colours, s):
    W, H = round(1280 * s), round(1040 * s)
    return rounded((W, H), round(52 * s), rgb(colours["back"])).rotate(-5.5, resample=Image.BICUBIC, expand=True)


def grain(im, amount):
    """Fine monochrome noise, like the paper texture of a printed card."""
    rnd = random.Random(7)
    small = Image.new("L", (im.width // 2, im.height // 2))
    small.putdata([max(0, min(255, round(rnd.gauss(128, amount)))) for _ in range(small.width * small.height)])
    noise = small.resize(im.size, Image.BILINEAR).convert("RGB")
    return ImageChops.overlay(im, noise)


def fit(photo, W, H, focus):
    """Cover-crop the photo to W x H around the focus point."""
    pw, ph = photo.size
    scale = max(W / pw, H / ph)
    rw, rh = math.ceil(pw * scale), math.ceil(ph * scale)
    im = photo.resize((rw, rh), Image.LANCZOS)
    left = min(max(0, round(rw * focus[0] - W / 2)), rw - W)
    top = min(max(0, round(rh * focus[1] - H / 2)), rh - H)
    return im.crop((left, top, left + W, top + H))


def compose(photo, heading, colours, W, H, s, focus):
    bg = fit(photo, W, H, focus)
    bg = ImageEnhance.Color(bg).enhance(0.7)                     # muted, so the soft card leads
    bg = ImageEnhance.Brightness(bg).enhance(0.86)
    im = bg.convert("RGBA")
    front_card, back = card(heading, colours, s), back_card(colours, s)
    cx, cy = W // 2, H // 2
    im.alpha_composite(back, (cx - back.width // 2 + round(46 * s), cy - back.height // 2 + round(26 * s)))
    im.alpha_composite(front_card, (cx - front_card.width // 2 - round(20 * s), cy - front_card.height // 2 - round(10 * s)))
    return grain(im.convert("RGB"), 9 if s >= 1 else 7)


def set_front(path, values):
    text = path.read_text(encoding="utf-8").replace("\r\n", "\n")
    end = text.index("\n---\n", 3)
    head, body = text[:end], text[end:]
    for k, v in values.items():
        if re.search(rf"^{k}:.*$", head, re.M):
            head = re.sub(rf"^{k}:.*$", f"{k}: {v}", head, count=1, flags=re.M)
        else:
            head += f"\n{k}: {v}"
    head = re.sub(r"^image_pos:.*\n?", "", head, flags=re.M)   # the cover is composed for the centre crop
    path.write_text(head + body, encoding="utf-8")


def main():
    only = set(sys.argv[1:])
    manifest_path = OUT / "manifest.json"
    manifest = json.loads(manifest_path.read_text())
    (OUT / "og").mkdir(exist_ok=True)

    for path in sorted(BLOG.glob("*.html")):
        slug = path.stem
        src = PHOTOS / f"{slug}.jpg"
        if path.name.startswith("_") or (only and slug not in only) or not src.exists():
            continue
        meta, _ = front(path.read_text(encoding="utf-8").replace("\r\n", "\n"))
        colours = TOPIC.get(meta.get("topic"), FALLBACK)
        if meta.get("topic") not in TOPIC:
            print(f"  ! {slug}: topic {meta.get('topic')!r} is not in TOPICS; grey cover")
        photo = Image.open(src).convert("RGB")
        focus = FOCUS.get(slug, (0.5, 0.5))
        name = f"blog-{slug}"

        cover = compose(photo, meta["heading"], colours, 2400, 1600, 1.0, focus)
        manifest[name] = {"w": 2400, "h": 1600, "ratio": round(1600 / 2400, 4), "widths": []}
        for w in WIDTHS:
            v = cover if w == 2400 else cover.resize((w, round(w * 1600 / 2400)), Image.LANCZOS)
            v.save(OUT / f"{name}-{w}.avif", quality=58, speed=6)
            v.save(OUT / f"{name}-{w}.webp", quality=80, method=6)
            manifest[name]["widths"].append(w)

        og = compose(photo, meta["heading"], colours, 1200, 630, 0.5, focus)
        og.save(OUT / "og" / f"{name}.jpg", quality=84, optimize=True, progressive=True)

        set_front(path, {"image": name, "og_image": f"/assets/img/og/{name}.jpg"})
        print(f"{slug} ({meta.get('topic')}): {name}-{{{','.join(map(str, WIDTHS))}}}, og/{name}.jpg")

    manifest_path.write_text(json.dumps(manifest, indent=2))


if __name__ == "__main__":
    main()
