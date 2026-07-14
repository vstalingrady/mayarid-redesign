# Product Split Explorer — Design Spec

**Date:** 2026-07-14  
**Status:** Draft — awaiting user approval before implementation  
**Replaces:** Current multi-cell bento hover-cover in `ProductTypesSection.tsx`  
**Reference:** User screenshot `clipboard-20260714-150718.png` (current bento cards — reject as layout; keep family labels + product names)

---

## Problem

The product-types section is a multi-card bento. User wants a **single interactive module**:

| Side | Role | Ratio |
|------|------|--------|
| **Left** | Service lifestyle image(s) | **60%** |
| **Right** | Product list with **icons per row** | **40%** |

Interaction rules (user, exact):

1. Hover a service **name** → left image switches to that service.
2. **Unhover does not clear** — last hovered image **persists**.
3. When idle, **auto-cycle one-by-one** through the list (dynamic).
4. Layout stays a stable 60/40 (no thrashing columns).

---

## Goals / non-goals

### Goals
- One invisible frame under the existing section header (eyebrow + title + sub).
- Stable `grid-cols-[3fr_2fr]` on desktop (60/40).
- Right: icon + product label rows, grouped under family mono labels for scanability.
- Left: large photo with soft crossfade; caption optional (family or product name).
- Sticky selection + autoplay cycle.
- Reduced-motion: no autoplay; instant or fade-free image swap; no scale lift.
- Keyboard: focus a product row → same as hover (set active, pause cycle while focused).
- No port kills; reuse existing assets where possible.

### Non-goals
- Per-product photography (v1 uses **family** images — 7 assets already in `public/specimen/products/`).
- Rebuilding the section header copy.
- Motion libraries (GSAP, Framer Motion) — CSS + React state only.
- Changing page order (dashboard stays above this section).

---

## Content model

### List unit = **product** (not family card)

Right column is a **flat, grouped list of all `PRODUCT_TYPES`**:

```
PEMBAYARAN
  [link] Link Pembayaran

FISIK
  [tshirt] Produk Fisik

DIGITAL
  [package] Produk Digital
  [package] Lisensi Software
…
```

- Each product already has `icon: ProductIconName` in `src/data/productTypes.ts`.
- Icons via existing `ProductIcon` (`@phosphor-icons/react`) from directions lab.

### Image unit = **family** (v1)

Only 7 lifestyle images exist (`FAMILY_IMAGES`). Multiple products share one family image:

| Product hover | Left image |
|---------------|------------|
| Link Pembayaran | `payment.jpg` |
| Kelas Online, Webinar, … | `live.jpg` |
| E-Book, Podcast, … | `content.jpg` |
| … | … |

When autoplay steps product → product, **same-family neighbors** keep the same photo (no redundant crossfade) or still micro-fade — prefer **skip fade if `family` unchanged**.

**Future (out of scope):** optional `image` per product when assets exist; map falls back to family.

---

## Interaction model (state machine)

### State

```ts
type ExplorerState = {
  /** Product id currently shown / highlighted */
  activeId: string;
  /** User is hovering or focusing a row → pause autoplay */
  paused: boolean;
};
```

### Events

| Event | Effect |
|-------|--------|
| `pointerenter` row | `activeId = product.id`, `paused = true` |
| `pointerleave` list panel | `paused = false` (keep `activeId`) |
| `focus` row | same as enter |
| `blur` list (focus leaves panel) | `paused = false` |
| autoplay tick (if `!paused` && in view) | `activeId = nextProductId(activeId)` |
| section out of view | pause timer (save CPU) |

### Autoplay

- Interval: **~3.5s** (tunable constant).
- Order: `FAMILY_ORDER` → products within each family (stable, matches scan order of the list).
- Loop to first after last.
- Resume from **current** `activeId` after unpause (do not reset to start).
- Prefer `requestAnimationFrame` / `setInterval` cleared on unmount; only run when `inView`.

### Image panel

- Stack of images **or** single `Image` with `key={activeFamily}` + opacity crossfade.
- Prefer: absolute layers for **active family** + previous family for 400–500ms fade (simple: one image + CSS opacity on src change is enough if we accept brief flash; better: dual-buffer).
- Caption under or over image: product `label` (updates with sticky active) + optional family mono.

---

## Layout

### Desktop (lg+)

