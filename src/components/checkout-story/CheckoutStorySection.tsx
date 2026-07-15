"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { Buildings, CheckCircle } from "@phosphor-icons/react";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useI18n } from "@/i18n";
import { PhoneDevice } from "./PhoneDevice";

/** Real 71.5 × 149.6 mm, +5% width only so it doesn’t read too skinny. */
const PHONE_W = 71.5 * 1.05;
const PHONE_H = 149.6;
/** width / height of the phone frame */
const PHONE_ASPECT = PHONE_W / PHONE_H;

/**
 * Half-travel in rem: phone sits ± this past center.
 * Large enough to read as L→R and clear merchant copy on beat B,
 * without sticking to the viewport edges.
 * Mobile uses a shorter travel so the device peeks without burying copy.
 */
const PHONE_TRAVEL_REM = 16;
const PHONE_TRAVEL_REM_MOBILE = 8.5;

function clamp(n: number, a = 0, b = 1) {
  return Math.min(b, Math.max(a, n));
}

function smooth(t: number) {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
}

/**
 * Two-beat story — phone mostly middle, drifts left → right via transform:
 *   Beat A: left-of-center + buyer copy right (cream)
 *   Beat B: right-of-center + merchant copy left (navy)
 *
 * Horizontal motion is applied as a real length string on the phone node
 * (never `unitless-var * rem` in CSS calc — browsers drop that).
 * Text uses opacity + translate only (no width collapse / overflow crop).
 */
