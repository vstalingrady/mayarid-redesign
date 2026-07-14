"use client";

import Image from "next/image";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { CASE_STUDIES } from "@/data/caseStudies";
import { useI18n } from "@/i18n";

/**
 * Studi Kasus carousel — always one focal video in the center,
 * with neighbor videos peeking in from both sides.
 *
 * Side padding = half the free space so first/last can still center.
 * scroll-snap keeps each step locked on a single card.
 */
export function CaseStudiesSection() {
  const { t } = useI18n();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const gapOf = (el: HTMLElement) =>
    parseFloat(getComputedStyle(el).columnGap || getComputedStyle(el).gap) ||
    16;

  const syncActive = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-case-card]");
    if (!card) return;
    const step = card.offsetWidth + gapOf(el);
    if (step <= 0) return;
    const index = Math.round(el.scrollLeft / step);
    setActive(Math.max(0, Math.min(CASE_STUDIES.length - 1, index)));
  }, []);

  const scrollByDir = useCallback((dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-case-card]");
    if (!card) return;
    el.scrollBy({
      left: dir * (card.offsetWidth + gapOf(el)),
      behavior: "smooth",
    });
  }, []);

  useLayoutEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    // Opening view: first card dead-center (padding handles the rest)
    el.scrollLeft = 0;
    syncActive();

    const onScroll = () => syncActive();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", syncActive);

    const ro = new ResizeObserver(() => syncActive());
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", syncActive);
      ro.disconnect();
    };
  }, [syncActive]);

  return (
    <section
      id="studi-kasus"
      aria-label={t("caseStudies.sectionAria")}
      className="relative overflow-hidden bg-[#020a36] text-white"
    >
      <div className="mx-auto max-w-[1180px] px-5 pb-2 pt-14 sm:px-8 sm:pt-16 lg:px-10 lg:pt-20">
        <header className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-[1.85rem] font-bold tracking-tight sm:text-[2.25rem] lg:text-[2.5rem]">
            {t("caseStudies.title")}
          </h2>
          <p className="mt-3 text-pretty text-[14px] font-medium leading-relaxed tracking-[-0.02em] text-[#aeaecb] sm:text-[16px] sm:leading-8">
            {t("caseStudies.subtitle")}
          </p>
        </header>
      </div>

      <div className="relative mt-8 sm:mt-10">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#020a36] via-[#020a36]/55 to-transparent sm:w-16 lg:w-24"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#020a36] via-[#020a36]/55 to-transparent sm:w-16 lg:w-24"
          aria-hidden
        />

        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-20 flex items-center justify-between px-2 sm:px-4 lg:px-6">
          <button
            type="button"
            onClick={() => scrollByDir(-1)}
            disabled={active <= 0}
            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#020a36]/85 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-white/10 disabled:pointer-events-none disabled:opacity-30 sm:h-11 sm:w-11"
            aria-label={t("caseStudies.prev")}
          >
            <CaretLeft weight="bold" className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByDir(1)}
            disabled={active >= CASE_STUDIES.length - 1}
            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#020a36]/85 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-white/10 disabled:pointer-events-none disabled:opacity-30 sm:h-11 sm:w-11"
            aria-label={t("caseStudies.next")}
          >
            <CaretRight weight="bold" className="h-5 w-5" />
          </button>
        </div>

        {/*
          Padding = (viewport - card) / 2 so one card sits dead-center and
          neighbors peek from the sides. Keep in sync with card widths below.
        */}
        <div
          ref={scrollerRef}
          className={[
            "flex gap-3 overflow-x-auto scroll-smooth pb-14 pt-2 sm:gap-4 sm:pb-16",
            "snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            "px-[max(1rem,calc(50%-min(72vw,18rem)/2))]",
            "sm:px-[max(1.25rem,calc(50%-min(54vw,26rem)/2))]",
            "lg:px-[max(1.5rem,calc(50%-min(44vw,34rem)/2))]",
          ].join(" ")}
        >
          {CASE_STUDIES.map((c, i) => {
            const isActive = i === active;
            return (
              <a
                key={c.id}
                data-case-card
                data-active={isActive ? "true" : "false"}
                href={c.videoHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-current={isActive ? "true" : undefined}
                className={[
                  "group relative aspect-[16/9] shrink-0 snap-center overflow-hidden rounded-xl",
                  "bg-white/5 outline-none transition-[transform,opacity,box-shadow] duration-300",
                  "focus-visible:ring-2 focus-visible:ring-white/40",
                  // One centered card; width leaves room for side previews
                  "w-[min(72vw,18rem)]",
                  "sm:w-[min(54vw,26rem)]",
                  "lg:w-[min(44vw,34rem)]",
                  isActive
                    ? "z-[1] scale-100 opacity-100 shadow-[0_28px_56px_-20px_rgb(0_0_0/0.8)]"
                    : "scale-[0.92] opacity-45 shadow-[0_16px_40px_-24px_rgb(0_0_0/0.55)] hover:opacity-70",
                ].join(" ")}
              >
                <Image
                  src={c.poster}
                  alt={`Mayar × ${c.partner}`}
                  fill
                  sizes="(max-width: 640px) 72vw, (max-width: 1024px) 54vw, 544px"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  priority={i === 0}
                />

                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10"
                  aria-hidden
                />

                <span
                  className={[
                    "absolute left-1/2 top-1/2 block h-12 w-[4.25rem] -translate-x-1/2 -translate-y-1/2 transition-[transform,opacity] duration-300 sm:h-14 sm:w-[4.75rem]",
                    isActive
                      ? "scale-100 opacity-100 group-hover:scale-110"
                      : "scale-90 opacity-60",
                  ].join(" ")}
                  aria-hidden
                >
                  <svg
                    viewBox="0 0 68 48"
                    className="h-full w-full drop-shadow-[0_8px_20px_rgb(0_0_0/0.45)]"
                    aria-hidden
                  >
                    <path
                      d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"
                      className="fill-[#212121]/80 transition-colors duration-200 group-hover:fill-[#f00]/90"
                    />
                    <path d="M 45,24 27,14 27,34" fill="#fff" />
                  </svg>
                </span>

                <span className="sr-only">
                  {t("caseStudies.watch").replace("{partner}", c.partner)}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
