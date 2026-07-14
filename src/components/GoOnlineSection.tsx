"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useStageCycle, useStageInView } from "@/hooks/useStageCycle";
import { useI18n } from "@/i18n";

/** Static media paths for go-online storefront stage (copy is in locales). */
const SHOWCASE_META = [
  { id: "kelas-online", image: "/specimen/go-online/kelas-online.jpg" },
  { id: "e-book", image: "/specimen/go-online/e-book.jpg" },
  { id: "membership", image: "/specimen/go-online/membership.jpg" },
  { id: "webinar", image: "/specimen/go-online/webinar.jpg" },
] as const;

const CYCLE_MS = 4000;

type ShowcaseItem = {
  id: string;
  badge: string;
  title: string;
  price: string;
  priceHint: string;
  blurb: string;
  cta: string;
  toastAction: string;
  toastAmount: string;
  image: string;
  imageCaption: string;
  imageSub: string;
  stats: string[];
};

type Layer = {
  id: string;
  image: string;
  imageCaption: string;
  imageSub: string;
};

function toLayer(item: ShowcaseItem): Layer {
  return {
    id: item.id,
    image: item.image,
    imageCaption: item.imageCaption,
    imageSub: item.imageSub,
  };
}

/**
 * “Hemat waktu · online 2 menit” — copy left, live storefront mock right.
 * Motion uses motion.css classes (same system as product-explorer).
 */
