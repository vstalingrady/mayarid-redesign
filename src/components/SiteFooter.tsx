"use client";

import Image from "next/image";
import {
  CaretDown,
  GithubLogo,
  InstagramLogo,
  YoutubeLogo,
  XLogo,
} from "@phosphor-icons/react";
import {
  FOOTER_CERTIFICATES,
  FOOTER_COLUMN_META,
  FOOTER_LEGAL_ENTITIES,
  FOOTER_SOCIAL,
  FOOTER_STORES,
} from "@/data/footer";
import { useI18n, type Locale } from "@/i18n";

/**
 * Full-width blue site footer matching mayar.id homepage chrome.
 * Source: reference/mayar-id/mayar.id_index.html footer block.
 */
export function SiteFooter() {
  const { t, locale, setLocale, messages } = useI18n();
  const cols = messages.footer?.columns ?? {};

  return (
    <footer
      id="footer"
      aria-label={t("footer.aria")}
      className="relative w-full bg-blue text-white"
    >
      <div className="mx-auto max-w-[1180px] px-5 pb-10 pt-12 sm:px-8 sm:pb-12 sm:pt-14 lg:px-10 lg:pt-16">
        {/* Top: brand + link columns */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)] lg:gap-12 xl:gap-16">
          {/* Brand column */}
          <div className="flex flex-col gap-5">
            <a
              href="https://mayar.id"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <Image
                src="/brand/mayar-wordmark.png"
                alt="Mayar SimplePay"
                width={1112}
                height={348}
                className="h-7 w-auto brightness-0 invert sm:h-8"
                style={{ width: "auto" }}
              />
            </a>

            {/* Language switcher — drives i18n locale */}
            <label className="relative inline-flex w-fit max-w-full items-center">
              <span className="sr-only">{t("footer.languageSr")}</span>
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value as Locale)}
                className="appearance-none rounded-md border border-white/25 bg-white/10 py-2 pl-3 pr-9 text-[13px] font-medium text-white outline-none transition-colors hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white/60"
                aria-label={t("footer.languageAria")}
              >
                <option value="id" className="text-ink">
                  {t("footer.languages.id")}
                </option>
                <option value="en" className="text-ink">
                  {t("footer.languages.en")}
                </option>
              </select>
              <CaretDown
                weight="bold"
                className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-white/80"
                aria-hidden
              />
            </label>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-white/80">
                {t("footer.certificates")}
              </p>
              {/*
                Circular seals only — no white square cards.
                Assets are round PNGs with transparent corners from mayar.id.
              */}
              <ul className="mt-3 grid w-fit grid-cols-2 gap-2.5">
                {FOOTER_CERTIFICATES.map((cert) => (
                  <li key={cert.id}>
                    <a
                      href={cert.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block size-11 overflow-hidden rounded-full transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:size-12 ${
                        cert.onBlue === "light"
                          ? "bg-white p-1.5 shadow-[0_0_0_1px_rgba(255,255,255,0.35)]"
                          : ""
                      }`}
                      title={cert.label}
                    >
                      <Image
                        src={cert.src}
                        alt={cert.label}
                        width={96}
                        height={96}
                        className="size-full object-contain"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Link columns */}
          <nav
            aria-label={t("footer.navAria")}
            className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-5"
          >
            {FOOTER_COLUMN_META.map((col) => {
              const copy = cols[col.id] as
                | { title?: string; links?: string[] }
                | undefined;
              const title = copy?.title ?? col.id;
              const labels = copy?.links ?? [];
              return (
                <div key={col.id} className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-white">
                    {title}
                  </p>
                  <ul className="mt-3 flex flex-col gap-2">
                    {col.hrefs.map((href, i) => {
                      const label = labels[i] ?? href;
                      return (
                        <li key={`${col.id}-${href}-${i}`}>
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[13px] leading-snug text-white/85 transition-colors hover:text-white hover:underline hover:underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                          >
                            {label}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-white/20 sm:my-12" aria-hidden />

        {/* Bottom: legal + stores/social */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start lg:gap-12">
          <div className="space-y-3 text-[12px] leading-relaxed text-white/75 sm:text-[13px]">
            <p className="font-medium text-white/90">
              {t("footer.legal.copyright")}
            </p>
            <p>{t("footer.legal.disclaimer")}</p>
            <p>{t("footer.legal.pse")}</p>
            {FOOTER_LEGAL_ENTITIES.map((entity) => (
              <div key={entity.name} className="pt-1">
                <p className="font-semibold text-white/90">{entity.name}</p>
                <p>{entity.address}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-5 lg:items-end">
            <p className="text-[12px] font-medium text-white/80 sm:text-[13px] lg:text-right">
              {t("footer.legal.companionLabel")}
            </p>

            <div className="flex flex-wrap items-center gap-2.5 lg:justify-end">
              {FOOTER_STORES.map((store) => (
                <a
                  key={store.id}
                  href={store.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex shrink-0 items-center overflow-hidden rounded-[6px] transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                    store.id === "chrome" ? "bg-white shadow-sm" : ""
                  }`}
                  aria-label={store.label}
                >
                  {/* SVGs from mayar Framer badges; use img so SVG renders unoptimized */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={store.image}
                    alt={store.label}
                    width={store.width}
                    height={store.height}
                    className="h-10 w-auto"
                    style={{ width: "auto", height: "2.5rem" }}
                    loading="lazy"
                    decoding="async"
                  />
                </a>
              ))}
            </div>

            <ul className="flex flex-wrap items-center gap-2 lg:justify-end">
              {FOOTER_SOCIAL.map((social) => (
                <li key={social.id}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex size-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    aria-label={social.label}
                  >
                    <SocialIcon id={social.id} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ id }: { id: string }) {
  const cls = "size-[18px]";
  switch (id) {
    case "instagram":
      return <InstagramLogo className={cls} weight="fill" aria-hidden />;
    case "twitter":
      return <XLogo className={cls} weight="fill" aria-hidden />;
    case "youtube":
      return <YoutubeLogo className={cls} weight="fill" aria-hidden />;
    case "github":
      return <GithubLogo className={cls} weight="fill" aria-hidden />;
    default:
      return null;
  }
}
