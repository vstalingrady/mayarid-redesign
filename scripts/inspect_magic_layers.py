"""Inspect a Magic Layers Template SVG and extract embedded layers."""

from __future__ import annotations

import base64
import io
import json
import re
import sys
from pathlib import Path

from PIL import Image

DEFAULT = Path(r"C:\Users\vstal\Downloads\Magic Layers Template (1).svg")
OUT = Path(__file__).resolve().parents[1] / "public" / "specimen" / "magic-layers-v2"


def main() -> None:
    svg_path = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT
    out = OUT
    out.mkdir(parents=True, exist_ok=True)

    raw = svg_path.read_text(encoding="utf-8", errors="ignore")
    print("file", svg_path.name)
    print("file_size_mb", round(svg_path.stat().st_size / 1e6, 2))
    print("chars", len(raw))

    m = re.search(r'viewBox="([^"]+)"', raw)
    print("viewBox", m.group(1) if m else None)
    wm = re.search(r'width="([^"]+)"', raw)
    hm = re.search(r'height="([^"]+)"', raw)
    print("svg_attrs", wm.group(1) if wm else None, "x", hm.group(1) if hm else None)

    print("image_tags", len(re.findall(r"<image", raw)))
    print("rect", len(re.findall(r"<rect", raw)))
    print("path", len(re.findall(r"<path", raw)))
    print("circle", len(re.findall(r"<circle", raw)))
    print("g_tags", len(re.findall(r"<g[\s>]", raw)))
    print("text", len(re.findall(r"<text", raw)))

    matches = re.findall(
        r'xlink:href="data:image/(png|jpeg|jpg|webp);base64,([^"]+)"', raw
    )
    print("embedded_images", len(matches))

    tags = re.findall(r"<image\b[^>]*>", raw)
    meta = []
    for i, t in enumerate(tags):

        def attr(name: str) -> str:
            mm = re.search(rf'{name}="([^"]+)"', t)
            return mm.group(1) if mm else "?"

        # transform nearby - look back 200 chars
        idx = raw.find(t)
        snippet = raw[max(0, idx - 250) : idx + 50]
        tf = re.search(r'transform="([^"]+)"', snippet)
        meta.append(
            {
                "i": i,
                "x": attr("x"),
                "y": attr("y"),
                "w": attr("width"),
                "h": attr("height"),
                "transform": (tf.group(1)[:100] if tf else "none"),
                "type": matches[i][0] if i < len(matches) else "?",
            }
        )

    sizes = []
    for i, (ftype, b64) in enumerate(matches):
        try:
            data = base64.b64decode(b64)
        except Exception as e:
            print("decode fail", i, e)
            continue
        ext = "jpg" if ftype in ("jpeg", "jpg") else ftype
        path = out / f"layer-{i:02d}.{ext}"
        path.write_bytes(data)
        try:
            im = Image.open(io.BytesIO(data))
            wh = im.size
            mode = im.mode
        except Exception:
            wh, mode = (0, 0), "?"
        sizes.append((i, len(data), wh, mode, path.name))

    sizes_sorted = sorted(sizes, key=lambda x: -x[1])
    print("--- top layers by bytes ---")
    for row in sizes_sorted[:20]:
        print(
            f"  layer-{row[0]:02d}  {row[1]:>8}b  {row[2][0]}x{row[2][1]}  {row[3]}  {row[4]}"
        )

    # classify rough roles by size
    full = [s for s in sizes if s[2][0] >= 2000 or s[2][1] >= 1500]
    cutouts = [s for s in sizes if 100 < s[2][0] < 1200 and s[3] in ("RGBA", "LA", "P")]
    print("likely_full_frames", len(full), [s[0] for s in full])
    print("likely_cutouts", [s[0] for s in cutouts[:12]])

    report = {
        "source": str(svg_path),
        "viewBox": m.group(1) if m else None,
        "embedded_images": len(matches),
        "layers": [
            {
                "i": i,
                "bytes": b,
                "width": wh[0],
                "height": wh[1],
                "mode": mode,
                "file": n,
                **(meta[i] if i < len(meta) else {}),
            }
            for i, b, wh, mode, n in sizes
        ],
    }
    (out / "layers.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
    print("saved", out)


if __name__ == "__main__":
    main()
