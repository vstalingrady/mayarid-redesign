# Product Split Explorer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the product-types multi-card bento with a single 60/40 module: left lifestyle image, right product list with icons; hover sets sticky active image; idle auto-cycles product-by-product.

**Architecture:** Client `ProductSplitExplorer` owns `activeId` + `paused` + in-view autoplay. `ProductMediaPanel` crossfades family images; `ProductListPanel` renders grouped rows with `ProductIcon`. Data stays in `productTypes.ts` with small helpers. No motion libraries.

**Tech Stack:** Next.js 16 App Router, React 19 client components, `next/image`, Tailwind v4, `@phosphor-icons/react` (existing `ProductIcon`), existing family JPGs under `public/specimen/products/`.

**Spec:** `docs/superpowers/specs/2026-07-14-product-split-explorer-design.md`

**Constraints:** Do **not** kill ports / `taskkill` Next. Use existing localhost. Favicon work is out of scope.

---

## Skills & plugins required

### Superpowers (process)
| Skill | When |
|-------|------|
| `brainstorming` | Design locked (this pass) |
| `writing-plans` | This document |
| `executing-plans` **or** `subagent-driven-development` | After user approves plan |
| `verification-before-completion` | Before claiming done |
| `test-driven-development` | Optional for pure UI; prefer behavior smoke over heavy unit tests |
| `requesting-code-review` | After implementation chunk |

### Design / frontend
| Skill | When |
|-------|------|
| `make-interfaces-feel-better` | Spacing, active row, image scrim |
| `design-taste-frontend` | Module chrome vs cream page |
| `hover-interactions` | Sticky hover + highlight states |
| `ui-animation` | Crossfade timing, reduced-motion |
| `vercel-react-best-practices` | Client boundary, image sizes, avoid layout thrash |
| `accessibility-a11y` | Focus, aria-current, live region, reduced motion |

### Project / agents
| Agent or skill | When |
|----------------|------|
| `react-reviewer` / `typescript-reviewer` | After TSX changes |
| `cavecrew` (optional) | Surgical 1–2 file edits |
| `webapp-testing` or Playwright MCP | Manual-ish browser QA of hover + cycle |
| Chrome DevTools / Playwright MCP | Live localhost verification |

### Not needed
- imagegen skills (assets exist)
- Supabase / auth / backend
- Favicon rebuild scripts
- Port managers / process killers

---

## File map

| Path | Action |
|------|--------|
| `src/data/productTypes.ts` | Add helpers: `productsInFamilyOrder`, `nextProductId`, `getProductById` |
| `src/components/product-explorer/ProductSplitExplorer.tsx` | **Create** — state + layout shell |
| `src/components/product-explorer/ProductMediaPanel.tsx` | **Create** — left 60% image |
| `src/components/product-explorer/ProductListPanel.tsx` | **Create** — right 40% list |
| `src/components/ProductTypesSection.tsx` | **Rewrite** — header + mount explorer only |
| `src/components/product-directions/ProductIcon.tsx` | Reuse (import path only) |
| `src/app/globals.css` or `motion.css` | Optional reduced-motion hooks for explorer classes |

---

### Task 1: Data helpers

**Files:**
- Modify: `src/data/productTypes.ts`

- [ ] **Step 1: Add helpers after `FAMILY_ORDER` / images**

```ts
/** Flatten products in FAMILY_ORDER for list + autoplay sequence. */
export function productsInFamilyOrder(): ProductType[] {
  return FAMILY_ORDER.flatMap((family) =>
    PRODUCT_TYPES.filter((p) => p.family === family),
  );
}

export function getProductById(id: string): ProductType | undefined {
  return PRODUCT_TYPES.find((p) => p.id === id);
}

export function nextProductId(currentId: string): string {
  const list = productsInFamilyOrder();
  if (list.length === 0) return currentId;
  const idx = list.findIndex((p) => p.id === currentId);
  const next = list[(idx + 1) % list.length];
  return next?.id ?? list[0]!.id;
}
```

- [ ] **Step 2: Quick node smoke (optional)**

```bash
npx tsx -e "import { productsInFamilyOrder, nextProductId } from './src/data/productTypes.ts'; const a=productsInFamilyOrder(); console.log(a.length, a[0].id, nextProductId(a[0].id));"
```

Expected: length ≥ 15, next id is second product in family order.

- [ ] **Step 3: Commit** (if user wants commits mid-plan)

```bash
git add src/data/productTypes.ts
git commit -m "feat: product list order helpers for split explorer"
```

