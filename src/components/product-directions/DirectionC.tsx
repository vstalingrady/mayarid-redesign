"use client";

import { useMemo, useState } from "react";
import {
  FAMILY_LABELS,
  PRODUCT_TYPES,
  type ProductFamily,
} from "@/data/productTypes";
import { ProductIcon } from "./ProductIcon";
import { SectionHeader } from "./shared";

const FILTERS: Array<{ id: "all" | ProductFamily; label: string }> = [
  { id: "all", label: "Semua" },
  { id: "payment", label: FAMILY_LABELS.payment },
  { id: "digital", label: FAMILY_LABELS.digital },
  { id: "live", label: FAMILY_LABELS.live },
  { id: "content", label: FAMILY_LABELS.content },
  { id: "physical", label: FAMILY_LABELS.physical },
  { id: "saas", label: FAMILY_LABELS.saas },
  { id: "fundraise", label: FAMILY_LABELS.fundraise },
];

/** C — Filterable icon grid with live family chips */
export function DirectionC() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");

  const items = useMemo(
    () =>
      filter === "all"
        ? PRODUCT_TYPES
        : PRODUCT_TYPES.filter((p) => p.family === filter),
    [filter],
  );

  return (
    <div className="bg-bg px-5 pb-4 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1040px]">
        <SectionHeader />

        <div
          className="mt-8 flex flex-wrap items-center justify-center gap-2"
          role="tablist"
          aria-label="Filter tipe produk"
        >
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(f.id)}
                className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-[transform,background-color,color,box-shadow] duration-200 ease-[var(--ease)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/40 ${
                  active
                    ? "bg-ink text-white shadow-[0_8px_18px_-10px_rgb(11_18_32/0.45)]"
                    : "bg-white text-ink-soft ring-1 ring-line hover:-translate-y-0.5 hover:text-ink"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-center font-mono text-[11px] tabular-nums text-muted">
          {items.length} tipe
          {filter !== "all" ? ` · ${FAMILY_LABELS[filter]}` : ""}
        </p>

        <ul className="mt-6 grid list-none grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <li key={p.id} className="min-h-0">
              <a
                href={p.href}
                className="dash-card group flex min-h-[3.5rem] items-center gap-3 rounded-xl border border-[#e8edf3] bg-white px-4 py-3.5 outline-none focus-visible:ring-2 focus-visible:ring-blue/40"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink/[0.04] text-ink transition-[background-color,transform] duration-300 group-hover:scale-105 group-hover:bg-blue/[0.1] group-hover:text-blue">
                  <ProductIcon name={p.icon} size={18} weight="duotone" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[14px] font-medium text-ink">
                    {p.label}
                  </span>
                  <span className="block text-[11px] text-muted">
                    {FAMILY_LABELS[p.family]}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
