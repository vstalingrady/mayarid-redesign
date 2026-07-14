"use client";

import {
  FAMILY_ORDER,
  PRODUCT_TYPES,
  type ProductType,
} from "@/data/productTypes";
import { ProductIcon } from "@/components/product-directions/ProductIcon";
import { useI18n } from "@/i18n";

type Props = {
  activeId: string;
  onActivate: (id: string) => void;
  /** Pause autoplay only while a row is hovered (not the whole panel). */
  onRowHoverChange: (hovering: boolean) => void;
  progress: boolean;
  progressMs: number;
  animateIn: boolean;
};

/**
 * Right list — unique icons, strong active pulse, visible progress,
 * staggered entrance. Autoplay keeps running unless a row is hovered.
 */
export function ProductListPanel({
  activeId,
  onActivate,
  onRowHoverChange,
  progress,
  progressMs,
  animateIn,
}: Props) {
  const { t } = useI18n();
  let rowIndex = 0;

  return (
    <div className="product-explorer-list relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-line/70 bg-white/50 shadow-[0_8px_28px_-20px_rgb(11_18_32/0.2)]">
      {/* Thick, obvious progress bar */}
      <div
        className="h-1 w-full shrink-0 overflow-hidden bg-ink/[0.08]"
        aria-hidden
      >
        {progress ? (
          <div
            key={activeId}
            className="product-explorer-progress h-full rounded-r-full bg-blue"
            style={{ animationDuration: `${progressMs}ms` }}
          />
        ) : (
          <div className="h-full w-0 bg-blue" />
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-2 sm:px-2.5 sm:py-2.5">
        <ul className="grid list-none grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-2 lg:auto-rows-min lg:content-start lg:gap-x-2.5 lg:gap-y-1.5">
          {FAMILY_ORDER.map((family) => {
            const items = PRODUCT_TYPES.filter((p) => p.family === family);
            if (items.length === 0) return null;
            return (
              <li key={family} className="min-w-0">
                <p className="mb-0.5 px-1 font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-muted">
                  {t(`products.families.${family}`)}
                </p>
                <ul className="flex list-none flex-col gap-px">
                  {items.map((p) => {
                    const i = rowIndex++;
                    return (
                      <ProductRow
                        key={p.id}
                        product={p}
                        label={t(`products.types.${p.id}`)}
                        active={p.id === activeId}
                        onActivate={onActivate}
                        onRowHoverChange={onRowHoverChange}
                        animateIn={animateIn}
                        delayMs={80 + i * 35}
                      />
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function ProductRow({
  product,
  label,
  active,
  onActivate,
  onRowHoverChange,
  animateIn,
  delayMs,
}: {
  product: ProductType;
  label: string;
  active: boolean;
  onActivate: (id: string) => void;
  onRowHoverChange: (hovering: boolean) => void;
  animateIn: boolean;
  delayMs: number;
}) {
  return (
    <li
      style={{
        transitionDelay: animateIn ? `${delayMs}ms` : "0ms",
      }}
      className={`transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        animateIn ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
    >
      <a
        href={product.href}
        data-product-id={product.id}
        aria-current={active ? "true" : undefined}
        onMouseEnter={() => {
          onActivate(product.id);
          onRowHoverChange(true);
        }}
        onMouseLeave={() => onRowHoverChange(false)}
        onFocus={() => {
          onActivate(product.id);
          onRowHoverChange(true);
        }}
        onBlur={() => onRowHoverChange(false)}
        className={
          active
            ? "product-explorer-row-active flex items-center gap-1.5 rounded-md bg-blue/[0.12] px-1.5 py-1 text-blue outline-none ring-0 transition-[background-color,color,box-shadow,transform] duration-300 focus-visible:ring-2 focus-visible:ring-blue/35 sm:px-2 sm:py-1"
            : "flex items-center gap-1.5 rounded-md px-1.5 py-1 text-ink outline-none transition-[background-color,color,transform] duration-200 hover:bg-ink/[0.04] focus-visible:ring-2 focus-visible:ring-blue/35 sm:px-2 sm:py-1"
        }
      >
        <ProductIcon
          name={product.icon}
          size={15}
          weight={active ? "fill" : "regular"}
          className={`shrink-0 transition-transform duration-300 ${
            active ? "scale-110 opacity-100" : "opacity-80"
          }`}
        />
        <span className="truncate text-[12px] font-medium leading-tight sm:text-[13px]">
          {label}
        </span>
      </a>
    </li>
  );
}
