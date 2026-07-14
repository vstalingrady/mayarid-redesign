# Handoff: Stage section animations not visible

**Date:** 2026-07-14  
**Status:** FIXED (2026-07-14) — root cause was Windows `prefers-reduced-motion: reduce` hard-killing continuous CSS in `motion.css` / `globals.css`. Softened policy so specimen float/kenburns/shine/entrances keep running (same portfolio-demo stance as FloatingIsland JS bob). Checkout story no longer swaps to StaticStack under reduced-motion.

**Priority:** High — user reports product cycle + ambient motion are fully static  
**Repo:** `C:\Users\vstal\mayarid` (Next.js 16 App Router, Turbopack)

---

## Problem (user-facing)

On **Go Online**, **Integrations**, and **Marketing** sections:

- Content **does** auto-cycle (tabs change product / cluster / campaign) — or at least was intended to
- **Visual animations do not show** — no float, fade-in, ken burns, toast spring, progress (progress line since removed), shine, etc.
- Other page animations **work fine** (hero `.m-enter`, FeaturesGraph, dashboard, etc.)
- Hard refresh + dev server restart did **not** fix it → treat as a **code** issue, not cache

User wants **continuous** motion while the stage is on screen (not one-shot only, not static cards).

---

## Affected sections / files

| Section | Component | Route id |
|---------|-----------|----------|
| Hemat Waktu · Go Online 2 Menit | `src/components/GoOnlineSection.tsx` | `#go-online` |
| Integrasi (payments/logistics/apps) | `src/components/IntegrationsSection.tsx` | `#integrasi` |
| Marketing built-in | `src/components/MarketingSection.tsx` | `#marketing` |

**Wired in:** `src/app/page.tsx`  
```
ProductDashboard → ProductTypesSection → GoOnlineSection → IntegrationsSection → MarketingSection → FeaturesCloudSection
```

**Keyframe names (globals):** `src/app/globals.css` — search for `goOnlineFadeUp`, `goOnlineFloat`, `goOnlineKenBurns`, `goOnlineShine`, `goOnlineToastIn`, `goOnlineCheckPop`, `goOnlineFlow`, `goOnlineHubGlow`, plus older `go-online-*` / `integrations-*` class-based rules (many may be dead).

**Motion system that *does* work:**  
- `src/components/MotionReady.tsx` — toggles `motion-ready` / `motion-pending`, IO on `.m-enter`  
- `src/app/motion.css` — `.motion-ready .m-enter.in-view` entrance animations  

These stage sections **do not** use the `.m-enter` system. They use custom IntersectionObserver + inline `style={{ animation: "…" }}`.

---

## What previous agent tried (and may still be wrong)

1. CSS classes for animations → cascade fights when two classes both set `animation` (later rule wins, kills infinite loops).
2. Switched to **inline** `style={{ animation: \`goOnlineFadeUp 0.5s …\` }}` + remount `key={item.id + cycleTick}` so cycles re-fire.
3. Keyframes added to `globals.css` under camelCase names (`goOnlineFadeUp`, etc.).
4. Autoplay via `setInterval` when `inView`; ambient motion gated by `seen` / `live`.
5. Removed pill progress underline (user request) — not the animation bug.
6. Fixed hydration by not reading `window.matchMedia` during render (reduceMotion via useEffect).

**User still reports static UI** after that rewrite. Do not assume “just hard refresh.”

---

## Likely root causes to verify first

### 1. `prefers-reduced-motion: reduce` (very common on Windows)
Check OS / browser accessibility setting. There is a large block in `globals.css`:

```css
@media (prefers-reduced-motion: reduce) {
  .go-online-*, .integrations-*, .wa-fab { animation: none !important; }
}
```

**But** Go Online / Integrations now use **inline** animation styles, which that media query **does not** target (it only lists class selectors). So reduced-motion alone may **not** kill inline animations unless something else does.

Still verify in DevTools: `window.matchMedia('(prefers-reduced-motion: reduce)').matches`.

### 2. Inline animation string + missing keyframes
In DevTools → select a node with `style.animation` set → Computed → Animation. Confirm keyframes exist and are not `none`.

If animation name is misspelled vs `globals.css`, animation is a no-op (static).

### 3. `inView` never true / autoplay not running
IO threshold / rootMargin may leave `inView` false. Then:
- Interval never starts (no product change)
- Or `live`/`seen` wrong for ambient styles

**Check:** scroll to `#go-online`, log `inView`/`seen`/`index` every second.

### 4. Interval self-restart bug
Pattern used:

```ts
useEffect(() => {
  if (!inView) return;
  const t = setInterval(() => {
    setIndex(...);
    setCycleTick(n => n + 1);
  }, CYCLE_MS);
  return () => clearInterval(t);
}, [inView, cycleTick]); // cycleTick in deps restarts interval every cycle
```

This can make timing weird but should still **change** content. If content is also static, interval or state is broken.

### 5. Float / transform cancelled by parent
Parent may set `transform` / `opacity` via entrance animation `both` and freeze children, or `overflow-hidden` clipping float. Unlikely to kill **all** fades.

