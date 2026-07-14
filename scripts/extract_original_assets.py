"""Extract island + headphones ONLY from original specimen / Magic Layers SVG.
Never generate new imagery.
"""

from __future__ import annotations

import base64
import os
import re
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "specimen"
ORIGINAL = Path(r"C:\Users\vstal\Downloads\Specimen Hero _ Floating Island.png")
MAGIC_SVG = Path(r"C:\Users\vstal\Downloads\Magic Layers Template.svg")


def is_cream_bg(r: int, g: int, b: int, a: int) -> bool:
    if a < 10:
        return True
    if r >= 232 and g >= 226 and b >= 216:
        mx, mn = max(r, g, b), min(r, g, b)
        sat = 0.0 if mx == 0 else (mx - mn) / mx
        return sat < 0.14
    return False


def extract_island() -> Path:
    img = Image.open(ORIGINAL).convert("RGBA")
    print(f"full {img.size}")

    # Right-side island region on 5408x3072 original
    island = img.crop((3000, 220, 5050, 2500))
    w, h = island.size
    print(f"crop {w}x{h}")
    pixels = island.load()

    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if is_cream_bg(r, g, b, a):
                pixels[x, y] = (0, 0, 0, 0)

    # Remove thin annotation ink floating on transparency
    for y in range(1, h - 1):
        for x in range(1, w - 1):
            r, g, b, a = pixels[x, y]
            if a == 0:
                continue
            if not (
                r < 100
                and g < 105
                and b < 115
                and (max(r, g, b) - min(r, g, b)) < 35
            ):
                continue
            t = 0
            for dy in (-1, 0, 1):
                for dx in (-1, 0, 1):
                    if pixels[x + dx, y + dy][3] < 16:
                        t += 1
            if t >= 4:
                pixels[x, y] = (0, 0, 0, 0)

    bbox = island.getbbox()
    print("bbox", bbox)
    if bbox:
        island = island.crop(bbox)

    w2, h2 = island.size
    left_trim = int(w2 * 0.08)
    right_trim = int(w2 * 0.02)
    top_trim = int(h2 * 0.02)
    bot_trim = int(h2 * 0.02)
    island = island.crop((left_trim, top_trim, w2 - right_trim, h2 - bot_trim))
    print("after trim", island.size)

    max_w = 920
    if island.width > max_w:
        ratio = max_w / island.width
        island = island.resize(
            (max_w, int(island.height * ratio)), Image.Resampling.LANCZOS
        )

    out_path = OUT / "island.png"
    island.save(out_path, "PNG", optimize=True)
    print("saved", out_path, island.size)
    return out_path


def extract_headphones() -> Path:
    svg = MAGIC_SVG.read_text(encoding="utf-8", errors="ignore")
    matches = re.findall(r'xlink:href="data:image/png;base64,([^"]+)"', svg)
    if len(matches) < 38:
        raise RuntimeError(f"expected 46 layers, got {len(matches)}")
    # Magic Layers index 37 = headphones cutout from original page
    data = base64.b64decode(matches[37])
    out_path = OUT / "headphones.png"
    out_path.write_bytes(data)
    print("headphones", out_path, len(data))
    return out_path


def cleanup() -> None:
    junk = [
        "island.jpg",
        "island-crop-raw.png",
        "original-full-ref.png",
        "layer-meta.txt",
    ]
    for name in junk:
        p = OUT / name
        if p.exists():
            p.unlink()
            print("removed", name)
    for p in OUT.glob("src-layer-*.png"):
        p.unlink()
        print("removed", p.name)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    if not ORIGINAL.exists():
        raise FileNotFoundError(ORIGINAL)
    if not MAGIC_SVG.exists():
        raise FileNotFoundError(MAGIC_SVG)
    extract_island()
    extract_headphones()
    cleanup()
    print("final:", sorted(p.name for p in OUT.iterdir()))


if __name__ == "__main__":
    main()
