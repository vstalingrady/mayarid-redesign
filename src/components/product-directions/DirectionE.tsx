"use client";

import { PRODUCT_TYPES } from "@/data/productTypes";
import { ProductIcon } from "./ProductIcon";
import { SectionHeader } from "./shared";

const BAND: Record<"blue" | "navy" | "pink", string> = {
  blue: "bg-[#2563eb] hover:bg-[#1d4ed8]",
  navy: "bg-[#0f172a] hover:bg-[#1e293b]",
  pink: "bg-[#ec4899] hover:bg-[#db2777]",
};

/** E — Faithful original: color-block bricks + lift hover polish */
export function DirectionE() {
  return (
    <div className="bg-[#f5f7ff] px-5 py-2 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1040px] py-8">
        <SectionHeader />
        <ul className="mt-10 grid list-none grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCT_TYPES.map((p) => (
            <li key={p.id}>
              <a
                href={p.href}
                className={`group flex min-h-[3.35rem] items-center justify-center rounded-xl px-4 py-3.5 text-center text-[14px] font-semibold text-white shadow-sm outline-none transition-[transform,box-shadow,background-color] duration-300 ease-[var(--ease)] hover:-translate-y-1 hover:shadow-[0_14px_28px_-14px_rgb(15_23_42/0.45)] focus-visible:ring-2 focus-visible:ring-blue/50 focus-visible:ring-offset-2 active:scale-[0.98] ${BAND[p.originalBand]}`}
              >
                <span className="inline-flex items-center gap-2">
                  <ProductIcon
                    name={p.icon}
                    size={16}
                    weight="bold"
                    className="opacity-80 transition-transform duration-300 group-hover:scale-110"
                  />
                  {p.label}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
