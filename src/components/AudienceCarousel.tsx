"use client";

import { CheckCircle } from "@phosphor-icons/react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AUDIENCE_INTERVAL_MS,
  AUDIENCE_TRANSITION_MS,
  AUDIENCES,
} from "@/data/audiences";
import { useI18n } from "@/i18n";

type AudienceCopy = {
  label: string;
  product: string;
  status: string;
  alt: string;
};

function useAudienceCopies() {
  const { messages, t } = useI18n();
  const items = (messages.audiences?.items ?? {}) as Record<
    string,
    AudienceCopy
  >;
  const get = (id: string): AudienceCopy => ({
    label: items[id]?.label ?? id,
    product: items[id]?.product ?? "",
    status: items[id]?.status ?? "",
    alt: items[id]?.alt ?? "",
  });
  return { t, get };
}

/** Vertical profession wheel — uniform rows so the track can scroll cleanly */
const LINE_H = 32;
const WINDOW_H = LINE_H * 3;

/**
 * Infinite-loop slot: external index 0..n-1 maps to a sliding position
 * across a triple-cloned track. After each animated step past the middle
 * band, we snap back without a transition so motion never reverses.
 */
function useInfiniteSlot(index: number, n: number) {
  const [slot, setSlot] = useState(n + index);
  const [instant, setInstant] = useState(false);
  const prevIndexRef = useRef(index);
  const slotRef = useRef(slot);

  useLayoutEffect(() => {
    slotRef.current = slot;
  }, [slot]);

  useLayoutEffect(() => {
    const prev = prevIndexRef.current;
    if (prev === index) return;
    prevIndexRef.current = index;

    const fwd = (index - prev + n) % n;
    const back = (prev - index + n) % n;
    if (fwd === 0) return;

    // Shortest path keeps manual jumps feeling right
    if (fwd <= back) setSlot((s) => s + fwd);
    else setSlot((s) => s - back);
  }, [index, n]);

  const onTransitionEnd = useCallback(() => {
    const s = slotRef.current;
    if (s >= 2 * n) {
      // Same event turn: disable transition + jump back into middle band
      setInstant(true);
      setSlot(s - n);
    } else if (s < n) {
      setInstant(true);
      setSlot(s + n);
    }
  }, [n]);

  // Re-enable transitions after the seamless snap paints
  useLayoutEffect(() => {
    if (!instant) return;
    const id = window.requestAnimationFrame(() => setInstant(false));
    return () => window.cancelAnimationFrame(id);
  }, [instant]);

  const slides = useMemo(
    () =>
      Array.from({ length: n * 3 }, (_, i) => ({
        item: AUDIENCES[i % n]!,
        realIndex: i % n,
        slot: i,
        key: `${i}-${AUDIENCES[i % n]!.id}`,
      })),
    [n],
  );

  return { slot, instant, onTransitionEnd, slides };
}

/**
 * Owns the audience cycle. Text rail + stage share one index.
 * Always auto-advances; hover on text pauses without getting stuck.
 */
