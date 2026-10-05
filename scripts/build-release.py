"""The production package: exactly the files the live site serves, in dist/.

    python scripts/build-release.py

1. Copies the project to a temporary folder and runs build-html.py --release there, so the
   release build (which deletes the draft pages it finds) never touches this working copy.
2. Copies only the website into dist/: the pages, sitemap.xml, robots.txt, llms.txt, assets/,
   css/ and js/, plus CNAME (the custom domain) and .nojekyll (GitHub Pages serves the files
   as they are, without Jekyll). Sources, scripts, notes, prototypes and backups stay out.
3. Checks the result: nothing outside the allowlist, and every local link, image, script and
   stylesheet in the pages points at a file that is in dist/.

dist/ is what eventually replaces the contents of the production branch (main). This script
publishes nothing and changes no branch.
"""
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path
from urllib.parse import urlparse, unquote

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"
sys.path.insert(0, str(ROOT / "scripts"))
import site_config as C  # noqa: E402

# what the live site is made of (blog/ is included only when the release build writes it)
FILES = ["index.html", "404.html", "sitemap.xml", "robots.txt", "llms.txt"]
DIRS = ["archive", "blog", "contact", "info", "privacy", "work", "assets", "css", "js"]
# never part of the copy the release is built in
SKIP = {".git", "dist", "_backups", "__pycache__", "node_modules", ".claude"}

REF = re.compile(r'''(?:href|src|content)="(/[^"]*)"|srcset="([^"]+)"|url\(\s*['"]?(/[^'")]+)''')


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    with tempfile.TemporaryDirectory() as tmp:
        work = Path(tmp) / "site"
        shutil.copytree(ROOT, work, ignore=lambda d, names: [n for n in names if n in SKIP])
        run = subprocess.run([sys.executable, "scripts/build-html.py", "--release"], cwd=work, capture_output=True, text=True, encoding="utf-8")
        print(run.stdout.rstrip())
        if run.returncode:
            sys.exit(run.stderr)

        if DIST.exists():
            shutil.rmtree(DIST)
        DIST.mkdir()
        for name in FILES:
            shutil.copy2(work / name, DIST / name)
        for name in DIRS:
            if (work / name).is_dir():
                shutil.copytree(work / name, DIST / name, ignore=shutil.ignore_patterns("__pycache__", "*.py", "*.md"))
    (DIST / "CNAME").write_text(urlparse(C.URL).hostname + "\n", encoding="utf-8")
    (DIST / ".nojekyll").write_text("", encoding="utf-8")
    check()


def check():
    allowed = set(FILES) | set(DIRS) | {"CNAME", ".nojekyll"}
    extra = sorted(p.name for p in DIST.iterdir() if p.name not in allowed)
    problems = [f"not part of the site: {x}" for x in extra]
    problems += [f"development file: {p.relative_to(DIST).as_posix()}" for p in DIST.rglob("*")
                 if p.suffix in (".md", ".py") or p.name.startswith("_")]
    problems += [f"draft page: {p.relative_to(DIST).as_posix()}" for p in DIST.rglob("*.html")
                 if 'class="draft-flag"' in p.read_text(encoding="utf-8")]
    problems += [f"HTML comment left in: {p.relative_to(DIST).as_posix()}" for p in DIST.rglob("*.html")
                 if re.search(r"<!--(?! Generated from)", p.read_text(encoding="utf-8"))]

    host = urlparse(C.URL).hostname
    missing = set()
    for page in list(DIST.rglob("*.html")) + list(DIST.rglob("*.css")) + list(DIST.rglob("*.xml")):
        text = page.read_text(encoding="utf-8")
        refs = [m.group(1) or m.group(3) for m in REF.finditer(text) if m.group(1) or m.group(3)]
        refs += [part.strip().split(" ")[0] for m in REF.finditer(text) if m.group(2) for part in m.group(2).split(",")]
        refs += [urlparse(u).path for u in re.findall(r"https://" + re.escape(host) + r"[^\s\"<]*", text)]
        for ref in refs:
            path = unquote(urlparse(ref).path)
            if not path.startswith("/") or path.startswith("//"):
                continue
            target = DIST / path.lstrip("/")
            if not (target.is_file() or (target / "index.html").is_file()):
                missing.add(f"{path}  (in {page.relative_to(DIST).as_posix()})")
    problems += [f"missing: {m}" for m in sorted(missing)]

    files = [p for p in DIST.rglob("*") if p.is_file()]
    size = sum(p.stat().st_size for p in files) / 1024 / 1024
    print(f"\ndist/: {len(files)} files, {size:.1f} MB — {', '.join(sorted(p.name + ('/' if p.is_dir() else '') for p in DIST.iterdir()))}")
    if not C.FORM_ENDPOINT:
        print("  ! FORM_ENDPOINT requires confirmation: the contact form cannot send yet")
    if problems:
        print("\n".join("  ✗ " + p for p in problems))
        sys.exit(1)
    print("  ✓ only the website, no drafts or comments, every local reference resolves")


if __name__ == "__main__":
    main()
