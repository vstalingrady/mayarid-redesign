"use client";

import Image from "next/image";
import { useI18n } from "@/i18n";

const SIGNUP_HREF = "https://web.mayar.id/sign-in/coupon/INBOUNDWEB";

/**
 * Final homepage CTA — light soft-blue strip matching mayar.id
 * "Tunggu Apa Lagi? / Daftar Sekarang."
 * Copy + signup from reference/mayar-id; dashboard mock reuses
 * the Beranda screenshot (same language as ProductDashboard).
 */
export function FinalCtaSection() {
  const { t } = useI18n();

  return (
    <section
      id="daftar"
      aria-label={t("finalCta.sectionAria")}
      className="relative scroll-mt-24 overflow-hidden border-t border-line/40 bg-[#f3f6fc]"
    >
      {/* Soft blue wash — keeps the section light, not navy */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 80% at 85% 45%, rgb(37 99 235 / 0.07), transparent 60%), radial-gradient(ellipse 50% 60% at 10% 80%, rgb(37 99 235 / 0.04), transparent 55%)",
        }}
      />

      <div className="relative mx-auto max-w-[1180px] px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:gap-12 xl:gap-16">
          {/* Left — copy + CTA */}
          <div className="mx-auto max-w-md text-center lg:mx-0 lg:max-w-none lg:text-left">
            <h2 className="text-balance text-[1.85rem] font-bold leading-[1.15] tracking-tight sm:text-[2.25rem] lg:text-[2.5rem] xl:text-[2.75rem]">
              <span className="block text-[#020a36]">
                {t("finalCta.titleLine1")}
              </span>
              <span className="mt-1 block text-blue sm:mt-1.5">
                {t("finalCta.titleLine2")}
              </span>
            </h2>

            <p className="mx-auto mt-4 max-w-[34ch] text-pretty text-[14px] leading-relaxed text-[#8b8ba8] sm:mt-5 sm:text-[15px] sm:leading-[1.65] lg:mx-0 lg:max-w-[38ch]">
              {t("finalCta.body")}
            </p>

            <div className="mt-7 flex justify-center sm:mt-8 lg:justify-start">
              <a
                href={SIGNUP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-primary group relative inline-flex items-center"
              >
                <span className="cta-shine" aria-hidden />
                <span className="cta-label">{t("finalCta.cta")}</span>
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
            </div>
          </div>

          {/* Right — elevated browser/dashboard mock */}
          <div className="relative mx-auto w-full max-w-[36rem] lg:mx-0 lg:max-w-none">
            <div
              className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-[radial-gradient(ellipse_at_center,rgb(37_99_235/0.1),transparent_70%)] sm:-inset-6"
              aria-hidden
            />
            <div className="relative overflow-hidden rounded-xl border border-white/80 bg-white shadow-[0_28px_64px_-20px_rgb(15_23_42/0.28),0_12px_28px_-16px_rgb(37_99_235/0.12)] ring-1 ring-line/50 sm:rounded-2xl">
              <Image
                src="/specimen/dashboard/beranda.jpg"
                alt={t("finalCta.dashAlt")}
                width={1918}
                height={1255}
                sizes="(max-width: 1024px) 90vw, 560px"
                className="h-auto w-full object-cover object-top"
                priority={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
