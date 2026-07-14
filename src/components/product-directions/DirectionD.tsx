"use client";

import { useRef } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { PRODUCT_TYPES } from "@/data/productTypes";
import { ProductIcon } from "./ProductIcon";
import { SectionHeader } from "./shared";

/** D — Horizontal coverflow / scroll-snap strip */
export function DirectionD() {
  const trackRef = useRef<HTMLUListElement>(null);

  const scrollBy = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({
      left: dir * Math.min(320, el.clientWidth * 0.7),
      behavior: "smooth",
    });
  };

  return (
    <div className="bg-bg pb-4">
      <div className="px-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1040px]">
          <SectionHeader />
          <div className="mt-8 flex items-center justify-between gap-3">
            <p className="text-[13px] text-muted">
              Geser untuk jelajahi semua tipe
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => scrollBy(-1)}
                aria-label="Sebelumnya"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ink transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-ink/[0.03] focus-visible:ring-2 focus-visible:ring-blue/40"
              >
                <CaretLeft size={16} weight="bold" />
              </button>
              <button
                type="button"
                onClick={() => scrollBy(1)}
                aria-label="Berikutnya"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ink transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-ink/[0.03] focus-visible:ring-2 focus-visible:ring-blue/40"
              >
                <CaretRight size={16} weight="bold" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <ul
        ref={trackRef}
        className="mt-5 flex list-none gap-3 overflow-x-auto scroll-smooth px-5 pb-4 pt-1 [scrollbar-width:none] sm:px-8 lg:px-10 [&::-webkit-scrollbar]:hidden"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {PRODUCT_TYPES.map((p, i) => (
          <li
            key={p.id}
            className="w-[min(72vw,16.5rem)] shrink-0"
            style={{ scrollSnapAlign: "start" }}
          >
            <a
              href={p.href}
              className="dash-card group relative flex h-[11.5rem] flex-col justify-between overflow-hidden rounded-2xl border border-[#e8edf3] bg-white p-5 outline-none focus-visible:ring-2 focus-visible:ring-blue/40"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue/[0.08] text-blue transition-transform duration-300 group-hover:scale-110">
                  <ProductIcon name={p.icon} size={22} weight="duotone" />
                </span>
                <span className="font-mono text-[10px] tabular-nums text-muted-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div>
                <p className="text-[1.05rem] font-semibold tracking-tight text-ink">
                  {p.label}
                </p>
                <p className="mt-1 text-[12px] text-muted">
                  Siap dijual di Mayar
                </p>
              </div>
              <span
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-blue transition-transform duration-300 ease-[var(--ease)] group-hover:scale-x-100"
                aria-hidden
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
