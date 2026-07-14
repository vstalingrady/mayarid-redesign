"""
Crawl public mayar.id marketing pages + Framer CDN assets for design research.

Usage:
  python scripts/mirror_mayar_public.py

- Discovers links from homepage / footer / nav
- Stays on public marketing hosts (mayar.id, docs.mayar.id llms only)
- Skips auth apps (web.mayar.id, portal, etc.)
- Downloads images/fonts found in HTML
"""

from __future__ import annotations

import hashlib
import html
import json
import re
import time
from collections import deque
from pathlib import Path
from urllib.parse import urljoin, urlparse, unquote, urldefrag

import requests

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "reference" / "mayar-id"
ASSETS = OUT / "assets"
PAGES_DIR = OUT / "pages"

SEED = [
    "https://mayar.id/",
    "https://mayar.id/llms.txt",
    "https://docs.mayar.id/llms.txt",
]

# Explicit high-value routes (also discovered via crawl)
EXTRA_SEEDS = [
    "https://mayar.id/pricing",
    "https://mayar.id/features",
    "https://mayar.id/ai-website-builder",
    "https://mayar.id/demo",
    "https://mayar.id/about",
    "https://mayar.id/jobs",
    "https://mayar.id/faq",
    "https://mayar.id/case-study",
    "https://mayar.id/industry",
    "https://mayar.id/learning",
    "https://mayar.id/creator-economy",
    "https://mayar.id/online-retail",
    "https://mayar.id/event-organizer",
    "https://mayar.id/fundraiser-online",
    "https://mayar.id/software-and-saas",
    "https://mayar.id/writing-and-comic",
    "https://mayar.id/mcp",
    "https://mayar.id/integration",
    "https://mayar.id/headless-commerce",
    "https://mayar.id/video-drm",
    "https://mayar.id/agents",
    "https://mayar.id/resources",
    "https://mayar.id/kebijakan-privasi",
    "https://mayar.id/kebijakan-layanan",
    "https://mayar.id/link-pembayaran",
    "https://mayar.id/produk-digital",
    "https://mayar.id/kelas-online",
    "https://mayar.id/webinar",
    "https://mayar.id/membership",
    "https://mayar.id/saas",
]

ALLOWED_HOSTS = {
    "mayar.id",
    "www.mayar.id",
    "docs.mayar.id",
}

# Do not crawl logged-in product surfaces
BLOCKED_HOST_PREFIXES = (
    "web.mayar.id",
    "portal.mayar.id",
    "app.",
    "dashboard.",
)

BLOCKED_PATH_HINTS = (
    "/sign-in",
    "/sign-up",
    "/login",
    "/logout",
    "/coupon/",
)