```
┌─────────────────────────────────────────────────────────┐
│  Section header (centered, unchanged)                   │
│  ┌──────────────────────────┬─────────────────────────┐ │
│  │                          │  PEMBAYARAN             │ │
│  │     IMAGE  (60%)         │  ○ Link Pembayaran      │ │
│  │     rounded-2xl          │  FISIK                  │ │
│  │     min-h ~ 420px        │  ○ Produk Fisik         │ │
│  │                          │  …                      │ │
│  │                          │  (40%, scroll if needed)│ │
│  └──────────────────────────┴─────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

- Container: `mx-auto max-w-[1040px]` (match prior bento frame).
- Grid: `grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-3 lg:gap-4`.
- Left sticky optional on tall lists: `lg:sticky lg:top-24 self-start`.
- Right: single cream/white panel `rounded-2xl border border-line/70 bg-white/40` **or** no outer chrome — soft family groups only. Prefer **one panel** so 60/40 reads as one module.

### Mobile

- Stack: **image first** (aspect ~4/3 or 16/10), then list full width.
- Tap row = set active (no hover); autoplay still runs when in view.
- Sticky image top while scrolling list: optional polish, not required v1.

### Active row chrome

- Soft left bar or `bg-blue/[0.06]` + `text-blue` icon/label.
- Inactive: muted icon, ink label.
- Do **not** use old white pill chips.

---

## Visual direction (specimen)

- Cream page bg stays; module hairline borders `border-line/70`, `rounded-2xl`.
- Image: `object-cover`, slight ken-burns only if `!prefers-reduced-motion` and only on change (subtle).
- Icons: Phosphor `duotone` or `regular` size 18–20, weight consistent with `ProductDashboard`.
- Family headers: mono 10px uppercase tracking like current bento.

---

## Architecture

### Files

| Path | Role |
|------|------|
| `src/components/ProductTypesSection.tsx` | **Rewrite** — shell + explorer composition |
| `src/components/product-explorer/ProductSplitExplorer.tsx` | Client: state, autoplay, 60/40 layout |
| `src/components/product-explorer/ProductListPanel.tsx` | Grouped list + icons + hover/focus handlers |
| `src/components/product-explorer/ProductMediaPanel.tsx` | Left image crossfade + caption |
| `src/components/product-directions/ProductIcon.tsx` | **Reuse** (move import only) |
| `src/data/productTypes.ts` | Reuse; optional `getProductsByFamily()` helper |
| `src/app/globals.css` / `motion.css` | Reduced-motion + row active styles if needed |

### Why split files

Single 400+ line rewrite is harder to review. Media / list / shell have clear seams.

### Data helpers (in `productTypes.ts` or colocated)

```ts
export function productsInFamilyOrder(): ProductType[] {
  // flatten FAMILY_ORDER × filter PRODUCT_TYPES
}

export function familyOf(id: string): ProductFamily | undefined
export function nextProductId(id: string): string
```

---

## Accessibility

- List is real links (`href`) for products — or buttons if href is `#` for now; keep `<a>` for future URLs.
- `aria-current="true"` on active row.
- Media region: `aria-live="polite"` announces active product label on change (rate-limit ok).
- Pause autoplay when `prefers-reduced-motion: reduce`.
- Keyboard: Tab through rows; arrow keys optional (nice-to-have, not v1).

---

## Approaches considered

### A — Split explorer (recommended)
60/40 image | list, sticky active + autoplay. Matches user brief exactly.

### B — Keep bento, only change hover to sticky
Does not deliver left image / right list. Rejected.

### C — Full product carousel (image only, dots)
Weaker information density; loses scan of all products. Rejected for primary.

---

## Success criteria

1. Desktop reads as **60% image / 40% list** one module.
2. Hover product name → left image + row highlight; unhover keeps both.
3. Idle auto-advances product-by-product; image updates (skip redundant same-family fade).
4. Icons on every product row (Phosphor via `ProductIcon`).
5. Mobile usable: image + tappable list.
6. `prefers-reduced-motion` disables autoplay / heavy motion.
7. No `taskkill` / port killing; existing localhost preserved.
8. Section header copy unchanged.

---

## Open decision (default locked for plan)

| Topic | Default | Alt |
|-------|---------|-----|
| Image grain | Family images (7) | Per-product later |
| Cycle unit | Product (16 steps) | Family only (7 steps) — weaker with “name” hover |
| List chrome | One right panel, grouped | Separate tint cards per family (more like screenshot) |
| Autoplay ms | 3500 | 2500–5000 |

If user prefers **family-level list** (7 rows only), cycle and hover map 1:1 to images — simpler but fewer names/icons. **Default stays product-level** as user asked for service names + icons.
