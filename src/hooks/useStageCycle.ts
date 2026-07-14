"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Section visibility for specimen stages (Go Online / Integrations / Marketing).
 * `seen` latches true after first intersection so entrance + ambient can stay on.
 */
export function useStageInView(threshold = 0.05) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Edge can report isIntersecting=false briefly with non-zero thresholds;
    // also re-check on first paint (hash navigations / Efficiency Mode resume).
    const apply = (vis: boolean) => {
      setInView(vis);
      if (vis) setSeen(true);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        apply(!!entry?.isIntersecting);
      },
      // Near-zero threshold + small rootMargin = reliable across Chrome & Edge
      { threshold: Math.min(threshold, 0.01), rootMargin: "0px 0px -1% 0px" },
    );
    io.observe(el);

    // Synchronous first paint check (IO may delay a frame in Edge)
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < vh * 0.98 && rect.bottom > vh * 0.02) {
      apply(true);
    }

    return () => io.disconnect();
  }, [threshold]);

  return { ref, inView, seen };
}

/**
 * Auto-advance index while the section is in view.
 * Does NOT gate on prefers-reduced-motion (content cycle stays alive on Windows).
 * Interval deps stay stable — only `inView` / length / ms restart the timer.
 */
export function useStageCycle(length: number, ms: number, inView: boolean) {
  const [index, setIndex] = useState(0);
  /** Bumps on every advance or manual jump so remount keys re-fire swap animations. */
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView || length <= 1) return;
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % length);
      setTick((n) => n + 1);
    }, ms);
    return () => window.clearInterval(t);
  }, [inView, length, ms]);

  const jumpTo = (i: number) => {
    setIndex(((i % length) + length) % length);
    setTick((n) => n + 1);
  };

  return { index, tick, setIndex, jumpTo };
}
