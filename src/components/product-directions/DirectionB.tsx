"use client";

import {
  FAMILY_LABELS,
  PRODUCT_TYPES,
  type ProductFamily,
} from "@/data/productTypes";
import { ProductIcon } from "./ProductIcon";
import { SectionHeader } from "./shared";

const FAMILY_ORDER: ProductFamily[] = [
  "payment",
  "physical",
  "digital",
  "live",
  "content",
  "saas",
  "fundraise",
];

const FAMILY_TINT: Record<ProductFamily, string> = {
  payment: "bg-blue/[0.06]",
  physical: "bg-amber-500/[0.06]",
  digital: "bg-violet-500/[0.06]",
  live: "bg-emerald-500/[0.06]",
  content: "bg-rose-500/[0.06]",
  saas: "bg-sky-500/[0.06]",
  fundraise: "bg-pink-500/[0.07]",
};

/** B — Grouped bento: family clusters, hero payment tile, soft tints */
export function DirectionB() {
  const byFamily = FAMILY_ORDER.map((family) => ({
    family,
    items: PRODUCT_TYPES.filter((p) => p.family === family),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="bg-bg px-5 pb-4 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1040px]">
        <SectionHeader />
        <div className="mt-10 grid grid-cols-1 gap-3 lg:grid-cols-12">
          {PRODUCT_TYPES.filter((p) => p.id === "link-pembayaran").map((p) => (
            <a
              key={p.id}
              href={p.href}
              className="dash-card group relative flex min-h-[140px] flex-col justify-between overflow-hidden rounded-2xl border border-blue/15 bg-gradient-to-br from-blue to-blue-deep p-5 text-white shadow-[0_20px_40px_-24px_rgb(37_99_235/0.55)] outline-none focus-visible:ring-2 focus-visible:ring-blue/50 lg:col-span-5 lg:row-span-2"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                <ProductIcon name={p.icon} size={22} weight="fill" />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/70">
                  Paling sering dipakai
                </p>
                <p className="mt-1 text-[1.25rem] font-bold tracking-tight">
                  {p.label}
                </p>
                <p className="mt-1 max-w-[28ch] text-[13px] text-white/75">
                  Satu link untuk terima bayaran dari mana saja.
                </p>
              </div>
            </a>
          ))}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-7">
            {byFamily
              .filter((g) => g.family !== "payment")
              .map(({ family, items }) => (
                <div
                  key={family}
                  className={`rounded-2xl border border-line/80 p-3.5 ${FAMILY_TINT[family]}`}
                >
                  <p className="mb-2.5 px-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                    {FAMILY_LABELS[family]}
                  </p>
                  <ul className="flex list-none flex-col gap-1.5">
                    {items.map((p) => (
                      <li key={p.id}>
                        <a
                          href={p.href}
                          className="group flex items-center gap-2.5 rounded-xl border border-white/80 bg-white/90 px-3 py-2.5 shadow-[0_1px_0_rgb(15_23_42/0.03)] outline-none transition-[transform,box-shadow] duration-300 ease-[var(--ease)] hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-14px_rgb(11_18_32/0.2)] focus-visible:ring-2 focus-visible:ring-blue/40"
                        >
                          <ProductIcon
                            name={p.icon}
                            size={16}
                            weight="duotone"
                            className="shrink-0 text-ink-soft transition-transform duration-300 group-hover:scale-110"
                          />
                          <span className="truncate text-[13px] font-medium text-ink">
                            {p.label}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
