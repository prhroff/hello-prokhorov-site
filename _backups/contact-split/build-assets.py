"""Build optimized image assets for the site.

Reads source artwork from the parent hello-prokhorov-website folder and writes
AVIF + WebP variants at several widths into assets/img/. Re-run after changing
the SOURCES table. Requires Pillow >= 11.3 (native AVIF support).

    python scripts/build-assets.py
"""
import json
from pathlib import Path
from PIL import Image

Image.MAX_IMAGE_PIXELS = None

HERE = Path(__file__).resolve().parent.parent
SRC = HERE.parent  # hello-prokhorov-website/
OUT = HERE / "assets" / "img"

# name: (source path, widths, crop box as fractions (l, t, r, b) or None)
SOURCES = {
    # Powermatic®
    "powermatic-stand": ("cases/site/Case Study/Website/Powermatic_Stand.png", [800, 1600, 2400], None),   # cover and card
    "powermatic-tablet": ("cases/site/Case Study/Website/scene_2026-07-20.webp", [800, 1600, 2400], None),
    "powermatic-keys": ("cases/site/Case Study/Website/Powermatic_Cover.webp", [700, 1400], None),
    "powermatic-phone": ("cases/site/Case Study/Website/Powermatic_Phone_Screen.webp", [700, 1400], None),
    # Visual Hunters®
    "vh-laptop": ("cases/visualhunters/VH_Laptop_Blinds.png", [800, 1600, 2400], None),   # cover and card
    "vh-poster": ("cases/visualhunters/Screen_03.png", [700, 1400], None),
    "vh-display": ("cases/visualhunters/Div.png", [700, 1080], None),
    "vh-shelf": ("Contra Covers/Cover_05.png", [700, 1300], (0.535, 0.0, 1.0, 1.0)),
    # Contour Office®
    "contour-laptop": ("cases/site/contour.png", [700, 1080], None),
    "contour-cover": ("Contra Covers/Cover_03.png", [700, 1300], (0.535, 0.0, 1.0, 1.0)),
    # Renovate
    "renovate-laptop": ("cases/renovate/Renovate_Laptop.png", [800, 1600, 2400], None),
    # Monolith ONE (no longer a case: the archive only)
    "monolith-render": ("cases/monolith/2a480fe4-4c3e-4af7-a178-e41ef7078cfd.png", [1024], None),
    "monolith-tower": ("cases/monolith/product-philosophy.png", [800, 1440], None),
    "monolith-detail": ("cases/monolith/monolith.png", [700, 1080], None),
    # Lattice
    "lattice-hero": ("hero/hero-section.png", [800, 1600, 1920], None),
    "lattice-plinth": ("cases/site/Image_Lattice_Crop.png", [700, 1350], None),
    # Index-only previews
    "luma-laptop": ("cases/site/Luma_Laptop_Hands.png", [800, 1600, 2400], None),   # Luma cover and card
    "luma-screen": ("cases/site/Luma_Screen.png", [700, 1440], None),
    "prokhorov-site": ("Contra Covers/Cover_01.png", [700, 1300], (0.535, 0.0, 1.0, 1.0)),
    # People / services
    "portrait": ("Portrait.jpg", [500, 1000], None),
    "review-levon": ("Reviews/Levon_Terteryan.png", [160, 240], None),   # reviewer photo, Levon T.
    "review-bethany": ("Reviews/Bethany_R.png", [160, 240], (0.3, 0.025, 0.8, 0.525)),   # reviewer photo, Bethany R.: the face
    "review-natalia": ("Reviews/Natalia_M.jpg", [160, 240], None),   # reviewer photo, Natalia M.: the whole portrait
    "service-landing": ("Contra Covers/Cover_02.png", [700, 1300], (0.535, 0.0, 1.0, 1.0)),
    "service-framer": ("Contra Covers/Cover_04.png", [700, 1300], (0.535, 0.0, 1.0, 1.0)),
    # Case-study galleries (v7.9)
    "pm-hero": ("cases/site/Case Study/HeroSection_Alt.png", [800, 1600], None),
    "pm-hero-red": ("cases/site/Case Study/HeroSection_Alt_02.png", [800, 1600], None),
    "pm-macbook": ("cases/site/Case Study/MacBook Mockup.png", [800, 1600], None),
    "pm-about": ("cases/site/Case Study/About.png", [800, 1600], None),
    "pm-engagement": ("cases/site/Case Study/Animation_Ipad/Scen_03.png", [800, 1600], None),
    "pm-blog": ("cases/site/Case Study/Blog.png", [800, 1600], None),
    "pm-cases": ("cases/site/Case Study/Scene_02.png", [800, 1600], None),
    "pm-hardware": ("cases/site/Case Study/Screen_01.png", [800, 1600], None),
    "pm-loader": ("cases/site/Case Study/Loader.png", [800, 1600], None),
    "pm-laptop-chair": ("cases/site/Case Study/Website/Acc.webp", [800, 1600], None),
    "pm-ipad-stand": ("cases/site/Case Study/06.png", [800, 1600], None),
    "pm-phone-pricing": ("cases/site/Case Study/iPhone 14 Pro.png", [800, 1600], None),
    "pm-tshirt": ("cases/site/Case Study/Website/logo_mockup_perspective_t_shirt.webp", [800, 1600], None),
    "pm-contact": ("cases/site/Case Study/Contact page.png", [800, 1600], None),
    "vh-site": ("cases/visualhunters/Div_Crop.png", [800, 1600], None),
    "vh-alt": ("cases/visualhunters/alt.png", [800, 1600], None),
    "vh-office": ("cases/visualhunters/Macbook Pro in Office Room 02 3.png", [800, 1600], None),
    "vh-monitor": ("cases/visualhunters/Screen_01.png", [800, 1600], None),
    "vh-logo": ("cases/site/Frame 2147229585.png", [800, 1600], None),
    "vh-teaser": ("cases/visualhunters/Instagram/Screen_03.png", [800, 1600], None),
    "co-hero": ("cases/site/Div.png", [800, 1600], None),
    "co-manifesto": ("cases/site/image 8.png", [800, 1600], None),
    "mo-hero": ("cases/monolith/hero-section.png", [800, 1600], None),
    "mo-knob": ("cases/monolith/Gemini_Generated_Image_67zzii67zzii67zz.png", [800, 1600], None),
    "mo-tower-light": ("cases/monolith/ChatGPT Image May 20, 2026, 11_22_47 AM.png", [800, 1600], None),
    "mo-tower-dark": ("cases/monolith/Gemini_Generated_Image_9s5bv39s5bv39s5b.png", [800, 1600], None),
    "mo-front": ("cases/monolith/Gemini_Generated_Image_nbge7inbge7inbge.png", [800, 1600], None),
    "mo-stone": ("cases/monolith/Gemini_Generated_Image_qbemedqbemedqbem.png", [800, 1600], None),
    "mo-close": ("cases/monolith/Gemini_Generated_Image_53f9nq53f9nq53f9.png", [800, 1600], None),
    "mo-poster": ("cases/monolith/Div.png", [800, 1600], None),
    "la-image": ("cases/site/Image_Lattice.png", [800, 1600], None),
    "la-pedestal": ("cases/site/Free MacBook Pro mockup on stone pedestal (Mockuuups Studio).png", [800, 1600], None),
    "la-rack": ("cases/site/V-Mockups_Apple_Devices_002.png", [800, 1600], None),
    "la-ipad": ("cases/site/iPad.png", [800, 1600], None),
    "la-phone": ("cases/site/iPhone 16 Pro & Pro Max.png", [800, 1600], None),
    "la-safari": ("cases/site/Safari Dark Vertical.png", [800, 1600], None),
    "lu-page": ("cases/site/Frame 2147229530.png", [800, 1600], None),
    "lu-display": ("cases/site/Luma.png", [800, 1600], None),
    "lu-stories": ("cases/site/Luma Stories.png", [800, 1600], None),
    # Social share image
    "og": ("cases/site/Case Study/Website/scene_2026-07-20.webp", [1200], None),
}



