"use client";

import { useI18n } from "@/i18n";

/**
 * Persistent portfolio / non-affiliation notice.
 * Sits under the floating header so visitors never mistake this for mayar.id.
 */
export function PortfolioDisclaimer() {
  const { t } = useI18n();

  return (
    <div
      role="note"
      aria-label={t("portfolio.aria")}
      className="pointer-events-none fixed inset-x-0 top-[3.75rem] z-[99] px-3 sm:top-[4rem] sm:px-5"
    >
      <div className="pointer-events-auto mx-auto max-w-[1180px]">
        <p className="rounded-xl border border-amber-500/30 bg-amber-50/95 px-3 py-2 text-center text-[11px] font-medium leading-snug text-amber-950 shadow-[0_8px_24px_-16px_rgb(15_23_42/0.35)] backdrop-blur-md sm:px-4 sm:text-[12px] sm:leading-relaxed">
          <span className="font-bold tracking-wide text-amber-900">
            {t("portfolio.badge")}
          </span>
          <span className="mx-1.5 text-amber-800/50" aria-hidden>
            ·
          </span>
          {t("portfolio.banner")}
        </p>
      </div>
    </div>
  );
}
