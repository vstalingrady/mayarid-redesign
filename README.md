# mayarid-redesign

Speculative **Design Engineer (AI)** specimen for Mayar — **Floating Island** hero.

> Unaffiliated portfolio work. Not an official Mayar product.

## Current slice

**Static Floating Island specimen hero** — recreated from Magic Layers / original AI composite as:

| Layer | Implementation |
|-------|----------------|
| UI chrome, labels, lines, card, CTA | **Code** (HTML/CSS/SVG) |
| Floating island | **Image** from original page only `/public/specimen/island.png` |
| Headphones product | **Image** from Magic Layers extract `/public/specimen/headphones.png` |

No AI image generation. Photoreal assets come only from the original specimen / Magic Layers export.

See `docs/ANIMATIONS.md` for what to animate later.

## Run

```bash
npm install
npm run dev
```

→ [http://localhost:3000](http://localhost:3000)

## Stack

- Next.js App Router + TypeScript + Tailwind  
- Built with **Grok Build**  
- Spec source: Magic Layers SVG + Specimen Hero PNG  

## Why not ship the Magic Layers SVG as-is?

It was ~4MB of **46 PNG slices** (text, pills, corners baked as images). Rebuilding as code gives sharp type, real interactions, and clean animation hooks.

## License

MIT for code. Mayar trademarks remain theirs. Photoreal assets for portfolio specimen only.