---

### Task 2: ProductMediaPanel

**Files:**
- Create: `src/components/product-explorer/ProductMediaPanel.tsx`

- [ ] **Step 1: Implement left media with dual-buffer crossfade**

```tsx
"use client";

import Image from "next/image";
import { FAMILY_IMAGE_ALT, FAMILY_IMAGES, type ProductType } from "@/data/productTypes";

type Props = {
  product: ProductType;
};

export function ProductMediaPanel({ product }: Props) {
  const family = product.family;
  return (
    <div className="product-explorer-media relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-line/70 bg-white/30 lg:aspect-auto lg:min-h-[420px] lg:h-full">
      <Image
        key={family}
        src={FAMILY_IMAGES[family]}
        alt={FAMILY_IMAGE_ALT[family]}
        fill
        sizes="(max-width: 1024px) 100vw, 60vw"
        className="object-cover animate-[fadeIn_0.45s_ease]"
        priority={false}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/55 to-transparent px-4 pb-4 pt-12">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-white/80">
          {product.family}
        </p>
        <p className="text-[15px] font-semibold text-white sm:text-base">{product.label}</p>
      </div>
    </div>
  );
}
```

Note: If CSS keyframe `fadeIn` missing, add to `motion.css` or use Tailwind `transition-opacity` dual layer in Task 3 polish.

- [ ] **Step 2: Visual check** — mount temporarily or wait for Task 4.

---

### Task 3: ProductListPanel

**Files:**
- Create: `src/components/product-explorer/ProductListPanel.tsx`

- [ ] **Step 1: Grouped list with icons + hover/focus callbacks**

```tsx
"use client";

import {
  FAMILY_LABELS,
  FAMILY_ORDER,
  PRODUCT_TYPES,
  type ProductType,
} from "@/data/productTypes";
import { ProductIcon } from "@/components/product-directions/ProductIcon";

type Props = {
  activeId: string;
  onActivate: (id: string) => void;
  onPause: (paused: boolean) => void;
};

export function ProductListPanel({ activeId, onActivate, onPause }: Props) {
  return (
    <div
      className="product-explorer-list h-full overflow-y-auto rounded-2xl border border-line/70 bg-white/40 px-3 py-3 sm:px-4 sm:py-4"
      onMouseLeave={() => onPause(false)}
      onMouseEnter={() => onPause(true)}
      onFocusCapture={() => onPause(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          onPause(false);
        }
      }}
    >
      <ul className="flex list-none flex-col gap-4">
        {FAMILY_ORDER.map((family) => {
          const items = PRODUCT_TYPES.filter((p) => p.family === family);
          if (items.length === 0) return null;
          return (
            <li key={family}>
              <p className="mb-1.5 px-2 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                {FAMILY_LABELS[family]}
              </p>
              <ul className="flex list-none flex-col gap-0.5">
                {items.map((p) => (
                  <ProductRow
                    key={p.id}
                    product={p}
                    active={p.id === activeId}
                    onActivate={onActivate}
                  />
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ProductRow({
  product,
  active,
  onActivate,
}: {
  product: ProductType;
  active: boolean;
  onActivate: (id: string) => void;
}) {
  return (
    <li>
      <a
        href={product.href}
        aria-current={active ? "true" : undefined}
        onMouseEnter={() => onActivate(product.id)}
        onFocus={() => onActivate(product.id)}
        className={
          active
            ? "flex items-center gap-2.5 rounded-xl bg-blue/[0.07] px-2.5 py-2 text-blue outline-none ring-0"
            : "flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-ink outline-none transition-colors hover:bg-ink/[0.04] focus-visible:ring-2 focus-visible:ring-blue/35"
        }
      >
        <ProductIcon
          name={product.icon}
          size={18}
          weight={active ? "fill" : "regular"}
          className="shrink-0 opacity-90"
        />
        <span className="text-[13.5px] font-medium leading-snug sm:text-[14px]">
          {product.label}
        </span>
      </a>
    </li>
  );
}
```

**Pause semantics:** Entering the list panel pauses autoplay; leaving resumes. Row hover only changes `activeId` (sticky). Matches “unhover keeps image; cycle when idle.”

---

### Task 4: ProductSplitExplorer + wire section

**Files:**
- Create: `src/components/product-explorer/ProductSplitExplorer.tsx`
- Modify: `src/components/ProductTypesSection.tsx`

- [ ] **Step 1: Explorer shell with autoplay**

```tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getProductById,
  nextProductId,
  productsInFamilyOrder,
} from "@/data/productTypes";
import { ProductMediaPanel } from "./ProductMediaPanel";
import { ProductListPanel } from "./ProductListPanel";

const AUTOPLAY_MS = 3500;

export function ProductSplitExplorer({ inView }: { inView: boolean }) {
  const sequence = useMemo(() => productsInFamilyOrder(), []);
  const initialId = sequence[0]?.id ?? "link-pembayaran";
  const [activeId, setActiveId] = useState(initialId);
  const [paused, setPaused] = useState(false);

  const active = getProductById(activeId) ?? sequence[0]!;

  useEffect(() => {
    if (!inView || paused) return;
    if (typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const t = window.setInterval(() => {
      setActiveId((id) => nextProductId(id));
    }, AUTOPLAY_MS);
    return () => window.clearInterval(t);
  }, [inView, paused]);

  return (
    <div className="product-explorer grid grid-cols-1 gap-3 lg:grid-cols-[3fr_2fr] lg:gap-4 lg:items-stretch">
      <ProductMediaPanel product={active} />
      <ProductListPanel
        activeId={activeId}
        onActivate={setActiveId}
        onPause={setPaused}
      />
    </div>
  );
}
```

- [ ] **Step 2: Rewrite `ProductTypesSection` to keep header + inView, drop bento cells**

Keep existing `useInView` / `FadeIn` / `SECTION_COPY` header. Replace grid of `FamilyBentoCell` with:

```tsx
<FadeIn active={inView} delay={120}>
  <ProductSplitExplorer inView={inView} />
</FadeIn>
```

Remove unused `FAMILY_TINT`, `FAMILY_SPAN`, cell helpers.

- [ ] **Step 3: Typecheck**

```bash
npx tsc --noEmit
```

Expected: clean.

---

### Task 5: Motion + reduced-motion polish

**Files:**
- Modify: `src/app/motion.css` (or `globals.css`)
- Possibly media panel dual-buffer if single-key flash is ugly

- [ ] **Step 1: Add fade utility if needed**

```css
@keyframes product-explorer-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
.product-explorer-media img {
  animation: product-explorer-fade 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}
@media (prefers-reduced-motion: reduce) {
  .product-explorer-media img {
    animation: none;
  }
}
```

- [ ] **Step 2: Optional — skip image remount when family unchanged**

In media panel, only change `Image` when `product.family` changes; update caption text always. Reduces flicker when cycling Kelas Online → Webinar.

---

### Task 6: Browser QA (existing localhost)

**Do not kill ports.**

- [ ] Open `http://localhost:3000` hard-refresh.
- [ ] Confirm 60/40 on desktop; image left, list right with icons.
- [ ] Hover “E-Book” → content image; move mouse away → image **stays**.
- [ ] Wait ~4s idle → highlight advances; image updates on family change.
- [ ] Hover list → cycle pauses; leave list → cycle resumes from current.
- [ ] Tab through rows → active updates; focus leave resumes cycle.
- [ ] Mobile width: stacked image then list; tap works.
- [ ] OS reduced-motion: no autoplay.

---

### Task 7: Review + handoff

- [ ] Run react/typescript review on changed files.
- [ ] Update `docs/HANDOFF-product-bento-favicon.md` or new handoff note: bento replaced by split explorer.
- [ ] Commit if requested:

```bash
git add src/data/productTypes.ts src/components/ProductTypesSection.tsx src/components/product-explorer src/app/motion.css docs/superpowers
git commit -m "feat: product split explorer with sticky hover and autoplay"
```

---

## Self-review (plan vs spec)

| Spec requirement | Task |
|------------------|------|
| 60/40 layout | Task 4 |
| Icons on list | Task 3 |
| Hover → left image | Tasks 3–4 |
| Sticky after unhover | Task 3 pause leave keeps activeId |
| Auto cycle one-by-one | Task 4 interval |
| Family images v1 | Task 2 |
| Reduced motion | Tasks 4–5 |
| No port kill | Task 6 note |
| Header unchanged | Task 4 section rewrite |

**Placeholders:** none intentional.  
**Type names:** `activeId`, `onActivate`, `onPause`, `productsInFamilyOrder`, `nextProductId` consistent across tasks.

---

## Execution handoff

After user approves this plan:

1. **Subagent-driven (recommended)** — one task per subagent, review between.
2. **Inline** — execute in this session with checkpoints.

Do not start coding until user says **confirm / go / implement**.
