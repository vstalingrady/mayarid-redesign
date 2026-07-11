"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const LOGOS = [
  {
    src: "/specimen/trust/logos/greenpeace.png",
    alt: "Greenpeace",
    width: 120,
    height: 22,
  },
  {
    src: "/specimen/trust/logos/pacmann.png",
    alt: "Pacmann",
    width: 108,
    height: 28,
  },
  {
    src: "/specimen/trust/logos/agate.png",
    alt: "Agaté",
    width: 88,
    height: 28,
  },
  {
    src: "/specimen/trust/logos/digitalskola.png",
    alt: "DigitalSkola",
    width: 118,
    height: 26,
  },
  {
    src: "/specimen/trust/logos/belajarlagi.png",
    alt: "belajarlagi",
    width: 112,
    height: 26,
  },
  {
    src: "/specimen/trust/logos/algoritma.png",
    alt: "algoritma",
    width: 104,
    height: 26,
  },
] as const;

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          setInView(entry.isIntersecting);
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/**
 * Logo trust band between hero and dashboard.
 * Stats live on the hero (2 Menit / 149k+ / 96%).
 */
export function TrustStrip() {
  const { ref, inView } = useInView();

  return (
    <section
      ref={ref}
      aria-label="Lembaga yang mempercayai Mayar"
      className="relative w-full border-y border-line/60 bg-[#eef1f8]"
    >
      <div className="mx-auto max-w-[1100px] px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
        <p
          className="mb-5 text-center text-[12px] font-medium leading-snug text-muted sm:mb-7 sm:text-[13px]"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "none" : "translateY(8px)",
            transition: "opacity 1.0s var(--ease), transform 1.1s var(--ease)",
          }}
        >
          Dipercaya lembaga dan institusi terkemuka di seluruh Indonesia
        </p>

        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-5 sm:gap-x-10 lg:gap-x-12">
          {LOGOS.map((logo, i) => (
            <li
              key={logo.src}
              className="flex items-center justify-center"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "none" : "translateY(10px)",
                transition: `opacity 1.0s var(--ease) ${inView ? 160 + i * 120 : 0}ms, transform 1.1s var(--ease) ${inView ? 160 + i * 120 : 0}ms`,
              }}
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                className="h-5 w-auto object-contain opacity-70 grayscale sm:h-6 lg:h-7"
                style={{ width: "auto" }}
                sizes="120px"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
