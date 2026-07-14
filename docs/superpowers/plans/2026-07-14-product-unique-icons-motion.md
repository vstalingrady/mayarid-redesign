# Unique Icons + Dynamic Product Explorer Motion — Plan

> **For agentic workers:** Plan only until user says go. Checkbox tasks for implementation.

**Goal:** (1) Every product row has a **distinct** Phosphor icon — no shared glyphs. (2) Idle autoplay feels **alive**: image crossfade + list “scrolls”/tracks the active row with motion (not a static highlight jump).

**Problem (from screenshot `clipboard-20260714-154539.png`):**
- Same icons reused: E-Book ≈ Web Komik (book), Membership ≈ SaaS (stack/cube), Digital ≈ Lisensi Software (package).
- Autoplay only swaps `activeId`; no scroll-into-view, weak image transition, list feels static.

**Tech:** existing `ProductIcon` + Phosphor, CSS transitions, optional `scrollIntoView` / transform track. No Framer Motion / GSAP unless needed.

---

## Part A — Unique icons (data + map)

### Current collisions

| Icon key | Used by (bad) |
|----------|----------------|
| `book` | E-Book, Web Komik |
| `stack` | Membership, SaaS |
| `package` | Produk Digital, Lisensi Software |

### Target: 18 unique Phosphor icons

| Product id | Label | Icon name (new) | Phosphor component |
|------------|-------|-----------------|---------------------|
| link-pembayaran | Link Pembayaran | `link` | Link |
| produk-fisik | Produk Fisik | `tshirt` | TShirt |
| produk-digital | Produk Digital | `package` | Package |
| lisensi-software | Lisensi Software | `key` | Key *(new)* |
| kelas-online | Kelas Online | `graduation` | GraduationCap |
| kelas-cohort | Kelas Cohort / Bootcamp | `usersThree` | UsersThree |
| webinar | Webinar | `video` | VideoCamera |
| event-acara | Event & Acara | `calendar` | CalendarBlank |
| coaching | Coaching & Mentoring | `chalkboard` | ChalkboardTeacher |
| e-book | E-Book | `book` | BookOpen |
| podcast | Podcast | `mic` | Microphone |
| audio-book | Audio Book | `headphones` | Headphones |
| tulisan | Tulisan | `file` | FileText / PencilLine |
| web-komik | Web Komik | `comic` | Comics *(or BookBookmark)* |
| membership | Membership | `crown` | Crown *(new)* |
| saas | SaaS | `appWindow` | AppWindow *(new)* |
| produk-credit | Produk Berbasis Credit | `coins` | Coins |
| penggalangan-dana | Penggalangan Dana | `heart` | Heart |

**Files:**
- `src/data/productTypes.ts` — extend `ProductIconName`, assign unique `icon` per product
- `src/components/product-directions/ProductIcon.tsx` — import new Phosphor glyphs into `MAP`
- Optional: unit assert `new Set(icons).size === PRODUCT_TYPES.length`

**QA:** Screenshot list — zero duplicate silhouettes side-by-side.

---

## Part B — Dynamic “scroll through” motion

### Behavior (idle + hover)

| State | Motion |
|-------|--------|
| **Idle autoplay** | Advance product every ~3–3.5s; image crossfades; **list tracks active row** (scroll or translate so active stays readable); active row highlight animates |
| **Hover / focus list** | Pause autoplay (keep sticky active); optional soft “pause” of list track |
| **Unhover** | Resume autoplay from current id |
| **Reduced motion** | Instant swap only; no autoplay; no scroll animation |

### Recommended motion model (lightweight)

**B1 — Image stage (left)**
- Dual-buffer or CSS: outgoing fade out / incoming fade in (300–450ms).
- Optional subtle scale 1.0 → 1.04 on active image while visible (ken-burns), disabled for reduced-motion.
- Caption text crossfades with product label.

**B2 — List track (right) — “scroll through”**
Pick **one** (recommend **Track + scrollIntoView**):

1. **`scrollIntoView` on active row** (recommended)  
   - Each autoplay step: `activeRowRef.scrollIntoView({ block: 'nearest', behavior: 'smooth' })`.  
   - List panel `overflow-y-auto` again on desktop if content taller than pane; otherwise still useful for keyboard.  
   - Cheap, feels like the list is “walking” through items.

