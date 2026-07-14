# Handoff: Mayar specimen — product bento + favicon

**Date:** 2026-07-14  
**Repo:** `C:\Users\vstal\mayarid`  
**Branch:** `main` (check `git status` — may have uncommitted work)  
**Dev server:** User may already have Next on **localhost:3000**. **Do NOT kill ports or `taskkill` Next processes.** Use existing server or start only on a free port without killing anything.

---

## Mission for next agent

1. **Fix the Mayar “M” favicon / app icons** — still wrong. User rejects **white background**. Must match **live Mayar** tab mark.
2. Continue any polish on the product-types **bento** if needed after favicon is correct.
3. Prefer plan in `docs/superpowers/plans/2026-07-14-product-bento-favicon.md` + this handoff over re-deriving context from chat.

---

## Favicon problem (priority)

### What the user wants
- **Live Mayar tab icon** (top of comparison screenshot): solid blue **M** filling the tile correctly.
- **Not** our previous cream + tiny padded M.
- **Not** current result with **white background** — user explicitly: *“the mayar id M is still messed up. white background.”*

### What we did (failed / incomplete)
1. Tried compositing from `public/brand/mayar-m.png` (black canvas + blue M + pink) → cream or blue bg → looked bad, M didn’t fill.
2. Downloaded official Framer asset:
   - URL: `https://framerusercontent.com/images/b0TBFiJ8TKZCgDC97NLQ4y3qVJo.png`
   - Saved as: `public/brand/mayar-favicon-source.png` (362×363)
3. `scripts/build-mayar-icons.mjs` resizes that source to all sizes.
4. Later “fix” **replaced gray canvas with pure white** so tab looked “white + blue M”. **User still rejects white background.**

### Source asset characteristics
`mayar-favicon-source.png` is **not** a pure white tile:
- Blue geometric **M**
- Pink wing accent on the M
- **Gray / slate canvas** behind the mark (not transparent, not white)

Live Mayar site `<link rel="icon">` in mirror:
```html
href="https://framerusercontent.com/images/b0TBFiJ8TKZCgDC97NLQ4y3qVJo.png"
```
(from `reference/mayar-id/mayar.id_index.html`)

### Likely correct fix (try in order)
1. **Use official source as-is** — only `sharp` resize with `fit: 'cover'`, **no** gray→white recolor. Compare to live mayar.id tab.
2. If browser tab still looks wrong, open live `mayar.id` and inspect actual favicon bytes (may differ by media query light/dark — HTML has `prefers-color-scheme` icon links).
3. If mark still has padding inside the PNG, **crop/trim** non-content edges **before** resize, keep original bg color (gray), or use **transparent** bg only if the M is isolated correctly.
4. Do **not** invent cream specimen (`#f4f2ec`) backgrounds for favicons.
5. Do **not** put blue M on blue `#2563eb` square (M disappears).

### Icon outputs to overwrite (all of these)
| Path | Notes |
|------|--------|
| `public/favicon.png` | 48 |
| `public/favicon-32.png` | 32 |
| `public/apple-touch-icon.png` | 180 |
| `public/icon-192.png` | 192 |
| `public/icon-512.png` | 512 |
| `src/app/icon.png` | **App Router primary** — Next serves this first |
| `src/app/apple-icon.png` | Apple |
| `src/app/favicon.png` | Extra copy may exist |

Script: `scripts/build-mayar-icons.mjs`  
Run: `node scripts/build-mayar-icons.mjs`

**QA:** Hard-refresh + clear site data. Favicons cache hard. Compare side-by-side with live mayar.id tab and user’s clipboard comparison image if available:
`C:/Users/vstal/Pictures/Clipboard/clipboard-20260714-145013.png` (top = good / real Mayar, bottom = bad / ours).

---

## Product types — split explorer (shipped 2026-07-14)