export function CheckoutStorySection() {
  const { t } = useI18n();
  const trackRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const progressRef = useScrollProgress(trackRef);

  useEffect(() => {
    const stage = stageRef.current;
    const track = trackRef.current;
    const phone = phoneRef.current;
    if (!stage || !track || !phone) return;

    const mq = window.matchMedia("(min-width: 1024px)");
    let isDesktop = mq.matches;
    const onMq = () => {
      isDesktop = mq.matches;
    };
    mq.addEventListener("change", onMq);

    const apply = (p: number) => {
      // Slightly front-load travel so phone is already rightward
      // by the time merchant copy becomes readable.
      const phoneT = smooth(clamp(p / 0.92));

      // Buyer out as phone crosses; merchant in once phone is right-of-center
      // Slight crossfade so the stage never reads empty mid-handoff
      const buyer = 1 - smooth((p - 0.1) / 0.38);
      const merchant = smooth((p - 0.42) / 0.38);

      const lift = Math.sin(Math.PI * p);
      const phoneScale = 1 + 0.04 * lift;
      const phoneY = -6 * lift;
      const toast = 1 - smooth((p - 0.05) / 0.28);

      // Mobile: shorter travel so the phone peeks without covering left copy
      const travel = isDesktop ? PHONE_TRAVEL_REM : PHONE_TRAVEL_REM_MOBILE;
      // -TRAVEL → +TRAVEL rem (actual CSS length — always moves)
      const phoneXRem = (phoneT * 2 - 1) * travel;
      const buyerO = clamp(buyer);
      const merchantO = clamp(merchant);
      const buyerX = (1 - buyerO) * 18;
      const merchantX = (1 - merchantO) * -18;

      // Drive phone transform in JS — no CSS var calc footguns
      phone.style.transform = `translate3d(calc(-50% + ${phoneXRem.toFixed(3)}rem), calc(-50% + ${phoneY.toFixed(1)}px), 0) scale(${phoneScale.toFixed(4)})`;

      // Copy / toast / story surfaces — CSS vars written every frame so React
      // re-renders can't stick them on initial values.
      for (const el of [stage, track]) {
        el.style.setProperty("--story", p.toFixed(4));
        el.style.setProperty("--buyer-o", buyerO.toFixed(4));
        el.style.setProperty("--merchant-o", merchantO.toFixed(4));
        el.style.setProperty("--buyer-x", `${buyerX.toFixed(1)}px`);
        el.style.setProperty("--merchant-x", `${merchantX.toFixed(1)}px`);
        el.style.setProperty("--toast-o", clamp(toast).toFixed(4));
      }
    };

    let raf = 0;
    const tick = () => {
      apply(progressRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      mq.removeEventListener("change", onMq);
    };
  }, [progressRef]);

  // Initial (static) values only — animated props are written by rAF, not React style
  const initCopyVars = {
    ["--buyer-o"]: 1,
    ["--merchant-o"]: 0,
    ["--buyer-x"]: "0px",
    ["--merchant-x"]: "0px",
    ["--toast-o"]: 1,
  } as CSSProperties;

  return (
    <section
      id="checkout-story"
      ref={trackRef}
      aria-label={t("checkoutStory.sectionAria")}
      className="checkout-story relative isolate h-[230vh]"
      style={{ ["--story" as string]: 0, ...initCopyVars }}
    >
      <div className="sticky top-0 flex h-[100dvh] max-h-[100dvh] items-center overflow-x-clip overflow-y-visible px-4 py-6 sm:px-6 lg:px-10">
        {/* Surfaces */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            opacity: "calc(1 - var(--story))",
            background:
              "linear-gradient(180deg, #fbfaf7 0%, #f4f2ec 28%, #eef1f6 62%, #e4eaf3 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            opacity: "var(--story)",
            background:
              "linear-gradient(180deg, #1a2f52 0%, #0f1f3d 18%, #0a162e 42%, #071022 68%, #030810 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            opacity: "calc(var(--story) * var(--story))",
            background:
              "radial-gradient(ellipse 70% 55% at 50% 40%, rgb(37 99 235 / 0.28), transparent 58%)",
          }}
        />

        {/*
          Stage: phone pinned to horizontal center, translated by JS rem length.
          Copy parked left/right — fade + slide only (no crop).
        */}
        <div
          ref={stageRef}
          className="relative z-[1] mx-auto h-full w-full max-w-[1120px]"
          style={initCopyVars}
        >
          {/* Merchant — left side of stage */}
          <div
            className="pointer-events-none absolute top-1/2 left-0 z-[2] hidden w-[min(21rem,32%)] lg:block sm:left-2 lg:left-3"
            style={{
              opacity: "var(--merchant-o)",
              transform: "translate3d(var(--merchant-x), -50%, 0)",
              willChange: "opacity, transform",
            }}
          >
            <MerchantCopy />
          </div>

          {/* Buyer — right side of stage (desktop / tablet). Mobile uses slot below. */}
          <div
            className="pointer-events-none absolute top-1/2 right-0 z-[2] hidden w-[min(21rem,34%)] sm:right-2 md:block lg:right-3"
            style={{
              opacity: "var(--buyer-o)",
              transform: "translate3d(var(--buyer-x), -50%, 0)",
              willChange: "opacity, transform",
            }}
          >
            <BuyerCopy />
          </div>

          {/*
            Phone — left:50% top:50%; rAF sets translate3d(-50% + Xrem, …).
            Initial transform places it left-of-center for first paint.
            Mobile: smaller so merchant/buyer copy keep a clear left column.
          */}
          <div
            ref={phoneRef}
            className="absolute top-1/2 left-1/2 z-[3] h-[min(24rem,50dvh)] w-[calc(min(24rem,50dvh)*var(--phone-aspect))] sm:h-[min(30rem,58dvh)] sm:w-[calc(min(30rem,58dvh)*var(--phone-aspect))] lg:h-[min(42rem,78dvh)] lg:w-[calc(min(42rem,78dvh)*var(--phone-aspect))]"
            style={
              {
                ["--phone-aspect" as string]: String(PHONE_ASPECT),
                transform: `translate3d(calc(-50% + -${PHONE_TRAVEL_REM_MOBILE}rem), -50%, 0) scale(1)`,
                transformOrigin: "center center",
                willChange: "transform",
              } as CSSProperties
            }
          >
            <PhoneDevice progressRef={progressRef} />

            <div
              className="absolute -bottom-1 left-0 z-20 w-[min(100%,13.5rem)] sm:-bottom-2 sm:-left-2"
              style={{
                opacity: "var(--toast-o)",
                transform:
                  "translate3d(0, calc((1 - var(--toast-o)) * 18px), 0)",
                pointerEvents: "none",
                willChange: "opacity, transform",
              }}
            >
              <BuyerToast />
            </div>
          </div>
        </div>

        {/*
          Mobile copy slots — clear of the phone:
          Beat A phone left → buyer copy on the right.
          Beat B phone right → merchant copy on the left
          (was full-width under the phone: "konversi" clipped to "kon").
          Merchant is vertically centered so the list clears bottom FABs.
        */}
        <div
          className="pointer-events-none absolute top-[max(5.25rem,11%)] right-4 z-[4] w-[min(17.5rem,calc(100%-9.25rem))] md:hidden"
          style={{
            opacity: "var(--buyer-o)",
            transform: "translate3d(0, calc((1 - var(--buyer-o)) * 12px), 0)",
            willChange: "opacity, transform",
          }}
        >
          <BuyerCopy />
        </div>
        <div
          className="pointer-events-none absolute top-1/2 left-4 z-[4] w-[min(17.5rem,calc(100%-9.25rem))] max-h-[min(70dvh,32rem)] overflow-y-auto lg:hidden"
          style={{
            opacity: "var(--merchant-o)",
            transform:
              "translate3d(0, calc(-50% + (1 - var(--merchant-o)) * 14px), 0)",
            willChange: "opacity, transform",
          }}
        >
          <MerchantCopy />
        </div>
      </div>
    </section>
  );
}

