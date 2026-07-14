"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/**
 * Island with hard JS bob — always on (portfolio demo).
 * Uses island-v2 (clean Magic Layers cutout).
 */
export function FloatingIsland() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const start = performance.now();
    const AMP = 12; // keep inside 100dvh frame — no clip/scroll
    const PERIOD = 2800;

    const tick = (now: number) => {
      const t = (now - start) / PERIOD;
      const y = Math.sin(t * Math.PI * 2) * AMP;
      // Direct style — cannot be blocked by CSS reduce-motion rules
      el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="relative mx-auto h-[80%] w-[80%] translate-x-[4%] translate-y-[2%]">
      <div
        ref={ref}
        className="relative h-full w-full"
        style={{ willChange: "transform" }}
      >
        <Image
          src="/specimen/island-v2.png?v=2"
          alt="Floating island"
          fill
          className="object-contain"
          sizes="(max-width: 1024px) 88vw, 560px"
          priority
          unoptimized
        />
      </div>
    </div>
  );
}
