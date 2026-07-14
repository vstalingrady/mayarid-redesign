"use client";

import { useEffect, useState } from "react";
import { MayarMark } from "@/components/MayarMark";
import { useI18n } from "@/i18n";

/**
 * Floating island header - single-line, ≤72px.
 * Matches specimen paper + ink + blue accent. No edge-glued sticky bar.
 */
export function SiteHeader() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const nav = [
    { label: t("nav.products"), href: "#produk" },
    { label: t("nav.solutions"), href: "#solusi" },
    { label: t("nav.pricing"), href: "#harga" },
    { label: t("nav.docs"), href: "#docs" },
  ] as const;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    /*
      Always visible — do NOT use .m-enter (motion.css forces opacity:0 until
      IntersectionObserver adds .in-view; fixed nav can miss that and vanish).
      z-[100] stays above sticky full-viewport sections (checkout story, etc.).
    */
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[100] px-3 pt-2.5 sm:px-5 sm:pt-3">
      <div
        className={`pointer-events-auto mx-auto flex h-12 max-w-[1180px] items-center justify-between gap-3 rounded-[var(--radius-pill)] border border-white/70 px-3 transition-[box-shadow,background-color,transform] duration-300 ease-[var(--ease)] sm:h-[3.25rem] sm:px-4 ${
          scrolled
            ? "bg-bg/95 shadow-[0_12px_40px_-18px_var(--shadow-tint)] backdrop-blur-md"
            : "bg-bg/90 shadow-[0_8px_28px_-20px_var(--shadow-tint)] backdrop-blur-sm"
        }`}
      >
        <a
          href="#top"
          className="shrink-0 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
          onClick={() => setOpen(false)}
        >
          <MayarMark size="sm" />
        </a>

        <nav
          className="hidden items-center gap-0.5 md:flex"
          aria-label={t("nav.mainAria")}
        >
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-[13px] font-medium text-ink-soft transition-colors duration-200 ease-[var(--ease)] hover:bg-ink/[0.04] hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#masuk"
            className="hidden rounded-full px-3.5 py-2 text-[13px] font-medium text-ink-soft transition-colors duration-200 ease-[var(--ease)] hover:text-ink sm:inline-flex"
          >
            {t("nav.login")}
          </a>
          <a href="#daftar" className="cta-primary cta-nav">
            <span className="cta-label">{t("nav.signup")}</span>
            <span className="cta-arrow" aria-hidden>
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                className="cta-arrow-icon"
              >
                <path
                  d="M3.25 8h9.5M9.25 4.75 12.75 8l-3.5 3.25"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </a>

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-card-solid/80 text-ink md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3.5 w-3.5" aria-hidden>
              <span
                className={`absolute left-0 top-0.5 block h-px w-full bg-ink transition-transform duration-300 ease-[var(--ease)] ${
                  open ? "translate-y-[5px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[7px] block h-px w-full bg-ink transition-opacity duration-200 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 top-[11px] block h-px w-full bg-ink transition-transform duration-300 ease-[var(--ease)] ${
                  open ? "-translate-y-[5px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        id="mobile-nav"
        className={`pointer-events-auto mx-auto mt-2 max-w-[1180px] overflow-hidden rounded-2xl border border-line bg-card-solid shadow-[0_16px_40px_-20px_var(--shadow-tint)] transition-[max-height,opacity] duration-300 ease-[var(--ease)] md:hidden ${
          open ? "max-h-64 opacity-100" : "max-h-0 border-transparent opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-0.5 p-2" aria-label={t("nav.mobileAria")}>
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-xl px-3 py-2.5 text-[14px] font-medium text-ink-soft hover:bg-ink/[0.04] hover:text-ink"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#masuk"
            className="rounded-xl px-3 py-2.5 text-[14px] font-medium text-ink-soft hover:bg-ink/[0.04] hover:text-ink sm:hidden"
            onClick={() => setOpen(false)}
          >
            {t("nav.login")}
          </a>
        </nav>
      </div>
    </header>
  );
}
