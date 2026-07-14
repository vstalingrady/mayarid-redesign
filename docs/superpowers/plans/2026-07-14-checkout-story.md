# Checkout Story Implementation Plan

> **For agentic workers:** Implement task-by-task. Steps use checkbox syntax.

**Goal:** Scroll-linked dual-beat checkout story with one shared 3D iPhone 17 Pro Max chassis and HTML screens.

**Architecture:** Sticky pin track + CSS `--story` progress + R3F chassis + HTML screen overlay.

**Tech Stack:** Next.js 16, React 19, three, @react-three/fiber, @react-three/drei, Tailwind v4, existing Mayar tokens.

---

### Task 1: Scroll progress hook
- Create: `src/hooks/useScrollProgress.ts`

### Task 2: Phone chassis (R3F)
- Create: `src/components/checkout-story/IPhoneChassis.tsx`
- Create: `src/components/checkout-story/IPhoneCanvas.tsx` (dynamic-ready)

### Task 3: Screen UIs
- Create: `src/components/checkout-story/BuyerScreen.tsx`
- Create: `src/components/checkout-story/MerchantScreen.tsx`

### Task 4: Story section
- Create: `src/components/checkout-story/CheckoutStorySection.tsx`
- Wire progress → surface, copy, pose, crossfade, toast

### Task 5: Page
- Modify: `src/app/page.tsx` — insert after GoOnlineSection

### Task 6: Motion / reduced-motion CSS helpers if needed
- Modify: `src/app/motion.css` only if new classes required

### Task 7: Manual QA
- Desktop scroll A→B, mobile stack, reduced-motion, Edge