export function GoOnlineSection() {
  const { t, messages } = useI18n();
  const { ref, inView, seen } = useStageInView(0.05);

  const showcase = useMemo((): ShowcaseItem[] => {
    const items = (messages.goOnline?.items ?? {}) as Record<
      string,
      Omit<ShowcaseItem, "id" | "image">
    >;
    return SHOWCASE_META.map((m) => {
      const copy = items[m.id];
      return {
        id: m.id,
        image: m.image,
        badge: copy?.badge ?? m.id,
        title: copy?.title ?? "",
        price: copy?.price ?? "",
        priceHint: copy?.priceHint ?? "",
        blurb: copy?.blurb ?? "",
        cta: copy?.cta ?? "",
        toastAction: copy?.toastAction ?? "",
        toastAmount: copy?.toastAmount ?? "",
        imageCaption: copy?.imageCaption ?? "",
        imageSub: copy?.imageSub ?? "",
        stats: Array.isArray(copy?.stats) ? copy.stats : [],
      };
    });
  }, [messages]);

  const { index, tick, jumpTo } = useStageCycle(
    showcase.length,
    CYCLE_MS,
    inView,
  );

  const item = showcase[index] ?? showcase[0]!;
  const live = seen;

  const [front, setFront] = useState<Layer>(() => toLayer(showcase[0]!));
  const [back, setBack] = useState<Layer>(() => toLayer(showcase[0]!));
  const [showFront, setShowFront] = useState(true);
  const shownIdRef = useRef<string>(showcase[0]!.id);

  useEffect(() => {
    if (item.id === shownIdRef.current) {
      // Locale switch: refresh captions on settled layers
      const next = toLayer(item);
      setFront((prev) => (prev.id === item.id ? next : prev));
      setBack((prev) => (prev.id === item.id ? next : prev));
      return;
    }
    const next = toLayer(item);
    shownIdRef.current = item.id;
    setShowFront((wasFront) => {
      if (wasFront) setBack(next);
      else setFront(next);
      return !wasFront;
    });
  }, [item]);

  const caption = showFront ? front : back;

  return (
    <section
      id="go-online"
      ref={ref}
      aria-labelledby="go-online-heading"
      className="relative overflow-hidden border-t border-line/50 bg-bg px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgb(37_99_235/0.06),transparent_55%)]"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-[1120px] items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
        {/* ── Copy ── */}
        <header className={`max-w-xl ${seen ? "stage-enter" : "stage-pending"}`}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue sm:text-[12px]">
            {t("goOnline.eyebrow")}
          </p>
          <h2
            id="go-online-heading"
            className="mt-3 text-balance text-[1.75rem] font-bold leading-[1.12] tracking-tight text-ink sm:text-[2.15rem] lg:text-[2.45rem]"
          >
            {t("goOnline.title")}
          </h2>
          <p className="mt-4 text-pretty text-[14px] leading-relaxed text-muted sm:text-[15px]">
            {t("goOnline.body1")}
          </p>
          <p className="mt-3 text-pretty text-[14px] leading-relaxed text-muted sm:text-[15px]">
            {t("goOnline.body2")}
          </p>

          <ul
            className="mt-7 flex flex-wrap items-center gap-2"
            role="tablist"
            aria-label={t("goOnline.tabsAria")}
          >
            {showcase.map((s, i) => {
              const active = i === index;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => jumpTo(i)}
                    className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition-[background-color,color] duration-200 sm:text-[12px] ${
                      active
                        ? "bg-ink text-white shadow-sm"
                        : "bg-ink/[0.05] text-muted hover:bg-ink/[0.08] hover:text-ink"
                    }`}
                  >
                    {s.badge}
                  </button>
                </li>
              );
            })}
          </ul>
        </header>

        {/* ── Storefront stage ── */}
        <div
          className={`relative pb-16 sm:pb-14 ${seen ? "stage-enter-delay" : "stage-pending"}`}
        >
          <div
            className={`relative overflow-hidden rounded-2xl border border-line/70 bg-white shadow-[0_32px_64px_-28px_rgb(11_18_32/0.28)] sm:rounded-[1.25rem] ${
              live ? "stage-float" : ""
            }`}
          >
            <div className="flex items-center justify-between gap-3 border-b border-line/60 bg-[#fafbfc] px-3.5 py-2.5 sm:px-4">
              <Image
                src="/brand/mayar-wordmark.png"
                alt="Mayar"
                width={1112}
                height={348}
                className="h-5 w-auto shrink-0 object-contain sm:h-[1.35rem]"
              />
              <span className="shrink-0 rounded-md bg-blue px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white sm:text-[11px]">
                {t("goOnline.login")}
              </span>
            </div>

            {/* Fixed-height body so product cycles never resize the card */}
            <div className="grid h-[17.5rem] gap-4 p-3.5 sm:h-[15.5rem] sm:grid-cols-[1fr_minmax(0,11.5rem)] sm:gap-5 sm:p-5">
              <div
                key={`copy-${item.id}-${tick}`}
                className="stage-swap flex min-h-0 min-w-0 flex-col"
              >
                <span className="inline-flex h-5 w-fit items-center rounded-md bg-blue/10 px-2 text-[10px] font-semibold text-blue">
                  {item.badge}
                </span>
                <h3 className="mt-2 line-clamp-2 min-h-[2.45rem] text-[14px] font-bold leading-snug tracking-tight text-ink sm:min-h-[2.55rem] sm:text-[15px]">
                  {item.title}
                </h3>
                <p className="mt-1 min-h-[1.5rem] text-[15px] font-bold leading-none text-ink sm:text-base">
                  {item.price}
                  <span className="ml-1.5 text-[11px] font-medium text-muted">
                    {item.priceHint}
                  </span>
                </p>
                <p className="mt-2 line-clamp-3 min-h-[3.35rem] text-[11.5px] leading-relaxed text-muted sm:min-h-[3.5rem] sm:text-[12px]">
                  {item.blurb}
                </p>
                <div className="mt-auto flex items-center gap-2 pt-3">
                  <button
                    type="button"
                    tabIndex={-1}
                    className="relative inline-flex h-9 min-w-[7.5rem] flex-1 items-center justify-center overflow-hidden rounded-lg bg-blue px-3 text-[12px] font-bold text-white shadow-[0_8px_18px_-10px_rgb(37_99_235/0.55)] sm:flex-none sm:px-5"
                  >
                    {live ? (
                      <span
                        className="stage-shine pointer-events-none absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        aria-hidden
                      />
                    ) : null}
                    <span className="relative z-[1]">{item.cta}</span>
                  </button>
                  <button
                    type="button"
                    tabIndex={-1}
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-white text-muted"
                    aria-hidden
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M8 2.5v7.5M5.5 7.5 8 10l2.5-2.5M3 12.5h10"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="relative h-[10.5rem] overflow-hidden rounded-xl sm:h-full sm:min-h-0">
                <StageImageLayer layer={front} active={showFront} live={live} />
                <StageImageLayer layer={back} active={!showFront} live={live} />
                <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-ink/75 via-ink/15 to-transparent" />
                <div
                  key={`cap-${caption.id}-${tick}`}
                  className="stage-swap absolute inset-x-0 bottom-0 z-[2] p-2.5 sm:p-3"
                >
                  <p className="truncate text-[12px] font-bold text-white sm:text-[13px]">
                    {caption.imageCaption}
                  </p>
                  <p className="truncate text-[10px] text-white/75">
                    {caption.imageSub}
                  </p>
                </div>
              </div>
            </div>

            {/* Fixed stats strip — always one row height */}
            <div
              key={`stats-${item.id}-${tick}`}
              className="stage-swap-fast flex h-11 flex-nowrap items-center gap-1.5 overflow-hidden border-t border-line/50 px-3.5 sm:px-5"
            >
              {item.stats.slice(0, 4).map((label) => (
                <span
                  key={label}
                  className="inline-flex shrink-0 items-center rounded-md bg-ink/[0.04] px-2 py-1 text-[10px] font-medium text-muted"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Toast — outer float shell, inner content swap (no transform fight) */}
          <div
            className={`absolute -bottom-3 left-3 z-10 h-[7.75rem] w-[15.5rem] sm:-bottom-4 sm:left-4 sm:h-[8rem] sm:w-[16.5rem] ${
              live ? "stage-float-soft" : "opacity-0"
            }`}
          >
            <div
              className={`flex h-full w-full flex-col rounded-2xl border border-line/60 bg-white p-3.5 shadow-[0_18px_40px_-16px_rgb(11_18_32/0.35)] sm:p-4 ${
                seen ? "stage-toast-in" : ""
              }`}
            >
              <div
                key={`toast-${item.id}-${tick}`}
                className="stage-swap flex h-full flex-col"
              >
                <div className="flex min-h-0 flex-1 items-start gap-2.5">
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white ${
                      live ? "stage-check-pop" : ""
                    }`}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                      <path
                        d="M2.5 6.2 4.8 8.5 9.5 3.5"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-bold leading-snug text-ink sm:text-[13px]">
                      {t("goOnline.paymentSuccess")}
                    </p>
                    <p className="mt-0.5 truncate text-[11.5px] text-muted sm:text-[12px]">
                      {t("goOnline.amountPrefix")}{" "}
                      <span className="font-semibold text-ink">
                        {item.toastAmount}
                      </span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  tabIndex={-1}
                  className="mt-auto flex h-9 w-full shrink-0 items-center justify-center rounded-lg bg-blue text-[12px] font-bold text-white shadow-[0_8px_16px_-10px_rgb(37_99_235/0.55)]"
                >
                  {item.toastAction}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StageImageLayer({
  layer,
  active,
  live,
}: {
  layer: Layer;
  active: boolean;
  live: boolean;
}) {
  return (
    <div
      className={`stage-crossfade absolute inset-0 ${
        active ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden={!active}
    >
      <Image
        key={`${layer.id}-${active ? "on" : "off"}`}
        src={layer.image}
        alt=""
        fill
        sizes="(max-width: 640px) 90vw, 200px"
        className={`object-cover ${active && live ? "stage-kenburns" : ""}`}
      />
    </div>
  );
}
