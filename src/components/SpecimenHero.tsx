"use client";

import {
  AudienceStage,
  AudienceText,
  useAudienceCycle,
} from "@/components/AudienceCarousel";
import { useI18n } from "@/i18n";

/**
 * Viewport hero — fills 100dvh; page scrolls into ProductDashboard below.
 * Stage shows audience lifestyle scenes; text rail + stage share one cycle.
 *
 * Proof is woven in-place:
 * - CTA micro: setup under 2 minutes
 * - TrustBadge: 149k+ businesses · 96% satisfaction
 */
export function SpecimenHero() {
  const { t } = useI18n();
  const { index, setIndex, setPaused } = useAudienceCycle();

  return (
    <section
      id="top"
      className="relative h-[100dvh] max-h-[100dvh] overflow-hidden bg-bg text-ink"
    >
      <div className="specimen-glow pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative mx-auto flex h-full w-full max-w-[1200px] flex-col justify-center px-5 pb-14 pt-[4.25rem] sm:px-8 lg:px-10 lg:pb-12 lg:pt-[4.5rem]">
        <div className="grid min-h-0 w-full flex-1 grid-cols-1 items-center gap-4 lg:grid-cols-12 lg:gap-6">
          <div className="relative z-10 max-w-xl lg:col-span-5 lg:max-w-none">
            <h1 className="m-enter m-copy-2 text-[1.85rem] font-bold leading-[1.05] tracking-tight text-ink sm:text-4xl lg:text-[2.75rem] xl:text-[3.1rem]">
              <span className="text-blue">{t("hero.titleLine1")}</span>
              <br />
              {t("hero.titleLine2")}
              <br />
              {t("hero.titleLine3")}
            </h1>

            <div className="m-enter m-copy-3 mt-0.5 sm:mt-1">
              <AudienceText
                index={index}
                setIndex={setIndex}
                setPaused={setPaused}
              />
            </div>

            <p className="m-enter m-copy-4 mt-3 max-w-[48ch] text-[13px] leading-relaxed text-muted sm:mt-3.5 sm:max-w-[52ch] sm:text-[14px] lg:max-w-none">
              {t("hero.body")}
            </p>

            <div className="m-enter m-copy-5 mt-4 sm:mt-5">
              {/* Single pill — white arrow disc sits inside the right edge */}
              <a
                href="#daftar"
                className="cta-primary group relative inline-flex items-center"
              >
                <span className="cta-shine" aria-hidden />
                <span className="cta-label">{t("hero.cta")}</span>
                <span className="cta-arrow" aria-hidden>
                  <svg
                    width="16"
                    height="16"
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
              {/* Setup speed lives under the button — not a hero-wide stat */}
              <p className="cta-hint mt-2.5 text-[12px] font-medium tracking-tight text-muted sm:text-[13px]">
                {t("hero.ctaHintBefore")}{" "}
                <span className="font-semibold text-ink-soft">
                  {t("hero.ctaHintTime")}
                </span>
                <span className="text-muted-faint">
                  {" "}
                  {t("hero.ctaHintFree")}
                </span>
              </p>
            </div>
          </div>

          <div className="m-enter m-stage relative mx-auto h-[min(38dvh,300px)] w-full max-w-[28rem] sm:h-[min(44dvh,380px)] lg:col-span-7 lg:mx-0 lg:h-[min(62dvh,520px)] lg:max-w-none">
            <AudienceStage index={index} setIndex={setIndex} />
          </div>
        </div>
      </div>
    </section>
  );
}