export function useAudienceCycle() {
  const [index, setIndex] = useState(0);
  const pausedRef = useRef(false);
  const [, setPausedTick] = useState(0);

  const setPaused = useCallback((p: boolean) => {
    pausedRef.current = p;
    setPausedTick((t) => t + 1);
  }, []);

  const next = useCallback(() => {
    if (pausedRef.current) return;
    if (typeof document !== "undefined" && document.hidden) return;
    setIndex((i) => (i + 1) % AUDIENCES.length);
  }, []);

  useEffect(() => {
    const id = window.setInterval(next, AUDIENCE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [next]);

  return {
    index,
    setIndex,
    audience: AUDIENCES[index]!,
    setPaused,
  };
}

const labelBaseClass =
  "whitespace-nowrap leading-none tracking-tight transition-[font-size,color,font-weight,opacity] duration-300";

/**
 * Static "for" + vertical profession wheel with infinite scroll.
 */
export function AudienceText({
  index,
  setIndex,
  setPaused,
}: {
  index: number;
  setIndex: (i: number) => void;
  setPaused: (p: boolean) => void;
}) {
  const { t, get } = useAudienceCopies();
  const n = AUDIENCES.length;
  const { slot, instant, onTransitionEnd, slides } = useInfiniteSlot(index, n);
  // Center the active row in the 3-row window
  const trackY = LINE_H - slot * LINE_H;

  return (
    <div
      className="relative mt-0 select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label={t("audiences.regionAria")}
    >
      <div
        className="flex items-center gap-3 sm:gap-3.5"
        style={{ height: WINDOW_H }}
      >
        <span className="shrink-0 text-[1.65rem] font-semibold tracking-tight leading-none text-ink/40 sm:text-[1.95rem] lg:text-[2.15rem]">
          {t("hero.for")}
        </span>

        <div className="relative grid w-max max-w-full">
          {AUDIENCES.map((item) => (
            <span
              key={`size-${item.id}`}
              className="invisible col-start-1 row-start-1 text-[1.65rem] font-bold tracking-tight whitespace-nowrap leading-none sm:text-[1.95rem] lg:text-[2.15rem]"
              aria-hidden
            >
              {get(item.id).label}
            </span>
          ))}

          <div
            className="relative col-start-1 row-start-1 overflow-hidden"
            style={{
              height: WINDOW_H,
              maskImage:
                "linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)",
            }}
            aria-live="polite"
          >
            <div
              className="absolute left-0 top-0 will-change-transform"
              style={{
                transform: `translate3d(0, ${trackY}px, 0)`,
                transition: instant
                  ? "none"
                  : `transform ${AUDIENCE_TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
              }}
              onTransitionEnd={(e) => {
                if (
                  e.target === e.currentTarget &&
                  e.propertyName === "transform"
                ) {
                  onTransitionEnd();
                }
              }}
            >
              {slides.map(({ item, realIndex, key }) => {
                const active = realIndex === index;
                const copy = get(item.id);
                // Distance on the infinite slot line (approx for styling)
                const dist = Math.min(
                  Math.abs(realIndex - index),
                  Math.abs(realIndex - index + n),
                  Math.abs(realIndex - index - n),
                );
                const peek = dist === 1;
                return (
                  <button
                    key={key}
                    type="button"
                    className={`${labelBaseClass} flex items-center text-left ${
                      active
                        ? "text-[1.65rem] font-bold text-blue sm:text-[1.95rem] lg:text-[2.15rem]"
                        : peek
                          ? "text-[1.2rem] font-semibold text-ink/30 hover:text-ink/45 sm:text-[1.35rem] lg:text-[1.45rem]"
                          : "text-[1.2rem] font-semibold text-ink/12 sm:text-[1.35rem] lg:text-[1.45rem]"
                    }`}
                    style={{ height: LINE_H }}
                    onClick={() => setIndex(realIndex)}
                    aria-label={t("audiences.forLabel").replace(
                      "{label}",
                      copy.label,
                    )}
                    aria-current={active ? "true" : undefined}
                    tabIndex={active || peek ? 0 : -1}
                  >
                    <span
                      className={`block origin-left transition-transform duration-300 ${
                        active ? "scale-100" : "scale-[0.92]"
                      }`}
                    >
                      {copy.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentToast({
  status,
  amount,
  product,
  label,
}: {
  status: string;
  amount: string;
  product: string;
  label: string;
}) {
  return (
    <div
      key={label + amount}
      className="flex w-full max-w-[17.5rem] items-center gap-2.5 rounded-2xl border border-white/80 bg-white px-3 py-2.5 shadow-[0_12px_32px_-12px_rgb(11_18_32/0.4)] sm:gap-3 sm:px-3.5 sm:py-3"
      style={{
        animation: `audience-amount-in ${AUDIENCE_TRANSITION_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`,
      }}
    >
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#047857]/[0.12] text-[#047857] sm:h-10 sm:w-10"
        aria-hidden
      >
        <CheckCircle weight="fill" size={20} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#047857]">
          {status}
        </p>
        <p className="truncate text-[15px] font-semibold tabular-nums leading-tight text-ink sm:text-[16px]">
          {amount}
        </p>
        <p className="truncate text-[11px] text-muted sm:text-[12px]">
          {product}
          <span className="text-ink/25"> · </span>
          <span className="font-medium text-blue">{label}</span>
        </p>
      </div>
    </div>
  );
}

/**
 * Infinite horizontal stage with 3D coverflow peeks.
 * Left cards yaw toward center, right cards yaw the other way,
 * active card sits forward on the Z axis.
 */
const TRUST_AVATAR_META = [
  {
    id: "maksimalindiri",
    src: "/specimen/trust/avatars/TcLRqSUo3Klghw1o5os3RGp48E.png",
  },
  {
    id: "tres",
    src: "/specimen/trust/avatars/XLmlwVxqngM68gxc9zjy0x96tro.png",
  },
  {
    id: "bossexcel",
    src: "/specimen/trust/avatars/eyplrOSDq1coV2lHSuoadjdwc.png",
  },
  {
    id: "anang",
    src: "/specimen/trust/avatars/a52anRJI38Hr8D2BmeQvSkJdyE.png",
  },
  {
    id: "dinar",
    src: "/specimen/trust/avatars/gqKnpMEBL5rODRqWaQCnW4aQBA.png",
  },
] as const;

function TrustBadge({ className }: { className?: string }) {
  const { t, messages } = useI18n();
  const [hovered, setHovered] = useState<number | null>(null);
  const avatars = (messages.trust?.avatars ?? {}) as Record<
    string,
    { name?: string; role?: string }
  >;

  return (
    <div
      className={`m-enter m-trust flex items-center gap-3 ${className ?? ""}`}
    >
      <ul className="relative z-10 flex shrink-0 items-center overflow-visible" role="list">
        {TRUST_AVATAR_META.map((a, i) => {
          const active = hovered === i;
          const last = i === TRUST_AVATAR_META.length - 1;
          const name = avatars[a.id]?.name ?? a.id;
          const role = avatars[a.id]?.role ?? "";
          // Keep edge tooltips on-screen
          const tipPos =
            i === 0
              ? "left-0 translate-x-0"
              : last
                ? "right-0 left-auto translate-x-0"
                : "left-1/2 -translate-x-1/2";
          const caretPos =
            i === 0
              ? "left-4 translate-x-0"
              : last
                ? "right-4 left-auto translate-x-0"
                : "left-1/2 -translate-x-1/2";

          return (
            <li
              key={a.src}
              className="relative"
              style={{
                marginLeft: i === 0 ? 0 : -10,
                // Hovered face pops above the stack; otherwise keep left-over-right order
                zIndex: active ? 40 : TRUST_AVATAR_META.length - i,
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
            >
              <button
                type="button"
                className="group relative block h-9 w-9 rounded-full outline-none transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:scale-110 focus-visible:-translate-y-1 focus-visible:scale-110 focus-visible:ring-2 focus-visible:ring-blue/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg sm:h-10 sm:w-10"
                aria-label={`${name}, ${role}`}
                aria-describedby={`trust-tip-${i}`}
              >
                {/* Photo fills the full disc — background-image avoids positioning quirks */}
                <span
                  className="absolute inset-0 rounded-full bg-ink/5 bg-cover bg-center shadow-[0_2px_8px_-2px_rgb(11_18_32/0.28)] transition-[filter] duration-300 group-hover:brightness-105"
                  style={{ backgroundImage: `url('${a.src}')` }}
                />
                {/*
                  White stroke drawn ON the photo edge (inset), not as an outer
                  border that leaves a halo/gap between ring and image.
                */}
                <span
                  className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_0_2.5px_#fff] transition-shadow duration-300 group-hover:shadow-[inset_0_0_0_2.5px_#fff,0_8px_18px_-8px_rgb(11_18_32/0.35)]"
                  aria-hidden
                />

                {/* Hover / focus description card */}
                <span
                  id={`trust-tip-${i}`}
                  role="tooltip"
                  className={`pointer-events-none absolute bottom-[calc(100%+10px)] z-50 w-max max-w-[11.5rem] rounded-xl border border-ink/8 bg-white px-2.5 py-1.5 text-left shadow-[0_12px_28px_-12px_rgb(11_18_32/0.35)] transition-[opacity,transform] duration-200 ${tipPos} ${
                    active
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                >
                  <span className="block text-[12px] font-semibold leading-tight text-ink">
                    {name}
                  </span>
                  <span className="mt-0.5 block text-[10px] font-medium leading-snug text-muted">
                    {role}
                  </span>
                  <span
                    className={`absolute top-full h-0 w-0 border-x-[5px] border-t-[5px] border-x-transparent border-t-white ${caretPos}`}
                    aria-hidden
                  />
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="min-w-0 flex-1 sm:min-w-[16.5rem]">
        <div
          className="flex items-center gap-0.5"
          aria-label={t("trust.ratingAria")}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="star star-gold" />
          ))}
        </div>
        <p className="mt-0.5 text-[12px] font-medium leading-snug text-ink-soft sm:text-[13px] sm:whitespace-nowrap">
          {t("trust.badgeBefore")}{" "}
          <span className="font-bold text-ink tabular-nums">149.969+</span>{" "}
          {t("trust.badgeBusinesses")}
          <span className="mx-1.5 text-muted-faint" aria-hidden>
            ·
          </span>
          <span className="font-bold text-ink tabular-nums">96%</span>{" "}
          {t("trust.badgeSatisfaction")}
        </p>
      </div>
    </div>
  );
}

export function AudienceStage({
  index,
  setIndex,
}: {
  index: number;
  setIndex: (i: number) => void;
  /** @deprecated stage no longer pauses autoplay — kept optional for callers */
  setPaused?: (p: boolean) => void;
}) {
  const { t, get } = useAudienceCopies();
  const n = AUDIENCES.length;
  const viewportRef = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState({ vw: 0, slide: 0, gap: 0, side: 0 });
  const { slot, instant, onTransitionEnd, slides } = useInfiniteSlot(index, n);
  // Hide bottom gradient + toast while the track is mid-scroll
  const [sliding, setSliding] = useState(false);
  const prevIndexRef = useRef(index);

  const measure = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const vw = el.clientWidth;
    const slide = vw * 0.7;
    const gap = Math.max(8, vw * 0.018);
    const side = (vw - slide) / 2;
    setMetrics({ vw, slide, gap, side });
  }, []);

  useLayoutEffect(() => {
    measure();
    const el = viewportRef.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  useLayoutEffect(() => {
    if (prevIndexRef.current === index) return;
    prevIndexRef.current = index;
    if (instant) return;
    // Kick sliding chrome after paint so we don't cascade setState in effect
    const start = window.requestAnimationFrame(() => {
      setSliding(true);
    });
    const t = window.setTimeout(
      () => setSliding(false),
      AUDIENCE_TRANSITION_MS + 60,
    );
    return () => {
      window.cancelAnimationFrame(start);
      window.clearTimeout(t);
    };
  }, [index, instant]);

  const finishSlide = useCallback(() => {
    onTransitionEnd();
    setSliding(false);
  }, [onTransitionEnd]);

  const offset =
    metrics.vw > 0
      ? metrics.side - slot * (metrics.slide + metrics.gap)
      : 0;

  // Chrome (gradient + toast) only on the settled active card
  const showChrome = !sliding;

  return (
    <div className="relative flex h-full w-full flex-col">
      {/* Clip outer — perspective lives on an inner shell so 3D isn't flattened */}
      <div
        ref={viewportRef}
        className="relative min-h-0 w-full flex-1 overflow-hidden"
      >
        <div
          className="pointer-events-none absolute bottom-[3%] left-1/2 h-12 w-[58%] -translate-x-1/2 rounded-[100%] bg-ink/[0.14] blur-2xl"
          aria-hidden
        />

        {/* Sliding track — per-card perspective() so 3D survives overflow:hidden */}
        <div
          className="absolute inset-y-0 left-0 flex h-full items-center will-change-transform"
          style={{
            gap: metrics.gap || 12,
            transform: `translate3d(${offset}px, 0, 0)`,
            transition:
              metrics.vw > 0 && !instant
                ? `transform ${AUDIENCE_TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`
                : "none",
          }}
          onTransitionEnd={(e) => {
            if (
              e.target === e.currentTarget &&
              e.propertyName === "transform"
            ) {
              finishSlide();
            }
          }}
        >
          {slides.map(({ item, realIndex, slot: slideSlot, key }) => {
            const dist = slideSlot - slot;
            const abs = Math.abs(dist);
            const active = dist === 0;
            const copy = get(item.id);
            // Coverflow: left cards yaw toward center, right the other way
            const rotateY = active ? 0 : dist < 0 ? 38 : -38;
            const scale = active ? 1 : 0.84;
            const translateZ = active ? 40 : -80;
            const opacity =
              abs === 0 ? 1 : abs === 1 ? 0.68 : abs === 2 ? 0.25 : 0;
            // Origin faces the center so peeks swing like a coverflow deck
            const origin = active
              ? "center center"
              : dist < 0
                ? "right center"
                : "left center";
            const chromeOn = active && showChrome;

            return (
              <button
                key={key}
                type="button"
                className="relative h-[84%] shrink-0 border-0 bg-transparent p-0"
                style={{
                  width: metrics.slide > 0 ? metrics.slide : undefined,
                  flex: metrics.slide > 0 ? undefined : "0 0 70%",
                  opacity,
                  // 3D transform stays on the outer shell…
                  transform: `perspective(900px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  transformOrigin: origin,
                  zIndex: 20 - abs,
                  transition: instant
                    ? "none"
                    : [
                        `opacity ${AUDIENCE_TRANSITION_MS}ms ease`,
                        `transform ${AUDIENCE_TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
                      ].join(", "),
                  cursor: active ? "default" : "pointer",
                  pointerEvents: abs > 1 ? "none" : "auto",
                }}
                aria-label={
                  active
                    ? copy.alt
                    : t("audiences.show").replace("{label}", copy.label)
                }
                aria-current={active ? "true" : undefined}
                tabIndex={abs <= 1 ? 0 : -1}
                onClick={() => {
                  if (!active) setIndex(realIndex);
                }}
              >
                {/*
                  …rounded clip lives on an untransformed inner frame so the
                  bottom gradient is corner-clipped immediately (overflow +
                  transform on the same node drops radius until paint settles).
                */}
                <span className="relative block h-full w-full overflow-hidden rounded-[1.35rem] bg-ink/[0.03] shadow-[0_32px_64px_-20px_var(--shadow-tint)] sm:rounded-[1.55rem]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={active ? copy.alt : ""}
                    className="absolute inset-0 h-full w-full object-cover object-center"
                  />
                  {!active && (
                    <span
                      className="pointer-events-none absolute inset-0 bg-bg/35"
                      aria-hidden
                    />
                  )}
                  {dist < 0 && (
                    <span
                      className="pointer-events-none absolute inset-y-0 right-0 w-[32%] bg-gradient-to-l from-ink/35 to-transparent"
                      aria-hidden
                    />
                  )}
                  {dist > 0 && (
                    <span
                      className="pointer-events-none absolute inset-y-0 left-0 w-[32%] bg-gradient-to-r from-ink/35 to-transparent"
                      aria-hidden
                    />
                  )}

                  {/* Full-bleed scrim — also carries matching bottom radius */}
                  <span
                    className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[48%] rounded-b-[1.35rem] bg-gradient-to-t from-ink/60 via-ink/18 to-transparent sm:rounded-b-[1.55rem]"
                    style={{
                      opacity: chromeOn ? 1 : 0,
                      transition: "opacity 180ms ease",
                    }}
                    aria-hidden
                  />

                  {chromeOn && (
                    <span className="pointer-events-auto absolute inset-x-3 bottom-3 z-[3] sm:inset-x-4 sm:bottom-4">
                      <PaymentToast
                        status={copy.status}
                        amount={item.amount}
                        product={copy.product}
                        label={copy.label}
                      />
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* Edge fades (above 3D layer) */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-[30] w-[11%] bg-gradient-to-r from-bg via-bg/75 to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-[30] w-[11%] bg-gradient-to-l from-bg via-bg/75 to-transparent"
          aria-hidden
        />
      </div>

      {/* Footer controls: dots on top, trust badge below */}
      <div className="relative z-[40] mt-3 flex flex-col items-center gap-2.5 px-2 sm:mt-4">
        {/* Pagination dots */}
        <div
          className="flex shrink-0 items-center gap-1.5"
          role="tablist"
          aria-label={t("audiences.scenesAria")}
        >
          {AUDIENCES.map((item, i) => {
            const label = get(item.id).label;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={t("audiences.forLabel").replace("{label}", label)}
                title={label}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === index
                    ? "w-6 bg-blue"
                    : "w-1.5 bg-ink/15 hover:bg-ink/30"
                }`}
                onClick={() => setIndex(i)}
              />
            );
          })}
        </div>

        {/* Trust badge below dots */}
        <TrustBadge />
      </div>
    </div>
  );
}

export function AudienceCarousel() {
  const { index, setIndex, setPaused } = useAudienceCycle();
  return (
    <AudienceText index={index} setIndex={setIndex} setPaused={setPaused} />
  );
}
