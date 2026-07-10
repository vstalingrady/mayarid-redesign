"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Gates CSS entrance animations until after mount, then uses
 * IntersectionObserver to add `in-view` to every `.m-enter` element
 * as it scrolls into the viewport — animations replay each time
 * a section comes into view, not just once on load.
 */
export function MotionReady({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Double rAF: wait one frame so browser paints "pending" state first
    let id2 = 0;
    const id1 = requestAnimationFrame(() => {
      id2 = requestAnimationFrame(() => setReady(true));
    });
    return () => {
      cancelAnimationFrame(id1);
      cancelAnimationFrame(id2);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;

          if (entry.isIntersecting) {
            el.classList.add("in-view");
          } else {
            el.classList.remove("in-view");
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    // Observe all current .m-enter elements
    const observe = () => {
      document.querySelectorAll<HTMLElement>(".m-enter").forEach((el) => {
        observer.observe(el);
      });
    };

    observe();

    // Also pick up any .m-enter elements added later (e.g. lazy-rendered sections)
    const mutation = new MutationObserver(observe);
    mutation.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutation.disconnect();
    };
  }, [ready]);

  return (
    <div
      className={`min-h-[100dvh] ${ready ? "motion-ready" : "motion-pending"}`}
      data-motion={ready ? "ready" : "pending"}
    >
      {children}
    </div>
  );
}
