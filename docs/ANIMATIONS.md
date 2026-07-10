# Animation plan — Floating Island Specimen

Static first. Everything below is a **later** pass. Hooks exist as `data-anim` on nodes in `SpecimenHero.tsx`.

## What should stay **shapes / code** (never AI raster)

| Element | Why code |
|---------|----------|
| L-brackets (4 corners) | Crisp geometry, scales infinitely |
| Leader lines + node dots | Exact alignment, draw-on animation |
| Product card chrome | Glass, borders, radius — real CSS |
| Qty stepper & Checkout button | Interactive later |
| All typography (headline, body, mono HUD) | Selectable, localizable, sharp |
| Mayar wordmark mark | Brand control |
| Soft ground shadow | Blur ellipse under island |
| Trust stars | Simple glyphs |

Magic Layers had baked these as PNG slices (white pills, partial glyphs). That is why the SVG was 4MB and fuzzy.

## What stays **photoreal image**

| Asset | Path | Note |
|-------|------|------|
| Floating island | `/public/specimen/island.jpg` | Inverted-cliff silhouette; no baked UI |
| Headphones | `/public/specimen/headphones.png` | Product cutout for card |

Optional later: replace headphones with pure SVG illustration if you want zero stock product feel.

---

## Suggested animations (priority order)

### P0 — “alive specimen” (high impact, low risk)

1. **Island float** (`data-anim="island"`)  
   Slow vertical bob `translateY(-6px ↔ 6px)` ~5–7s ease-in-out infinite.  
   Pair with **shadow** (`island-shadow`) scale/opacity inverse so it feels grounded.

2. **Product card entrance** (`product-card`)  
   Fade + slight `translateY(12px → 0)` after island settles. Optional micro parallax vs island on mouse (desktop only).

3. **Leader lines draw-on** (`leaders`)  
   SVG `stroke-dashoffset` 0 on load, staggered 80–120ms per line.  
   Node dots scale in after each line completes.

4. **Annotation fade** (`annotation`)  
   Opacity 0→1 after their line draws. Keep type static (no scramble unless you want sci-fi).

### P1 — marketing polish

5. **Headline split** (`headline`)  
   “Frictionless” color wipe or slight letter-spacing settle. Avoid typewriter (feels cheap here).

6. **Audience carousel** (`audience`)  
   Cycle Creators → Social Sellers → Educators → Freelancers every ~2.8s.  
   Active row: blue + chevrons; inactive stay ghosted. Crossfade or vertical slide (one line height).

7. **CTA hover** (`cta`)  
   Nested arrow circle `translateX(2px)` + soft scale. Already has `active:scale`.

8. **Checkout press** (`checkout-btn`)  
   Same island-button physics as CTA.

### P2 — HUD / specimen theater

9. **Mono coords** (top-left X/Y/Z)  
   Subtle number tick every few seconds (fake telemetry). Very low opacity motion.

10. **SESSION / TIME**  
    Live clock for TIME is optional and cool for portfolio; keep DATE/VER static.

11. **Corner brackets**  
    Optional: pulse opacity once on load (frame “locks in”).

### Skip / careful

- **Do not** continuous blur on the island (perf + mushy).  
- **Do not** spin the island 3D (breaks product-hero credibility).  
- **Do not** animate every mono label at once (noise).  
- Parallax: max 1 axis, subtle; disable on `prefers-reduced-motion`.

---

## Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  [data-anim] { animation: none !important; transition: none !important; }
}
```

Island stays static; still show full composition.

---

## Implementation stack (when ready)

- CSS only for float + entrance (no lib required)  
- Or Motion One / Framer Motion for line draw + stagger  
- Audience cycle: tiny client component (`"use client"`) with `useEffect` interval  

Keep **server component** shell; isolate interactive pieces.