2. **Vertical marquee of a flat product strip** (stronger “scroll”)  
   - Alternate layout: single column infinite strip of all 18 rows; transform `translateY` to center active.  
   - More theatrical; risk: loses 2-col family grouping that fits viewport. Only if user prefers spectacle over dense grid.

3. **Progress rail** under/beside list  
   - Thin progress bar or step dots advancing with autoplay. Complements either 1 or 2.

**Default plan: B1 + B2 option 1 + light progress bar.**

### Active row polish
- Transition `background-color`, `color`, icon weight fill↔regular over 200ms.
- Optional left accent bar scale-y on active.
- On autoplay change: brief pulse (opacity or ring) once.

### Implementation sketch

```
ProductSplitExplorer
  activeId, paused, inView
  → ProductMediaPanel (crossfade by product.id)
  → ProductListPanel (row refs, scrollIntoView on activeId change)
  → optional AutoplayProgress (key={activeId} CSS width 0→100% over AUTOPLAY_MS)
```

**Files:**
- `ProductSplitExplorer.tsx` — pass `activeId` change signal; progress component
- `ProductListPanel.tsx` — `useEffect` when `activeId` changes → scroll active row into view; denser motion classes
- `ProductMediaPanel.tsx` — dual layer or animated key + caption fade
- `motion.css` — keyframes for explorer fade / progress / reduced-motion kill switch

### Timing constants

```ts
const AUTOPLAY_MS = 3200;
const IMAGE_FADE_MS = 400;
const ROW_SCROLL_BEHAVIOR = "smooth"; // "auto" if reduced-motion
```

---

## Approaches (tradeoffs)

| Approach | Pros | Cons |
|----------|------|------|
| **A. Unique icons + scrollIntoView + image crossfade** (recommended) | Matches screenshot fix + “dynamic scroll”; low risk; keeps 2-col fit | Less flashy than full marquee |
| B. Unique icons + infinite vertical strip marquee | Strong “scroll through” feel | Breaks dense 2-col layout; harder viewport fit |
| C. Icons only, no motion | Fast | Ignores “scroll through n shit” ask |

**Recommend A.**

---

## Out of scope
- New AI images  
- Killing ports  
- Replacing Phosphor with custom SVG set  
- Per-product video  

---

## Tasks (when approved)

### Task 1 — Unique icons
- [ ] Extend `ProductIconName` + `ProductIcon` MAP with: Key, Comics (or BookBookmark), Crown, AppWindow (and PencilLine if tulisan differentiates)
- [ ] Reassign PRODUCT_TYPES icons so all 18 unique
- [ ] Visual check list panel

### Task 2 — Image crossfade
- [ ] ProductMediaPanel: previous/next buffer or opacity transition on `product.id` change
- [ ] Caption fade
- [ ] reduced-motion: no fade

### Task 3 — List track + autoplay progress
- [ ] Row `data-product-id` + ref map; on activeId change scrollIntoView nearest/center
- [ ] Progress bar tied to AUTOPLAY_MS (reset on activate / pause freezes or resets)
- [ ] Pause still freezes advance

### Task 4 — Polish + QA
- [ ] Desktop: autoplay walks all products; icons unique; image changes every step
- [ ] Hover pauses; sticky image remains
- [ ] reduced-motion: no autoplay/scroll animation
- [ ] Section still fits viewport (no huge height regression)
- [ ] `npx tsc --noEmit`

---

## Skills / plugins

| Skill | Use |
|-------|-----|
| `writing-plans` | This doc |
| `hover-interactions` / `ui-animation` | Crossfade, progress, reduced-motion |
| `make-interfaces-feel-better` | Active row chrome |
| Phosphor via `@phosphor-icons/react` | Unique glyphs |
| Playwright | QA cycle + icon uniqueness |
| `subagent-driven-development` | After approve |

---

## Success criteria

1. Screenshot of list: **no two products share the same icon silhouette**.
2. Idle: every ~3s active advances; **list smoothly tracks**; **image changes** (already unique photos).
3. Hover still sticky + pauses cycle.
4. Viewport fit preserved on ~1440×900.
5. `prefers-reduced-motion` respected.

---

## Open micro-choice (defaults locked)

| Topic | Default |
|-------|---------|
| Marquee strip vs scrollIntoView | **scrollIntoView** (keep 2-col) |
| Progress bar | Yes, thin top/bottom of list panel |
| Icon pack | Phosphor only |

**Do not implement until user confirms / says go.**
