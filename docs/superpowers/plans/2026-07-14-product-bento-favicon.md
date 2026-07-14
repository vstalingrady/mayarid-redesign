# Product Bento + Favicon Redo — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** (1) Favicon that matches live Mayar — solid blue **M** fills the entire rounded tile (no cream padding, no tiny mark). (2) Product-types section redesigned as **one invisible bento frame** with even gaps, dynamic cell sizes, no special “hero” card, text-first with image on hover.

**Architecture:** Favicon is a generated solid-blue geometric M on white (or transparent) with **≤4% padding**, written to all icon paths Next uses. Bento is a single CSS Grid shell (`max-w` + consistent `gap`) where each family is a cell with `auto` rows; span rules give short vs long families different footprints without equal-height stretch or empty voids. Hover reveals lifestyle image as a cover layer or left panel without breaking the grid.

**Tech Stack:** Next.js 16, React 19, Tailwind v4, `next/image`, sharp (Node) for icons, existing `productTypes` data + family images.

**Skills / plugins to use:**
- `writing-plans` (this doc)
- `design-taste-frontend` / `make-interfaces-feel-better` — spacing, radius, hover
- `cavecrew-builder` or general-purpose executor for implementation
- **Do not** kill dev servers / ports

**Reference truth (favicon):** User screenshot top tab = live Mayar: white tile, **solid blue M**, mark nearly edge-to-edge. Bottom = ours: cream, pink accent, mark too small with padding — reject that.

---

## Context — why current work fails