### Page order
```
SpecimenHero → TrustStrip → ProductDashboard → ProductTypesSection
```
(`src/app/page.tsx`) — dashboard above product types was **deliberate**.

### Implementation (replaces multi-card bento)
- Spec: `docs/superpowers/specs/2026-07-14-product-split-explorer-design.md`
- Plan: `docs/superpowers/plans/2026-07-14-product-split-explorer.md`
- `ProductTypesSection` → header + `ProductSplitExplorer`
- `src/components/product-explorer/`:
  - `ProductSplitExplorer.tsx` — sticky `activeId`, autoplay 3.5s, reduced-motion
  - `ProductMediaPanel.tsx` — left 60% family image + caption
  - `ProductListPanel.tsx` — right 40% grouped list + Phosphor icons
- Helpers: `productsInFamilyOrder`, `getProductById`, `nextProductId` in `productTypes.ts`
- Behavior: hover row → image; unhover keeps image; idle cycles product-by-product; list hover pauses cycle
- Browser QA: 60/40 grid, sticky, autoplay E-Book→Podcast, tsc clean

### Lab page
`/directions` still has A–E direction prototypes; production is `ProductTypesSection` only.

---

## Hard constraints from user

| Rule | Detail |
|------|--------|
| **No killing ports** | Never `taskkill` Next / free ports by force |
| **Geist is fine** | Don’t swap fonts unless asked |
| **Favicon** | Match real Mayar; **no white background** (user’s last complaint) |
| **Bento** | One invisible rectangle, even spacing, dynamic heights |

---

## Skills / tools available

- Superpowers plans: `docs/superpowers/plans/`
- Image: sharp (in project / node_modules), Grok `image_gen` if needed
- Design skills: `design-taste-frontend`, `make-interfaces-feel-better`
- Subagents: general-purpose / cavecrew-builder for surgical edits
- **Do not** re-download brand assets into random places; prefer `public/brand/`

---

## Suggested next steps (copy-paste for next agent)

```
1. Open public/brand/mayar-favicon-source.png and public/favicon.png; compare to live mayar.id favicon.
2. Fix scripts/build-mayar-icons.mjs: REMOVE white-background recolor; resize official source only (or match light/dark Framer variants from mayar.id HTML).
3. Regenerate all icon paths listed above; verify src/app/icon.png is correct (App Router).
4. Hard-refresh QA on existing localhost (do not kill servers).
5. Only then touch ProductTypesSection if user still wants bento tweaks.
```

---

## Conversation summary (compressed)

- Built Mayar specimen landing; dashboard hover; product-types Direction B.
- Lab at `/directions` for A–E; user chose **B (grouped bento)**.
- Generated family lifestyle images under `public/specimen/products/`.
- Layout iterations: hero card → horizontal image/text → unified cells → absolute hover cover.
- Favicon repeatedly wrong; latest issue is **white background** after gray→white flatten.
- Official source downloaded; build script exists; needs correct processing without white bg.

---

## Success criteria for handoff completion

- [x] Tab favicon matches live Mayar (M fills tile; **not** white-padded wrong mark)
- [x] All App Router + public icon paths consistent
- [ ] Product bento still works on homepage under dashboard (verify in browser)
- [x] No port killing; no unrelated refactors

### Favicon fix applied (2026-07-14, continue session)

**Root cause:** Official Framer source is **transparent** (not gray). Transparent pixels store RGB `(76,105,113)` but alpha=0. Prior script recolored non-blue/non-pink → **opaque white** → user rejected white bg.

**Fix in `scripts/build-mayar-icons.mjs`:**
1. Measure opaque content bbox, extract (trim padding)
2. Contain-fit into square with **3% transparent pad**
3. **No white recolor** — transparent canvas preserved
4. Overwrite all public + `src/app` icon paths
5. Cache-bust metadata icons `?v=3` in `src/app/layout.tsx`

**QA note:** Hard-refresh / clear site data — favicons cache hard. Compare tab to live mayar.id.
