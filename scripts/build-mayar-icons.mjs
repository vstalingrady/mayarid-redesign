/**
 * Build Mayar favicons from the official Framer source mark.
 * Source: public/brand/mayar-favicon-source.png
 *   — solid blue M + pink wing on TRANSPARENT canvas (same as mayar.id)
 *
 * Pipeline:
 * 1. Find opaque content bbox and extract (trim transparent padding)
 * 2. Contain-fit into a square with ~3% pad (transparent, not white)
 * 3. Output each required size
 *
 * Do NOT flatten to white — user rejects white background.
 * Live mayar.id uses this Framer asset as <link rel="icon">.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const sourcePath = path.join(root, "public", "brand", "mayar-favicon-source.png");

/** Fraction of final square reserved as margin on each side (0.03 = 3%). */
const PAD_RATIO = 0.03;
/** Alpha above this counts as content when measuring the mark bbox. */
const ALPHA_CONTENT = 16;

/** @type {{ rel: string, size: number }[]} */
const outputs = [
  { rel: "public/favicon-32.png", size: 32 },
  { rel: "public/favicon.png", size: 48 },
  { rel: "public/apple-touch-icon.png", size: 180 },
  { rel: "public/icon-192.png", size: 192 },
  { rel: "public/icon-512.png", size: 512 },
  { rel: "src/app/icon.png", size: 48 },
  { rel: "src/app/apple-icon.png", size: 180 },
  { rel: "src/app/favicon.png", size: 48 },
];

/**
 * Measure opaque content bounding box of the source mark.
 * @returns {Promise<{ left: number, top: number, width: number, height: number }>}
 */
async function contentBBox() {
  const { data, info } = await sharp(sourcePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let minX = info.width;
  let minY = info.height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const a = data[(y * info.width + x) * 4 + 3];
      if (a > ALPHA_CONTENT) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX < 0) {
    return { left: 0, top: 0, width: info.width, height: info.height };
  }

  return {
    left: minX,
    top: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

/**
 * Build a square transparent PNG with the mark filling ~94% of the tile.
 * @param {number} size
 * @param {{ left: number, top: number, width: number, height: number }} bbox
 */
async function resizeIcon(size, bbox) {
  const transparent = { r: 0, g: 0, b: 0, alpha: 0 };
  // contain into full size first (transparent letterbox), then we still want
  // only PAD_RATIO empty — so target the inner box, then extend.
  const inner = Math.max(1, Math.round(size * (1 - 2 * PAD_RATIO)));
  const sidePad = Math.floor((size - inner) / 2);
  const bottomPad = size - inner - sidePad;

  return sharp(sourcePath)
    .extract(bbox)
    .ensureAlpha()
    .resize(inner, inner, {
      fit: "contain",
      background: transparent,
      kernel: sharp.kernel.lanczos3,
    })
    .extend({
      top: sidePad,
      bottom: bottomPad,
      left: sidePad,
      right: size - inner - sidePad,
      background: transparent,
    })
    .png({ compressionLevel: 9, palette: false })
    .toBuffer();
}

async function main() {
  const meta = await sharp(sourcePath).metadata();
  console.log(
    `Source: ${sourcePath} (${meta.width}x${meta.height}, channels=${meta.channels}, alpha=${meta.hasAlpha})`,
  );

  const bbox = await contentBBox();
  console.log(
    `Content bbox: x=${bbox.left} y=${bbox.top} ${bbox.width}x${bbox.height}`,
  );

  for (const { rel, size } of outputs) {
    const outPath = path.join(root, rel);
    await mkdir(path.dirname(outPath), { recursive: true });
    const buf = await resizeIcon(size, bbox);
    await sharp(buf).toFile(outPath);
    const outMeta = await sharp(outPath).metadata();
    console.log(`Wrote ${rel} (${outMeta.width}x${outMeta.height}, ${buf.length} bytes)`);
  }

  console.log(
    "Done. Transparent canvas + trimmed M (no white recolor). PAD_RATIO=",
    PAD_RATIO,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