| Issue | Current | Target |
|--------|---------|--------|
| Favicon | Cream bg, pink wing, M with large margin | White (or #fff) tile, solid #2563eb M, fill ≥92% of square |
| Link Pembayaran | Was special blue hero | Same cell type as every family |
| Bento | Uneven cards, hover grid jank, visual “loose” | One frame, even `gap`, dynamic spans, dense |
| Hover | grid-template-columns 0→60% can feel broken | Prefer image as absolute overlay or stable 60/40 panel without layout thrash |

---

## Critical files

| Path | Action |
|------|--------|
| `scripts/build-mayar-icons.mjs` | **Create** — sharp pipeline → all icon sizes |
| `public/favicon.png`, `favicon-32.png`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` | **Overwrite** |
| `src/app/icon.png`, `src/app/apple-icon.png` | **Overwrite** (App Router priority) |
| `src/app/layout.tsx` | Verify metadata icons point at correct paths |
| `src/components/ProductTypesSection.tsx` | **Rewrite** bento |
| `src/data/productTypes.ts` | Reuse; optional `span` hints per family |
| `src/app/globals.css` | Update reduced-motion rules for new classes |

---

## Task 1 — Favicon (pixel-true to live Mayar)

**Goal:** Match top tab in user screenshot: bold solid blue M fills the square.

- [ ] **Step 1:** Build geometric Mayar M as **SVG** (not photo of logo). Solid fill `#2563eb` only (no pink at ≤48px). ViewBox tight around glyph.

```svg
<!-- Conceptual: thick geometric M filling viewBox 0 0 100 100 with ~4 unit margin -->
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" rx="18" fill="#ffffff"/>
  <!-- M path designed to occupy ~92% of the rect (not the padded brand PNG) -->
  <path fill="#2563eb" d="...tight M path..."/>
</svg>
```

Prefer reconstructing M from `public/brand/mayar-m.png` by:
1. Removing black → transparent
2. **Recoloring all non-transparent pixels to pure `#2563eb`** (drop pink at small sizes)
3. Trim + scale to `size * 0.94` centered on **white** square
4. Optional: `rx` is browser chrome, not baked into PNG (keep PNG square, no need for rounded corners in file)

- [ ] **Step 2:** Script `scripts/build-mayar-icons.mjs` outputs:

| File | Size |
|------|------|
| `public/favicon-32.png` | 32 |
| `public/favicon.png` | 48 |
| `public/apple-touch-icon.png` | 180 |
| `public/icon-192.png` | 192 |
| `public/icon-512.png` | 512 |
| `src/app/icon.png` | 32 or 48 |
| `src/app/apple-icon.png` | 180 |

- [ ] **Step 3:** Visual QA: open icons; M must dominate tile; compare to user screenshot top tab. If still “small M on big field”, reduce pad to **0.02–0.03**, not 0.06+.

- [ ] **Step 4:** Hard-refresh note: browsers cache favicons aggressively; bump query or rely on `src/app/icon.png` App Router generation.

**Do not** use cream `#f4f2ec` as favicon background. White or pure brand blue tile only (if blue tile, M must be white — live Mayar uses **white tile + blue M**).

---

## Task 2 — Bento redesign (one invisible rectangle)

### Design read

Reading as: **specimen product catalog bento** for Mayar cream page — one continuous module under the section header, dynamic cell heights, even gaps, no carnival hero.

### Layout rules (locked)

```
┌─────────────────────────────────────────────┐  ← invisible frame (max-w, no outer border)
│  [header centered outside or inside top]    │
│  ┌─────┬─────┬─────┐                        │  gap = 12px (gap-3) everywhere
│  │  A  │  B  │  C  │  ← equal column tracks │
│  ├─────┼─────┴─────┤                        │
│  │  D  │     E     │  ← dynamic row spans   │
│  │     ├─────┬─────┤                        │
│  │     │  F  │  G  │                        │
│  └─────┴─────┴─────┘                        │
└─────────────────────────────────────────────┘
```

**Concrete grid (desktop lg):**
- Container: `mx-auto max-w-[1040px]`
- Grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3`
- **No** `items-stretch` forcing empty voids — use `items-start` OR masonry via `grid-auto-rows: minmax(min-content, auto)` and content-driven height
- All 7 families including `payment` are **identical cell components** (no special blue hero)
- Cell content:
  - Family mono label
  - Product names as **plain text links** (no white pill chips, no Phosphor icons in list)
  - Soft family tint bg optional, hairline `border-line/70`, `rounded-2xl`
- **Hover / focus-within:**
  - Image appears left **60%**, text **40%** (stable grid *inside* the cell: `grid-cols-[3fr_2fr]` only when hovered; rest is `grid-cols-1` text-only)
  - OR image as absolute cover with gradient + text on top (simpler, less reflow) — **prefer absolute cover on hover** for less layout jank:
    - Rest: text + tint
    - Hover: image fades in full-bleed behind, text stays readable on scrim

**Pick one hover model (recommended for “even”):**  
**Absolute image cover on hover** (no column resize). Keeps every cell’s width in the bento stable; only opacity/transform changes. Even spacing preserved.

If user insists on 60/40 split, implement *inside* the cell with min-height so short lists still look balanced:

```tsx
// inside cell
className="grid min-h-[8.5rem] transition-[grid-template-columns] duration-500
  grid-cols-1 group-hover:grid-cols-[3fr_2fr]"
```

- [ ] **Step 1:** Rewrite `ProductTypesSection.tsx` with unified cell component `FamilyBentoCell`.
- [ ] **Step 2:** Map `FAMILY_ORDER` (all 7) into 3-col bento; no payment special case.
- [ ] **Step 3:** Hover image from `FAMILY_IMAGES[family]` via `next/image` fill.
- [ ] **Step 4:** Reduced motion: no transform lift; show image static or never expand columns.
- [ ] **Step 5:** Mobile: 1 col stack; same cell component.
- [ ] **Step 6:** Section header stays above the frame (eyebrow + title + sub).

### Span optional polish (dynamic but even)

Without masonry library:

| Family | items | Optional `lg:row-span` / `col-span` |
|--------|-------|--------------------------------------|
| live | 5 | `row-span-2` |
| content | 5 | `row-span-2` |
| payment, physical, fundraise | 1 | default |
| digital, saas | 2–3 | default |

Only apply spans if the grid still has **even gaps** and no huge empty region. If spans create holes, drop spans and use pure auto-height 3-col.

---

## Task 3 — Verify

- [ ] Open homepage (use **existing** dev server; **never** `taskkill` ports).
- [ ] Favicon: hard-refresh; M fills tab icon like Mayar production.
- [ ] Bento: one module, even gaps, hover image works, payment not special.
- [ ] `npx tsc --noEmit` clean.
- [ ] Keyboard: focus-within reveals image; links focusable.

---

## Out of scope

- Killing/restarting ports  
- New font changes  
- Dashboard reorder  
- Per-product images (family images only)  
- Motion libraries  

---

## Subagent split

1. **favicon-agent** — Task 1 only (icons)  
2. **bento-agent** — Task 2–3 (ProductTypesSection + CSS)  

Main thread reviews both, no port kills.
