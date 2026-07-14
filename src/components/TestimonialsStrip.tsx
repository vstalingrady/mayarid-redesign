"use client";

import Image from "next/image";
import { Play } from "@phosphor-icons/react";
import { useState } from "react";
import {
  ORG_MARQUEE_SECONDS,
  ORG_QUOTES,
  VIDEO_TESTIMONIALS,
  type OrgQuote,
  type OrgQuoteIcon,
} from "@/data/testimonials";
import { useI18n } from "@/i18n";

function QuoteIcon({ icon, org }: { icon: OrgQuoteIcon; org: string }) {
  const isAvatar = icon.kind === "avatar";
  const bg = icon.kind === "badge" ? (icon.bg ?? "#fff") : "#e2e8f0";

  return (
    <span
      className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full shadow-[0_2px_8px_-2px_rgb(15_23_42/0.28)] ring-2 ring-white"
      style={{ background: bg }}
      aria-hidden
    >
      <Image
        src={icon.src}
        alt=""
        width={44}
        height={44}
        className={
          isAvatar
            ? "h-full w-full object-cover"
            : "h-[72%] w-[72%] object-contain"
        }
        sizes="44px"
      />
      <span className="sr-only">{org}</span>
    </span>
  );
}

function QuoteCard({ quote }: { quote: OrgQuote }) {
  const { t, messages } = useI18n();
  const persons = (messages.testimonials?.persons ?? {}) as Record<
    string,
    string
  >;
  const person = persons[quote.id] ?? quote.person;
  const text = t(`testimonials.quotes.${quote.id}`);

  return (
    <article className="testimonial-card flex h-full w-[min(86vw,20.5rem)] shrink-0 flex-col rounded-2xl border border-line/50 bg-white p-5 text-left shadow-[0_8px_28px_-14px_rgb(15_23_42/0.22)] sm:w-[21.5rem] sm:p-6">
      <div className="flex items-center gap-3">
        <QuoteIcon icon={quote.icon} org={quote.org} />
        <div className="min-w-0">
          <p className="truncate text-[13px] font-bold leading-snug text-ink sm:text-[14px]">
            {quote.org}
          </p>
          <p className="truncate text-[12px] font-medium text-[#0383ff]">
            {person}
          </p>
        </div>
      </div>
      <p className="mt-3.5 line-clamp-6 text-pretty text-[12.5px] leading-[1.65] text-muted sm:text-[13px]">
        {text}
      </p>
    </article>
  );
}

/**
 * Infinite auto-scrolling marquee of quote cards (tripled track).
 * Pauses on hover / keyboard focus. No manual scrollbar.
 */
function QuoteMarquee() {
  const { t } = useI18n();
  const [paused, setPaused] = useState(false);

  // Triple the list so translateX(-33.333%) loops seamlessly
  const loop = [...ORG_QUOTES, ...ORG_QUOTES, ...ORG_QUOTES];

  return (
    <div
      className="relative mt-8 sm:mt-10"
      role="region"
      aria-label={t("testimonials.carouselAria")}
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      {/* Edge fades */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#f7f8fc] to-transparent sm:w-16"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#f7f8fc] to-transparent sm:w-16"
        aria-hidden
      />

      <div className="overflow-hidden py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div
          className="testimonial-marquee flex w-max gap-4 will-change-transform sm:gap-5"
          style={{
            animationDuration: `${ORG_MARQUEE_SECONDS}s`,
            animationPlayState: paused ? "paused" : "running",
          }}
        >
          {loop.map((q, i) => (
            <div
              key={`${q.id}-${i}`}
              className="testimonial-marquee-item"
              aria-hidden={i >= ORG_QUOTES.length}
            >
              <QuoteCard quote={q} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Testimonials: video grid + infinite auto marquee of quote cards.
 */
export function TestimonialsStrip() {
  const { t } = useI18n();

  return (
    <section
      id="testimoni"
      aria-label={t("testimonials.sectionAria")}
      className="relative scroll-mt-24 border-t border-line/40 bg-[#f7f8fc]"
    >
      <div className="mx-auto max-w-[1120px] px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
          <div>
            <p className="text-[12px] font-semibold text-muted sm:text-[13px]">
              {t("testimonials.label")}
            </p>
            <h2 className="mt-1 text-balance text-[1.75rem] font-bold tracking-tight text-ink sm:text-[2.1rem] lg:text-[2.35rem]">
              {t("testimonials.title")}
            </h2>
          </div>
          <p className="max-w-md text-pretty text-[13px] leading-relaxed text-muted sm:text-right sm:text-[14px]">
            {t("testimonials.blurb")}
          </p>
        </div>

        {/* Video grid */}
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5">
          {VIDEO_TESTIMONIALS.map((v) => {
            const title = t(`testimonials.videos.${v.id}`);
            return (
              <li key={v.id}>
                <a
                  href={v.href ?? "#testimoni"}
                  target={v.href ? "_blank" : undefined}
                  rel={v.href ? "noopener noreferrer" : undefined}
                  aria-label={title}
                  className="group relative block overflow-hidden rounded-2xl bg-ink/5 shadow-[0_8px_28px_-16px_rgb(15_23_42/0.35)] outline-none transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-16px_rgb(15_23_42/0.4)] focus-visible:ring-2 focus-visible:ring-blue/40"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <Image
                      src={v.poster}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, 520px"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-transparent"
                      aria-hidden
                    />
                    <span
                      className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-ink shadow-[0_8px_24px_-8px_rgb(0_0_0/0.45)] transition-transform duration-300 group-hover:scale-110 sm:h-14 sm:w-14"
                      aria-hidden
                    >
                      <Play
                        weight="fill"
                        className="ml-0.5 h-5 w-5 sm:h-6 sm:w-6"
                      />
                    </span>
                    <p className="absolute inset-x-0 bottom-0 p-3.5 text-left text-[12px] font-semibold leading-snug text-white sm:p-4 sm:text-[13.5px]">
                      {title}
                    </p>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>

        {/* Infinite auto-scroll quote cards with clear icons */}
        <QuoteMarquee />
      </div>
    </section>
  );
}
