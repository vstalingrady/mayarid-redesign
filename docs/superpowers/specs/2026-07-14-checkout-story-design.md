# Design: Checkout Story (shared iPhone 17 Pro Max)

**Date:** 2026-07-14  
**Status:** Approved  
**Placement:** After `GoOnlineSection`, before `IntegrationsSection`

## Goal

One continuous marketing story with a **single** iPhone 17 Pro Max–class device (Dynamic Island) that connects two specimen beats:

1. **Buyer** – light surface, phone left, 1-click checkout UI + toast, copy right  
2. **Merchant** – navy surface, copy left + feature list, phone right, merchant dashboard UI  

Scroll progress drives surface, layout, phone pose, and screen crossfade.

## Architecture

```
CheckoutStorySection (client)
├── scroll track ~200vh (desktop sticky pin)
├── StageSurface (cream → navy via --story progress)
├── sticky stage (100dvh)
│   ├── CopyBuyer / CopyMerchant (opacity by progress)
│   ├── PhoneStage (CSS transform pose + R3F chassis)
│   │   ├── Canvas → IPhoneChassis (frame, island, glass lip)
│   │   └── ScreenHtml (BuyerScreen | MerchantScreen crossfade)
│   └── BuyerToast (beat A only)
└── mobile: stack A then B, no pin
```

## Tech

- `three` + `@react-three/fiber` + `@react-three/drei` for chassis only  
- Scroll progress: rAF + `getBoundingClientRect` on track (no React state per frame)  
- CSS variables `--story` (0–1) for opacity/pose  
- Dynamic import canvas `ssr: false`  
- `prefers-reduced-motion`: static stack A→B  

## Content (specimen-faithful)

### Beat A
- Eyebrow: CHECKOUT SUPER CEPAT  
- Title: Konversi Meningkat dengan Teknologi 1-Click Checkout  
- Body: 1-Click Checkout auto-fill copy (specimen)  
- Screen: Azmya contact, address, SiCepat, payment methods, totals, BAYAR  
- Toast: Data diri dan alamat berhasil terisi otomatis / Bayar Sekarang Juga  

### Beat B
- Title: Dimanapun anda berada… dengan cara baru. (blue on last phrase)  
- Body: 1-click + buyer network  
- List: Buy Button, 1-Click Checkout, Custom Checkout Domain, Embeddable Checkout  
- Screen: balance card, actions, heatmap, tabs  

## Non-goals

Real payments, AR, CAD phone model, GSAP+Motion mix in one tree.

## Success

One phone identity; clear A→B scroll link; Edge/reduced-motion readable; no LCP regression.
