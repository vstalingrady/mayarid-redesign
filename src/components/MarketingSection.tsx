"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Buildings,
  Columns,
  Image as ImageIcon,
  List,
  Minus,
  Rectangle,
  TextH,
  TextT,
  Timer,
  VideoCamera,
} from "@phosphor-icons/react";
import { useStageCycle, useStageInView } from "@/hooks/useStageCycle";
import { useI18n } from "@/i18n";

const CYCLE_MS = 4200;

const BLOCK_META = [
  { id: "columns", Icon: Columns },
  { id: "heading", Icon: TextH },
  { id: "text", Icon: TextT },
  { id: "image", Icon: ImageIcon },
  { id: "button", Icon: Rectangle },
  { id: "divider", Icon: Minus },
  { id: "menu", Icon: List },
  { id: "timer", Icon: Timer },
  { id: "video", Icon: VideoCamera },
] as const;

const CAMPAIGN_META = [
  {
    id: "labor-day",
    image: "/specimen/marketing/banner-labor-day.jpg",
  },
  {
    id: "club",
    image: "/specimen/marketing/banner-club.jpg",
  },
  {
    id: "webinar",
    image: "/specimen/marketing/banner-webinar.jpg",
  },
] as const;

type Campaign = {
  id: string;
  title: string;
  image: string;
  imageAlt: string;
  freeShip: string;
  nav: string[];
  toastTitle: string;
  toastSub: string;
  toastAction: string;
};

type Layer = {
  id: string;
  image: string;
  imageAlt: string;
};

function toLayer(item: Campaign): Layer {
  return { id: item.id, image: item.image, imageAlt: item.imageAlt };
}

/**
 * Built-in marketing — email builder mock matching Mayar marketing specimen.
 * Flat campaign banners + builder chrome + floating blast toast.
 */