SESSION = requests.Session()
SESSION.headers.update(
    {
        "User-Agent": "MayarDesignResearch/1.0 (local portfolio reference)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    }
)

HREF_RE = re.compile(r"""href=["']([^"']+)["']""", re.I)
ASSET_HOST_RE = re.compile(
    r"""(?P<u>https?://(?:framerusercontent\.com|framer\.com|mayar\.id|www\.mayar\.id)[^\"'\s)]+)""",
    re.I,
)
ATTR_RE = re.compile(r"""(?:src|href|srcset|content)=["']([^"']+)["']""", re.I)
MEDIA_RE = re.compile(
    r"\.(png|jpe?g|webp|svg|gif|mp4|webm|woff2?|ttf|css|js|mjs)(\?|$)", re.I
)

MAX_PAGES = 80
MAX_IMAGES = 200
MAX_FONTS = 40
MAX_OTHER = 30
DELAY_S = 0.15


def clean_url(u: str) -> str:
    u = html.unescape(u).strip().strip("\"'")
    u = u.replace("&amp;", "&")
    u = u.split(" ")[0]
    u, _ = urldefrag(u)
    return u


def normalize_page_url(base: str, href: str) -> str | None:
    href = clean_url(href)
    if not href or href.startswith(("mailto:", "tel:", "javascript:", "data:")):
        return None
    if href.startswith("//"):
        href = "https:" + href
    full = urljoin(base, href)
    p = urlparse(full)
    if p.scheme not in ("http", "https"):
        return None
    host = p.netloc.lower()
    if host.startswith("www."):
        host = host[4:]
        full = f"{p.scheme}://{host}{p.path}" + (f"?{p.query}" if p.query else "")
        p = urlparse(full)

    if any(host == b or host.endswith("." + b) for b in BLOCKED_HOST_PREFIXES):
        return None
    if host not in ALLOWED_HOSTS and not host.endswith(".mayar.id"):
        # only mayar.id + docs.mayar.id for pages
        if host != "docs.mayar.id":
            return None
    if host not in ALLOWED_HOSTS:
        return None

    path = p.path or "/"
    lower = path.lower()
    if any(h in lower for h in BLOCKED_PATH_HINTS):
        return None

    # docs: only llms.txt (API docs are huge / separate)
    if host == "docs.mayar.id" and not lower.endswith("llms.txt"):
        return None

    # strip trailing slash consistency except root
    if path != "/" and path.endswith("/"):
        path = path.rstrip("/")
    return f"{p.scheme}://{host}{path}" + (f"?{p.query}" if p.query else "")


def safe_name(url: str, prefer_ext: str | None = None) -> str:
    p = urlparse(url)
    path = p.path.strip("/") or "index"
    name = re.sub(r"[^a-zA-Z0-9._-]+", "_", f"{p.netloc}_{path}")
    if p.query:
        name += "_" + hashlib.md5(p.query.encode()).hexdigest()[:8]
    if prefer_ext and not name.endswith(prefer_ext):
        name += prefer_ext
    return name[:180]


def collect_links(base: str, page_html: str) -> set[str]:
    out: set[str] = set()
    for m in HREF_RE.finditer(page_html):
        n = normalize_page_url(base, m.group(1))
        if n:
            out.add(n)
    return out


def collect_assets(base: str, page_html: str) -> set[str]:
    found: set[str] = set()
    for m in ASSET_HOST_RE.finditer(page_html):
        found.add(clean_url(m.group("u")))
    for m in ATTR_RE.finditer(page_html):
        u = clean_url(m.group(1))
        if u.startswith("//"):
            u = "https:" + u
        elif u.startswith("/"):
            u = urljoin(base, u)
        if not u.startswith("http"):
            continue
        if any(
            d in u
            for d in ("framerusercontent.com", "framer.com", "mayar.id")
        ) and MEDIA_RE.search(u):
            found.add(u)
    return found


def save_page(url: str, content: bytes, ctype: str) -> Path:
    PAGES_DIR.mkdir(parents=True, exist_ok=True)
    if url.endswith("llms.txt") or "text/plain" in ctype:
        path = PAGES_DIR / safe_name(url, ".txt")
        if not path.name.endswith(".txt"):
            path = path.with_suffix(".txt")
    elif "html" in ctype or url.endswith("/"):
        path = PAGES_DIR / safe_name(url, ".html")
        if not path.name.endswith(".html"):
            path = path.with_name(path.name + ".html")
    else:
        path = PAGES_DIR / safe_name(url)
    path.write_bytes(content)
    return path


def download_assets(asset_urls: set[str]) -> int:
    ASSETS.mkdir(parents=True, exist_ok=True)

    imgs = [
        u
        for u in asset_urls
        if re.search(r"\.(png|jpe?g|webp|svg|gif)(\?|$)", u, re.I)
    ]
    fonts = [
        u for u in asset_urls if re.search(r"\.(woff2?|ttf)(\?|$)", u, re.I)
    ]
    other = [u for u in asset_urls if u not in imgs and u not in fonts]

    cleaned_imgs: list[str] = []
    seen_paths: set[str] = set()
    for u in imgs:
        p = urlparse(u)
        if p.path in seen_paths:
            continue
        seen_paths.add(p.path)
        cleaned_imgs.append(f"{p.scheme}://{p.netloc}{p.path}")

    queue = cleaned_imgs[:MAX_IMAGES] + fonts[:MAX_FONTS] + other[:MAX_OTHER]
    print(f"downloading {len(queue)} assets (from {len(asset_urls)} urls)")

    ok = 0
    for u in queue:
        try:
            time.sleep(DELAY_S)
            rr = SESSION.get(u, timeout=60)
            if rr.status_code != 200:
                print(f"  skip {rr.status_code} {u[:90]}")
                continue
            base = Path(urlparse(u).path).name or "asset"
            if len(base) < 3:
                base = hashlib.md5(u.encode()).hexdigest()[:12]
            dest = ASSETS / base
            if dest.exists() and dest.stat().st_size == len(rr.content):
                ok += 1
                continue
            if dest.exists():
                dest = ASSETS / f"{hashlib.md5(u.encode()).hexdigest()[:8]}_{base}"
            dest.write_bytes(rr.content)
            ok += 1
            if ok % 20 == 0:
                print(f"  ... {ok} assets")
        except Exception as e:
            print(f"  fail: {e}")
    return ok


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    PAGES_DIR.mkdir(parents=True, exist_ok=True)
    ASSETS.mkdir(parents=True, exist_ok=True)

    queue: deque[str] = deque()
    seen: set[str] = set()
    for u in SEED + EXTRA_SEEDS:
        n = normalize_page_url("https://mayar.id/", u) or u
        if n not in seen:
            seen.add(n)
            queue.append(n)

    saved_pages: list[str] = []
    asset_urls: set[str] = set()
    failed: list[str] = []
    crawled: list[str] = []

    while queue and len(crawled) < MAX_PAGES:
        page = queue.popleft()
        try:
            time.sleep(DELAY_S)
            r = SESSION.get(page, timeout=60)
            if r.status_code != 200:
                print(f"SKIP {r.status_code} {page}")
                failed.append(f"{r.status_code} {page}")
                continue
            ctype = r.headers.get("content-type", "")
            path = save_page(page, r.content, ctype)
            saved_pages.append(str(path.relative_to(OUT)))
            crawled.append(page)
            print(f"OK [{len(crawled)}/{MAX_PAGES}] {page} ({len(r.content)}b)")

            if "html" in ctype or page.endswith("/"):
                text = r.text
                asset_urls |= collect_assets(page, text)
                for link in collect_links(page, text):
                    if link not in seen and len(seen) < MAX_PAGES + 50:
                        seen.add(link)
                        queue.append(link)
            elif page.endswith("llms.txt") or "text/plain" in ctype:
                # extract http links from llms.txt
                for m in re.finditer(r"https?://[^\s\)]+", r.text):
                    n = normalize_page_url(page, m.group(0).rstrip(".,;"))
                    if n and n not in seen:
                        seen.add(n)
                        queue.append(n)
        except Exception as e:
            print(f"FAIL {page}: {e}")
            failed.append(f"{page}: {e}")

    print(f"crawled {len(crawled)} pages, {len(asset_urls)} asset urls")
    assets_ok = download_assets(asset_urls)

    # also keep root-level convenience copies of key files
    for name in ("mayar.id_index.html",):
        src = PAGES_DIR / name
        # ignore if naming differs
        pass

    manifest = {
        "source": "https://mayar.id/",
        "hosting": "Framer",
        "note": "Public marketing/docs for local design research only. Not affiliated with Mayar.",
        "pages_crawled": crawled,
        "pages_saved": saved_pages,
        "pages_failed": failed,
        "assets_saved": assets_ok,
        "asset_urls_found": len(asset_urls),
        "limits": {
            "max_pages": MAX_PAGES,
            "max_images": MAX_IMAGES,
            "max_fonts": MAX_FONTS,
        },
    }
    (OUT / "MANIFEST.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    (OUT / "README.md").write_text(
        f"""# Mayar.id reference mirror

Local design research crawl of **public** Mayar marketing pages + Framer assets.

## Snapshot
- Pages crawled: **{len(crawled)}**
- Assets downloaded: **{assets_ok}**
- Asset URLs found: **{len(asset_urls)}**

## Layout
```
reference/mayar-id/
  pages/          # HTML + llms.txt
  assets/         # images, fonts, scripts
  MANIFEST.json
  README.md
```

## Rules
- Portfolio / redesign reference only
- Not affiliated with Mayar
- Do not rehost as an official product site
- Skips auth surfaces (`web.mayar.id`, sign-in, etc.)
- Prefer official machine docs: https://docs.mayar.id/llms.txt
- Agent skill: https://github.com/mayarid/mayar-cli/blob/main/SKILL.md

## Re-run
```bash
python scripts/mirror_mayar_public.py
```

## Full offline browser (optional)
WinHTTrack: https://www.httrack.com/ — include domains `mayar.id` + `framerusercontent.com`.
""",
        encoding="utf-8",
    )
    print("DONE", json.dumps({k: manifest[k] for k in ("pages_crawled", "assets_saved", "asset_urls_found") if k in manifest}, indent=2) if False else "")
    print(
        json.dumps(
            {
                "pages": len(crawled),
                "assets_saved": assets_ok,
                "asset_urls_found": len(asset_urls),
                "failed": len(failed),
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
