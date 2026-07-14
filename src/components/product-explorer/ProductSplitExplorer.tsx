"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getProductById,
  nextProductId,
  productsInFamilyOrder,
} from "@/data/productTypes";
import { useI18n } from "@/i18n";
import { ProductMediaPanel } from "./ProductMediaPanel";
import { ProductListPanel } from "./ProductListPanel";

/** Cycle speed — short enough to notice while reading the section. */
export const AUTOPLAY_MS = 2800;

/**
 * 60/40 product explorer with obvious idle autoplay:
 * image crossfade, active-row pulse, thick progress bar.
 * Hovering a row selects it but does NOT freeze the cycle forever —
 * cycle only pauses while pointer is on a row, resumes on leave.
 */
export function ProductSplitExplorer({ inView }: { inView: boolean }) {
  const { t } = useI18n();
  const sequence = useMemo(() => productsInFamilyOrder(), []);
  const initialId = sequence[0]?.id ?? "link-pembayaran";
  const [activeId, setActiveId] = useState(initialId);
  /** True only while pointer is over a product row (not the whole panel). */
  const [rowHovering, setRowHovering] = useState(false);

  const active = getProductById(activeId) ?? sequence[0];

  // Always autoplay when section is in view — do NOT gate on OS reduced-motion
  // (that made the whole module feel permanently static on many Windows machines).
  // Fancy CSS still respects prefers-reduced-motion in motion.css.
  useEffect(() => {
    if (!inView || rowHovering || sequence.length === 0) return;
    const t = window.setInterval(() => {
      setActiveId((id) => nextProductId(id));
    }, AUTOPLAY_MS);
    return () => window.clearInterval(t);
  }, [inView, rowHovering, sequence.length]);

  if (!active) return null;

  return (
    <div className="product-explorer">
      <div className="grid grid-cols-1 gap-3 lg:h-[min(28rem,calc(100dvh-10.5rem))] lg:grid-cols-[3fr_2fr] lg:items-stretch lg:gap-3 lg:overflow-hidden">
        <ProductMediaPanel product={active} />
        <ProductListPanel
          activeId={activeId}
          onActivate={setActiveId}
          onRowHoverChange={setRowHovering}
          progress={inView && !rowHovering}
          progressMs={AUTOPLAY_MS}
          animateIn={inView}
        />
      </div>
      <p className="sr-only" aria-live="polite">
        {t(`products.types.${active.id}`)}
      </p>
    </div>
  );
}
