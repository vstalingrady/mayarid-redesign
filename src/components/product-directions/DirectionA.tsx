"use client";

import { PRODUCT_TYPES } from "@/data/productTypes";
import { ProductIcon } from "./ProductIcon";
import { SectionHeader } from "./shared";

/** A — Specimen glass chips: cream/white cards, icons, dashboard-style hover lift */
export function DirectionA() {
  return (
    <div className="bg-bg px-5 pb-4 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1040px]">
        <SectionHeader />
        <ul className="mt-10 grid list-none grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCT_TYPES.map((p) => (
            <li key={p.id}>
              <a
                href={p.href}
                className="dash-card group flex min-h-[3.25rem] items-center gap-3 rounded-xl border border-[#e8edf3] bg-white px-4 py-3.5 outline-none focus-visible:ring-2 focus-visible:ring-blue/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue/[0.08] text-blue transition-transform duration-300 ease-[var(--ease)] group-hover:scale-105">
                  <ProductIcon name={p.icon} size={18} weight="duotone" />
                </span>
                <span className="min-w-0 text-[14px] font-medium tracking-tight text-ink">
                  {p.label}
                </span>
              </a>
            </li>
          ))}
          <li className="sm:col-span-2 lg:col-span-3">
            <a
              href="#"
              className="dash-card flex min-h-[3.25rem] items-center justify-center rounded-xl border border-dashed border-line bg-transparent px-4 py-3.5 text-[13px] font-semibold text-blue outline-none focus-visible:ring-2 focus-visible:ring-blue/40"
            >
              + Semua tipe produk
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