### 6. Tailwind / PostCSS not the issue
Keyframes live in plain `globals.css` (`@import "tailwindcss"` at top). Custom `@keyframes goOnline*` should not be purged. Confirm file is imported from `layout.tsx` via `./globals.css`.

### 7. Best path forward (recommended)
**Stop inventing a third CSS system.** Align with what already works:

1. **Entrance:** use `m-enter` + MotionReady IO (`in-view`), same as hero.
2. **Cycle transitions:** React state + CSS **transitions** (opacity/transform), not one-shot keyframes that must remount:
   ```tsx
   className={cn("transition-all duration-500", visible ? "opacity-100" : "opacity-0")}
   ```
   Crossfade with dual layers or `AnimatePresence`-style double buffer if needed (no framer required — simple opacity swap).
3. **Ambient continuous:** single CSS class with **one** infinite animation (float) on the card shell only:
   ```css
   .stage-float { animation: goOnlineFloat 5s ease-in-out infinite; }
   ```
4. **Toast:** permanent mount + CSS transition on content change; optional subtle float class.

This matches FeaturesGraph / dashboard patterns (state-driven, not fragile keyframe remounts).

---

## Expected behavior (acceptance)

### Go Online (`#go-online`)
- [ ] On scroll into view: copy + stage fade/slide in
- [ ] Every ~4s: product changes (title, price, image, stats, toast CTA) with **visible** fade
- [ ] While on screen: stage card **soft float**; CTA shine optional
- [ ] Toast stays fixed size (already locked); content updates without layout jump
- [ ] Pills show active state only (no progress line under pills)

### Integrations (`#integrasi`)
- [ ] Clusters auto-cycle; active logos full opacity, inactive dim (transition, not remount thrash)
- [ ] Mayar↔Zapier flow dot or pulse visible while live
- [ ] Toast content updates with fade; fixed size

### Marketing (`#marketing`)
- [ ] Campaign cycle + email preview fade
- [ ] Toast updates; fixed size
- [ ] Same float/entrance language as above

### Non-goals
- Do not re-add progress underline under pills
- Do not break hydration (`window` only in `useEffect`)
- Do not kill working hero/dashboard/features motion

---

## Debug checklist (do this first)

```text
1. Open http://localhost:3000/#go-online (hard refresh)
2. DevTools Console:
   matchMedia('(prefers-reduced-motion: reduce)').matches
3. Elements: pick storefront card → Styles → look for animation / animation-name
4. If animation-name is none or missing keyframes → fix CSS name registration
5. React DevTools / console log index every 4s — is autoplay running?
6. Compare to a working .m-enter element on hero — what differs?
```

Optional one-liner after mount:

```js
document.querySelectorAll('#go-online [style*="animation"]').length
// should be > 0 if inline styles applied
getComputedStyle(document.querySelector('#go-online h2')).animationName
```

---

## Assets / content (don’t re-fetch unless needed)

- Go Online images: `public/specimen/go-online/*.jpg`
- Integration logos: `public/specimen/integrations/*` (mix of SVG Simple Icons + PNG favicons)
- Marketing: `public/specimen/marketing/labor-day.jpg`, `promo-club.jpg`, `promo-webinar.jpg`

---

## Suggested implementation plan (for next agent)

1. **Reproduce** — confirm static UI + whether `index` cycles.
2. **Minimal proof** — on Go Online card shell only, add:
   ```tsx
   className="animate-[goOnlineFloat_5s_ease-in-out_infinite]"
   ```
   or a dedicated class in `globals.css`. If that still doesn’t move, problem is global CSS load / reduced-motion / browser.
3. **If float works but cycle fades don’t** — remount keys are fine; fix cycle with dual-buffer opacity transition.
4. **Unify** three sections on one small helper, e.g. `useStageCycle(items, ms)` + `StageShell` with float + fixed toast slot.
5. **Delete dead CSS** — old `.go-online-swap`, `.go-online-cycle`, duplicate integrations toast classes that nothing uses (after verifying).
6. **Manual QA** on 1440×900, reduced-motion on/off, scroll away/back.

---

## User tone / constraints

- Frustrated that animations “literally do not show”
- Context was bloated; **this file is the source of truth** for the next session
- Prefer working continuous motion over clever remount keyframe systems
- Keep layout fixed sizes already applied (title/blurb/toast locked heights)

---

## Quick file map

```
src/app/page.tsx
src/app/globals.css          ← goOnline* keyframes + dead go-online-* classes
src/app/motion.css           ← working m-enter system
src/components/MotionReady.tsx
src/components/GoOnlineSection.tsx
src/components/IntegrationsSection.tsx
src/components/MarketingSection.tsx
src/data/integrations.ts
public/specimen/go-online/
public/specimen/integrations/
public/specimen/marketing/
```

**Start here:** `#go-online` float on card shell + prove autoplay with a console log. Then fix cycle fades. Then mirror to Integrations + Marketing.
