"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n";

/**
 * Press logos from mayar.id "Telah diliput oleh" strip
 * (reference assets under public/specimen/press/).
 */
const PRESS_LOGOS = [
  {
    src: "/specimen/press/aBAd2n0eC80ry9529x4ETn9Py5o.png",
    alt: "Liputan6",
    width: 120,
    height: 28,
  },
  {
    src: "/specimen/press/kFOmN1gxeTG6ydth5fGLp1YHfas.webp",
    alt: "KOMPAS.com",
    width: 130,
    height: 22,
  },
  {
    src: "/specimen/press/rVybczlnrKsVdwdChVUAGGTqPko.png",
    alt: "suara.com",
    width: 118,
    height: 24,
  },
  {
    src: "/specimen/press/qYYxASYMCRSDITFY93bGaru8REw.webp",
    alt: "VIVA.co.id",
    width: 100,
    height: 24,
  },
  {
    src: "/specimen/press/mCCe7TrVaV6sesx7z2plIrDMo9I.png",
    alt: "medcom.id",
    width: 128,
    height: 24,
  },
  {
    src: "/specimen/press/CESal7bVDqKE8uUESO1UGLSeArs.png",
    alt: "jpnn.com",
    width: 110,
    height: 32,
  },
  {
    src: "/specimen/press/QQteuRigqDmNO8K1C9zqN2FwzE.png",
    alt: "INFOKOMPUTER",
    width: 120,
    height: 26,
  },
  {
    src: "/specimen/press/EqBLh4YYz1fmECw9Al4BY6qnRs.png",
    alt: "SWA",
    width: 72,
    height: 32,
  },
  {
    src: "/specimen/press/AGADvTl1Vr615jSk3jnqukPHkc.png",
    alt: "Bisnis.com",
    width: 118,
    height: 28,
  },
  {
    src: "/specimen/press/VOeIxqkHMGCtL532GhYUK6HfXM.png",
    alt: "SINDONEWS.com",
    width: 130,
    height: 24,
  },
  {
    src: "/specimen/press/JEybwbACFIP9FTsGjNemixEeAw.png",
    alt: "Media Indonesia",
    width: 90,
    height: 36,
  },
] as const;

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Toggle on both enter + leave so the fade-up replays every time
    // the strip scrolls into view (same pattern as TrustStrip / MotionReady).
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry) setInView(entry.isIntersecting);
      },
      { threshold, rootMargin: "0px 0px -30px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/**
 * "Telah diliput oleh" press logo band — same staggered fade-up as TrustStrip.
 * Placed under Studi Kasus (mayar.id order).
 */
export function PressStrip() {
  const { t } = useI18n();
  const { ref, inView } = useInView();

  return (
    <section
      ref={ref}
      id="diliput"
      aria-label={t("press.sectionAria")}
      className="relative w-full border-b border-line/40 bg-white"
    >
      <div className="mx-auto max-w-[1100px] px-5 py-10 sm:px-8 sm:py-12 lg:px-10">
        <p
          className="mb-6 text-center text-[12px] font-medium leading-snug text-muted sm:mb-8 sm:text-[13px]"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "none" : "translateY(8px)",
            transition: "opacity 0.75s var(--ease), transform 0.83s var(--ease)",
          }}
        >
          {t("press.title")}
        </p>

        <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-6 sm:gap-x-9 sm:gap-y-7 lg:gap-x-11">
          {PRESS_LOGOS.map((logo, i) => (
            <li
              key={logo.src}
              className="flex items-center justify-center"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "none" : "translateY(10px)",
                transition: `opacity 0.75s var(--ease) ${
                  inView ? 100 + i * 70 : 0
                }ms, transform 0.83s var(--ease) ${
                  inView ? 100 + i * 70 : 0
                }ms`,
              }}
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                className="h-5 w-auto object-contain opacity-80 sm:h-6 lg:h-7"
                style={{ width: "auto" }}
                sizes="130px"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