export function MarketingSection() {
  const { t, messages } = useI18n();
  const { ref, inView, seen } = useStageInView(0.05);

  const campaigns = useMemo((): Campaign[] => {
    const copy = (messages.marketing?.campaigns ?? {}) as Record<
      string,
      {
        title?: string;
        freeShip?: string;
        nav?: string[];
        toastTitle?: string;
        toastSub?: string;
        toastAction?: string;
        imageAlt?: string;
      }
    >;
    return CAMPAIGN_META.map((m) => {
      const c = copy[m.id];
      return {
        id: m.id,
        image: m.image,
        title: c?.title ?? m.id,
        freeShip: c?.freeShip ?? "",
        nav: Array.isArray(c?.nav) ? c.nav : [],
        toastTitle: c?.toastTitle ?? "",
        toastSub: c?.toastSub ?? "",
        toastAction: c?.toastAction ?? "",
        imageAlt: c?.imageAlt ?? "",
      };
    });
  }, [messages]);

  const { index, tick } = useStageCycle(campaigns.length, CYCLE_MS, inView);

  const item = campaigns[index] ?? campaigns[0]!;
  const live = seen;

  const [front, setFront] = useState<Layer>(() => toLayer(campaigns[0]!));
  const [back, setBack] = useState<Layer>(() => toLayer(campaigns[0]!));
  const [showFront, setShowFront] = useState(true);
  const shownIdRef = useRef<string>(campaigns[0]!.id);

  useEffect(() => {
    if (item.id === shownIdRef.current) {
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

  return (
    <section
      id="marketing"
      ref={ref}
      aria-labelledby="marketing-heading"
      className="relative overflow-hidden border-t border-line/40 bg-[#eef2f8] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24"
    >
      <div className="relative mx-auto grid max-w-[1120px] items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12 xl:gap-16">
        {/* Copy — matches specimen: no campaign pills */}
        <header className={`max-w-md ${seen ? "stage-enter" : "stage-pending"}`}>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue sm:text-[12px]">
            {t("marketing.eyebrow")}
          </p>
          <h2
            id="marketing-heading"
            className="mt-3 text-balance text-[1.85rem] font-bold leading-[1.1] tracking-tight text-ink sm:text-[2.25rem] lg:text-[2.55rem]"
          >
            {t("marketing.title")}
          </h2>
          <p className="mt-5 text-pretty text-[14px] leading-relaxed text-muted sm:text-[15px]">
            {t("marketing.body")}
          </p>
        </header>

        {/* Email builder stage */}
        <div
          className={`relative pb-14 sm:pb-12 ${seen ? "stage-enter-delay" : "stage-pending"}`}
        >
          <div
            className={`relative overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_28px_64px_-24px_rgb(15_23_42/0.28)] sm:rounded-[1.15rem] ${
              live ? "stage-float" : ""
            }`}
          >
            {/* Window chrome */}
            <div className="flex items-center justify-between gap-3 border-b border-line/50 bg-[#f7f8fa] px-3.5 py-2.5 sm:px-4">
              <div className="flex min-w-0 items-center gap-1.5">
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#ff5f57]" />
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#febc2e]" />
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#28c840]" />
                <span
                  key={`title-${item.id}-${tick}`}
                  className="stage-swap ml-2 truncate text-[11px] font-medium text-muted sm:text-[12px]"
                >
                  {item.title}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <span className="rounded-md border border-line/80 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-muted sm:text-[10px]">
                  {t("marketing.desktop")}
                </span>
                <span className="rounded-md bg-blue px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white sm:text-[10px]">
                  {t("marketing.save")}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[1fr_5.75rem]">
              {/* Email canvas */}
              <div className="min-w-0 bg-[#f4f6f9] p-2.5 sm:p-3.5">
                <div className="overflow-hidden rounded-lg border border-line/50 bg-white shadow-[0_8px_24px_-18px_rgb(15_23_42/0.2)]">
                  {/* Free shipping strip */}
                  <p
                    key={`ship-${item.id}-${tick}`}
                    className="stage-swap border-b border-line/30 bg-white px-3 py-1.5 text-center text-[8px] font-semibold uppercase tracking-[0.12em] text-muted sm:text-[9px]"
                  >
                    {item.freeShip}
                  </p>

                  {/* Brand header */}
                  <div className="flex items-center justify-between gap-3 border-b border-line/40 bg-white px-3 py-2.5 sm:px-3.5">
                    <Image
                      src="/brand/mayar-wordmark.png"
                      alt="Mayar"
                      width={1112}
                      height={348}
                      className="h-[0.95rem] w-auto object-contain sm:h-4"
                    />
                    <nav
                      key={`nav-${item.id}-${tick}`}
                      className="stage-swap flex items-center gap-2.5 sm:gap-3.5"
                      aria-hidden
                    >
                      {item.nav.map((link) => (
                        <span
                          key={link}
                          className="text-[10px] font-medium text-ink/70 sm:text-[11px]"
                        >
                          {link}
                        </span>
                      ))}
                    </nav>
                  </div>

                  {/* Campaign banner — flat promo art, no ken-burns (keeps type sharp) */}
                  <div className="relative aspect-[16/10] w-full bg-ink/[0.03]">
                    <CampaignImageLayer layer={front} active={showFront} />
                    <CampaignImageLayer layer={back} active={!showFront} />
                  </div>
                </div>
              </div>

              {/* Block palette */}
              <div className="hidden border-l border-line/40 bg-[#fafbfc] p-2 sm:block">
                <div className="grid grid-cols-2 gap-1.5">
                  {BLOCK_META.map(({ id, Icon }) => (
                    <div
                      key={id}
                      className="flex flex-col items-center justify-center gap-1 rounded-md border border-line/40 bg-white px-1 py-2 shadow-[0_1px_2px_rgb(15_23_42/0.04)]"
                    >
                      <Icon
                        weight="regular"
                        className="h-3.5 w-3.5 text-ink/55"
                        aria-hidden
                      />
                      <span className="text-[7.5px] font-medium leading-none text-muted">
                        {t(`marketing.blocks.${id}`)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Toast — centered icon + outline CTA, fixed size */}
          <div
            className={`absolute -bottom-2 left-2 z-10 w-[15.5rem] sm:-bottom-3 sm:left-4 sm:w-[16.25rem] ${
              live ? "stage-float-soft" : "opacity-0"
            }`}
          >
            <div
              className={`rounded-2xl border border-line/50 bg-white px-4 pb-3.5 pt-3.5 shadow-[0_18px_40px_-14px_rgb(15_23_42/0.32)] sm:px-5 sm:pb-4 sm:pt-4 ${
                seen ? "stage-toast-in" : ""
              }`}
            >
              <div
                key={`toast-${item.id}-${tick}`}
                className="stage-swap flex flex-col items-center text-center"
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full bg-blue/[0.1] text-blue ${
                    live ? "stage-check-pop" : ""
                  }`}
                >
                  <Buildings weight="fill" className="h-4 w-4" aria-hidden />
                </span>
                <p className="mt-2.5 text-[12.5px] font-bold leading-snug text-ink sm:text-[13px]">
                  {item.toastTitle}
                </p>
                <p className="mt-0.5 text-[11.5px] leading-snug text-muted sm:text-[12px]">
                  {item.toastSub}
                </p>
                <button
                  type="button"
                  tabIndex={-1}
                  className="mt-3 flex h-9 w-full items-center justify-center rounded-full border-[1.5px] border-ink/85 bg-white text-[12px] font-bold text-ink transition-colors hover:bg-ink hover:text-white"
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

function CampaignImageLayer({
  layer,
  active,
}: {
  layer: Layer;
  active: boolean;
}) {
  return (
    <div
      className={`stage-crossfade absolute inset-0 ${
        active ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden={!active}
    >
      <Image
        src={layer.image}
        alt={active ? layer.imageAlt : ""}
        fill
        sizes="(max-width: 640px) 90vw, 480px"
        className="object-cover object-center"
        priority={active}
      />
    </div>
  );
}
