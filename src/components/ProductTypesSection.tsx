"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ProductSplitExplorer } from "@/components/product-explorer/ProductSplitExplorer";
import { useI18n } from "@/i18n";

/**
 * Latch inView to true once — keeps autoplay running after first reveal
 * (IO flicker was stopping the cycle).
 */
function useInViewOnce(threshold = 0.08) {
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
      { threshold, rootMargin: "0px 0px -5% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, inView]);

  return { ref, inView };
}

function FadeIn({
  active,
  delay = 0,
  className = "",
  children,
}: {
  active: boolean;
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={className}
      style={{
        opacity: active ? 1 : 0,
        transform: active ? "none" : "translateY(16px)",
        transition: `opacity 0.83s cubic-bezier(0.16,1,0.3,1) ${active ? delay : 0}ms, transform 0.98s cubic-bezier(0.16,1,0.3,1) ${active ? delay : 0}ms`,
      }}
    >
      {children}
    </div>
  );
}

/**
 * Product types — header + animated 60/40 explorer (autoplay cycle).
 */
export function ProductTypesSection() {
  const { t } = useI18n();
  const { ref, inView } = useInViewOnce(0.08);

  return (
    <section
      id="produk-tipe"
      ref={ref}
      aria-labelledby="product-types-heading"
      className="relative border-t border-line/60 bg-bg px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-12"
    >
      <div className="mx-auto max-w-[1040px]">
        <FadeIn active={inView} delay={0}>
          <div className="mx-auto max-w-2xl text-center">
            <p className="specimen-label text-[10px] tracking-[0.16em] text-muted">
              {t("products.eyebrow")}
            </p>
            <h2
              id="product-types-heading"
              className="mt-2 text-balance text-[1.5rem] font-bold tracking-tight text-ink sm:text-[1.75rem] lg:text-[1.95rem]"
            >
              {t("products.title")}
            </h2>
            <p className="mx-auto mt-2 max-w-[48ch] text-pretty text-[13px] leading-relaxed text-muted sm:text-[14px]">
              {t("products.subtitle")}
            </p>
          </div>
        </FadeIn>

        {/* Explorer always mounted once visible — not opacity-gated so timers keep firing */}
        <div
          className={`mt-5 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:mt-6 ${
            inView
              ? "translate-y-0 opacity-100"
              : "translate-y-3 opacity-0"
          }`}
          style={{ transitionDelay: inView ? "100ms" : "0ms" }}
        >
          <ProductSplitExplorer inView={inView} />
        </div>
      </div>
    </section>
  );
}
