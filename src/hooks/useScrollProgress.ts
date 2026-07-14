"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Tracks 0→1 scroll progress through `trackRef` without setState every frame.
 * Writes `--story` CSS variable onto `targetRef` (defaults to track).
 * Call `getProgress()` from rAF / Three useFrame for live values.
 */
export function useScrollProgress(
  trackRef: RefObject<HTMLElement | null>,
  targetRef?: RefObject<HTMLElement | null>,
) {
  const progressRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let raf = 0;

    const measure = () => {
      const rect = track.getBoundingClientRect();
      const viewH = window.innerHeight || 1;
      // When track top hits viewport top → 0; when track bottom hits viewport bottom → 1
      const scrollable = Math.max(rect.height - viewH, 1);
      const raw = -rect.top / scrollable;
      const p = Math.min(1, Math.max(0, raw));
      progressRef.current = p;
      const el = targetRef?.current ?? track;
      el.style.setProperty("--story", p.toFixed(4));
      el.dataset.story = p < 0.45 ? "buyer" : p > 0.55 ? "merchant" : "blend";
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [trackRef, targetRef]);

  return progressRef;
}
