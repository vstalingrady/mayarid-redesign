"use client";

import Image from "next/image";
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { CASE_STUDIES } from "@/data/caseStudies";
import { useI18n } from "@/i18n";

const N = CASE_STUDIES.length;

/**
 * Studi Kasus carousel — one focal video always dead-center, with
 * neighbor peeks on BOTH sides at every position (including first/last).
 *
 * Implementation: triple the track [set][set][set], start on the middle
 * set, and silently re-home when the user drifts near either edge so the
 * loop never ends and both flanks always show a preview.
 */
export function CaseStudiesSection() {
  const { t } = useI18n();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const settlingRef = useRef(false);
  // Logical index into CASE_STUDIES (0..N-1)
  const [active, setActive] = useState(0);

  // Triple track so we can always peek left + right
  const track = [...CASE_STUDIES, ...CASE_STUDIES, ...CASE_STUDIES];

  const gapOf = (el: HTMLElement) =>
    parseFloat(getComputedStyle(el).columnGap || getComputedStyle(el).gap) ||
    16;

  const stepOf = (el: HTMLElement) => {
    const card = el.querySelector<HTMLElement>("[data-case-card]");
    if (!card) return 0;
    return card.offsetWidth + gapOf(el);
  };

  /** Scroll so track-slot `slot` is dead-center. */
  const scrollToSlot = useCallback((slot: number, behavior: ScrollBehavior) => {
    const el = scrollerRef.current;
    if (!el) return;
    const step = stepOf(el);
    if (step <= 0) return;
    el.scrollTo({ left: slot * step, behavior });
  }, []);

  /** Map current scrollLeft → nearest track slot. */
  const slotFromScroll = (el: HTMLElement) => {
    const step = stepOf(el);
    if (step <= 0) return N; // middle-set first card
    return Math.round(el.scrollLeft / step);
  };

  const logicalFromSlot = (slot: number) =>
    ((slot % N) + N) % N;

  /**
   * If we've drifted into the first or third copy of the track, jump to
   * the equivalent card in the middle copy with no animation.
   */
  const rehomeIfNeeded = useCallback(() => {
    const el = scrollerRef.current;
    if (!el || settlingRef.current) return;
    const slot = slotFromScroll(el);
    // Middle set is slots [N, 2N). Keep a 1-card buffer on each side.
    if (slot < N || slot >= 2 * N) {
      const logical = logicalFromSlot(slot);
      const target = N + logical;
      settlingRef.current = true;
      el.scrollTo({ left: target * stepOf(el), behavior: "auto" });
      // Allow the browser to apply the jump before re-enabling
      requestAnimationFrame(() => {
        settlingRef.current = false;
        setActive(logical);
      });
      return;
    }
    setActive(logicalFromSlot(slot));
  }, []);

  const syncFromScroll = useCallback(() => {
    if (settlingRef.current) return;
    const el = scrollerRef.current;
    if (!el) return;
    setActive(logicalFromSlot(slotFromScroll(el)));
  }, []);

  const scrollByDir = useCallback(
    (dir: -1 | 1) => {
      const el = scrollerRef.current;
      if (!el) return;
      const step = stepOf(el);
      if (step <= 0) return;
      el.scrollBy({ left: dir * step, behavior: "smooth" });
    },
    [],
  );

  const onCardClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>, slot: number) => {
      const el = scrollerRef.current;
      if (!el) return;
      const current = slotFromScroll(el);
      // Clicking a side peek: center it instead of navigating away
      if (slot !== current) {
        e.preventDefault();
        scrollToSlot(slot, "smooth");
      }
    },
    [scrollToSlot],
  );

  useLayoutEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    // Start on the middle set's first card — left peek = last video
    const placeFirst = () => {
      scrollToSlot(N, "auto");
      setActive(0);
    };
    placeFirst();
    const raf = requestAnimationFrame(placeFirst);

    let scrollEndTimer: ReturnType<typeof setTimeout> | null = null;
    const onScroll = () => {
      syncFromScroll();
      if (scrollEndTimer) clearTimeout(scrollEndTimer);
      // Re-home after snap/smooth scroll settles
      scrollEndTimer = setTimeout(() => rehomeIfNeeded(), 140);
    };

    const keepCentered = () => {
      // Re-center whatever logical card is active after a width change
      const logical = logicalFromSlot(slotFromScroll(el));
      scrollToSlot(N + logical, "auto");
      setActive(logical);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", keepCentered);

    const ro = new ResizeObserver(() => keepCentered());
    ro.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      if (scrollEndTimer) clearTimeout(scrollEndTimer);
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", keepCentered);
      ro.disconnect();
    };
  }, [scrollToSlot, syncFromScroll, rehomeIfNeeded]);

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
            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#020a36]/85 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-white/10 sm:h-11 sm:w-11"
            aria-label={t("caseStudies.prev")}
          >
            <CaretLeft weight="bold" className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByDir(1)}
            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#020a36]/85 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-white/10 sm:h-11 sm:w-11"
            aria-label={t("caseStudies.next")}
          >
            <CaretRight weight="bold" className="h-5 w-5" />
          </button>
        </div>

        {/*
          Side padding centers one card. Width tokens must match card
          classes below so first/last (and every) slot can sit dead-center
          with equal peeks on both flanks.
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
          {track.map((c, slot) => {
            const logical = slot % N;
            const isActive = logical === active;
            // Unique key across the triple track
            const key = `${c.id}-${slot}`;
            return (
              <a
                key={key}
                data-case-card
                data-active={isActive ? "true" : "false"}
                href={c.videoHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-current={isActive ? "true" : undefined}
                onClick={(e) => onCardClick(e, slot)}
                className={[
                  "group relative aspect-[16/9] shrink-0 snap-center overflow-hidden rounded-xl",
                  "bg-white/5 outline-none transition-[transform,opacity,box-shadow] duration-300",
                  "focus-visible:ring-2 focus-visible:ring-white/40",
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
                  priority={slot === N}
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
