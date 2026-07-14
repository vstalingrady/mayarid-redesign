"use client";

import { useEffect, useRef, useState } from "react";
import { FeaturesGraph } from "@/components/FeaturesGraph";
import { useI18n } from "@/i18n";

/** Latch once so graph animations start and keep running. */
function useInViewOnce(threshold = 0.06) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -2% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, inView]);

  return { ref, inView };
}

/**
 * Features section — wide desktop row: copy left, graph right (fills viewport).
 */
export function FeaturesCloudSection() {
  const { t } = useI18n();
  const { ref, inView } = useInViewOnce(0.05);

  return (
    <section
      id="fitur"
      ref={ref}
      aria-labelledby="features-cloud-heading"
      className="relative flex min-h-0 flex-col overflow-hidden border-t border-line/50 bg-bg px-4 py-6 sm:px-5 sm:py-7 lg:h-[100dvh] lg:max-h-[100dvh] lg:scroll-mt-[4.75rem] lg:px-4 lg:pb-3 lg:pt-[4.75rem] xl:px-5"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgb(37_99_235/0.05),transparent_62%)]"
        aria-hidden
      />

      {/*
        Center the copy+graph pair with a moderate gap — not justify-between
        (that pinned them to opposite edges with a huge empty middle).
      */}
      <div className="relative mx-auto flex h-full w-full min-h-0 max-w-[1600px] flex-col items-center justify-center lg:flex-row lg:items-center lg:justify-center lg:gap-6 xl:gap-8">
        <header
          className={`w-full max-w-[24rem] shrink-0 text-center transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:w-[20rem] lg:max-w-none lg:text-right xl:w-[22rem] ${
            inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          <p className="inline-flex items-center rounded-full bg-[#fde8ef] px-3 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#e11d74] sm:text-[10px] lg:text-[11px]">
            {t("features.eyebrow")}
          </p>
          <h2
            id="features-cloud-heading"
            className="mt-2.5 text-balance text-[1.4rem] font-bold tracking-tight text-ink sm:text-[1.65rem] lg:mt-3 lg:text-[2.15rem] lg:leading-[1.15] xl:text-[2.35rem]"
          >
            {t("features.title")}
          </h2>
          <p className="mx-auto mt-2 max-w-[24rem] text-pretty text-[13px] leading-relaxed text-muted sm:text-[13.5px] lg:ml-auto lg:mr-0 lg:mt-3 lg:max-w-none lg:text-[15px] lg:leading-relaxed">
            {t("features.subtitle")}
          </p>
        </header>

        <div
          className={`mt-4 flex min-h-0 w-full min-w-0 flex-col items-center justify-center lg:mt-0 lg:w-[min(840px,calc(100dvh-12rem))] lg:max-w-[min(840px,calc(100%-21rem))] lg:shrink-0 ${
            inView ? "opacity-100" : "opacity-0"
          } transition-opacity duration-700`}
        >
          <FeaturesGraph inView={inView} />
        </div>
      </div>
    </section>
  );
}
