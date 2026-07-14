import type { ReactNode } from "react";
import { SECTION_COPY } from "@/data/productTypes";

export function SectionHeader({
  className = "",
  light = false,
}: {
  className?: string;
  light?: boolean;
}) {
  return (
    <div className={`mx-auto max-w-2xl text-center ${className}`}>
      <p
        className={`specimen-label text-[10px] tracking-[0.16em] ${
          light ? "text-white/55" : "text-muted"
        }`}
      >
        {SECTION_COPY.eyebrow}
      </p>
      <h2
        className={`mt-3 text-balance text-[1.65rem] font-bold tracking-tight sm:text-3xl lg:text-[2.15rem] ${
          light ? "text-white" : "text-ink"
        }`}
      >
        {SECTION_COPY.title}
      </h2>
      <p
        className={`mx-auto mt-3 max-w-[48ch] text-pretty text-[14px] leading-relaxed sm:text-[15px] ${
          light ? "text-white/65" : "text-muted"
        }`}
      >
        {SECTION_COPY.subtitle}
      </p>
    </div>
  );
}

export function DirectionFrame({
  id,
  letter,
  name,
  blurb,
  pros,
  cons,
  children,
}: {
  id: string;
  letter: string;
  name: string;
  blurb: string;
  pros: string;
  cons: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 border-b border-line/70 bg-bg py-14 sm:py-16"
    >
      <div className="mx-auto max-w-[1120px] px-5 sm:px-8 lg:px-10">
        <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-blue">
              Direction {letter}
            </p>
            <h3 className="mt-1 text-[1.35rem] font-bold tracking-tight text-ink sm:text-[1.5rem]">
              {name}
            </h3>
            <p className="mt-1.5 text-[14px] leading-relaxed text-muted">
              {blurb}
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-1 text-[12px] sm:max-w-[16rem] sm:text-right">
            <p className="text-ink-soft">
              <span className="font-semibold text-ink">Pros:</span> {pros}
            </p>
            <p className="text-muted">
              <span className="font-semibold text-ink-soft">Cons:</span> {cons}
            </p>
          </div>
        </div>
      </div>
      {children}
    </section>
  );
}