function BuyerCopy() {
  const { t } = useI18n();
  return (
    <header className="min-w-0">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-blue sm:text-[12px]">
        {t("checkoutStory.buyer.eyebrow")}
      </p>
      <h2 className="mt-2.5 text-balance text-[1.25rem] font-bold leading-[1.1] tracking-tight text-ink sm:text-[1.55rem] lg:text-[1.9rem]">
        {t("checkoutStory.buyer.titleBefore")}{" "}
        <span className="text-blue">
          {t("checkoutStory.buyer.titleHighlight")}
        </span>
      </h2>
      <p className="mt-2.5 text-pretty break-words text-[12.5px] leading-relaxed text-muted sm:mt-3 sm:text-[14px]">
        {t("checkoutStory.buyer.body")}
      </p>
    </header>
  );
}

function MerchantCopy() {
  const { t, messages } = useI18n();
  const features = (messages.checkoutStory?.merchant?.features ?? []) as string[];
  return (
    <header className="min-w-0">
      <h2 className="text-balance text-[1.2rem] font-bold leading-[1.15] tracking-tight text-white sm:text-[1.5rem] lg:text-[1.8rem]">
        {t("checkoutStory.merchant.titleBefore")}{" "}
        <span className="text-[#60a5fa]">
          {t("checkoutStory.merchant.titleHighlight")}
        </span>
      </h2>
      <p className="mt-2.5 text-pretty break-words text-[12.5px] leading-relaxed text-white/65 sm:mt-3 sm:text-[14px]">
        {t("checkoutStory.merchant.bodyBefore")}{" "}
        <span className="font-semibold text-white underline decoration-white/30 underline-offset-2">
          {t("checkoutStory.merchant.oneClick")}
        </span>{" "}
        {t("checkoutStory.merchant.bodyMid")}{" "}
        <span className="font-semibold text-white underline decoration-white/30 underline-offset-2">
          {t("checkoutStory.merchant.buyerNetwork")}
        </span>
        {t("checkoutStory.merchant.bodyAfter")}
      </p>
      <ul className="mt-3 space-y-1 sm:mt-5 sm:space-y-2">
        {features.map((f) => (
          <li
            key={f}
            className="flex items-center gap-2 text-[12px] text-white/90 sm:text-[14px]"
          >
            <CheckCircle
              weight="fill"
              className="h-4 w-4 shrink-0 text-[#60a5fa] sm:h-[1.1rem] sm:w-[1.1rem]"
              aria-hidden
            />
            <span className="font-medium">{f}</span>
          </li>
        ))}
      </ul>
    </header>
  );
}

function BuyerToast() {
  const { t } = useI18n();
  return (
    <div className="rounded-2xl border border-line/60 bg-white p-3 shadow-[0_18px_40px_-14px_rgb(15_23_42/0.32)] sm:p-3.5">
      <div className="flex flex-col items-center text-center">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue/[0.1] text-blue">
          <Buildings weight="fill" className="h-4 w-4" aria-hidden />
        </span>
        <p className="mt-2 text-[11.5px] font-bold leading-snug text-ink sm:text-[12.5px]">
          {t("checkoutStory.toast.title")}
        </p>
        <button
          type="button"
          tabIndex={-1}
          className="mt-2.5 flex h-8 w-full items-center justify-center rounded-full border-[1.5px] border-ink/80 bg-white text-[11px] font-bold text-ink sm:h-9 sm:text-[12px]"
        >
          {t("checkoutStory.toast.cta")}
        </button>
      </div>
    </div>
  );
}