def main():
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = {}
    for name, (rel, widths, crop) in SOURCES.items():
        im = Image.open(SRC / rel).convert("RGB")
        if crop:
            w, h = im.size
            im = im.crop((round(crop[0] * w), round(crop[1] * h), round(crop[2] * w), round(crop[3] * h)))
        if name == "og":
            # 1200x630 centre crop for link previews
            w, h = im.size
            th = round(w * 630 / 1200)
            top = (h - th) // 2
            im = im.crop((0, top, w, top + th))
        ratio = im.height / im.width
        manifest[name] = {"w": im.width, "h": im.height, "ratio": round(ratio, 4), "widths": []}
        for target in widths:
            tw = min(target, im.width)
            th = round(tw * ratio)
            variant = im.resize((tw, th), Image.LANCZOS) if tw != im.width else im
            variant.save(OUT / f"{name}-{tw}.avif", quality=52, speed=6)
            variant.save(OUT / f"{name}-{tw}.webp", quality=78, method=6)
            if name == "og":
                variant.save(OUT / f"{name}.jpg", quality=82, optimize=True, progressive=True)
            manifest[name]["widths"].append(tw)
        print(f"{name:20s} {im.width}x{im.height} -> {manifest[name]['widths']}")
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=2))


if __name__ == "__main__":
    main()
