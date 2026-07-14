"use client";

import {
  BookOpen,
  CaretDown,
  ChartBar,
  ChalkboardTeacher,
  Command,
  Copy,
  CurrencyCircleDollar,
  GraduationCap,
  Headphones,
  Heart,
  House,
  Link as LinkIcon,
  Microphone,
  Package,
  Plus,
  QrCode,
  Repeat,
  ShoppingBag,
  Stack,
  TShirt,
  Users,
  UsersThree,
  VideoCamera,
  CalendarBlank,
  ArrowSquareOut,
  type Icon,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useI18n } from "@/i18n";

/* ─── Chart series ─── */

const ORANGE_BARS = [38, 52, 88, 100, 22, 34, 68, 92, 48, 82, 96, 54, 28];
const GREEN_BARS = [12, 18, 22, 20, 16, 24, 28, 22, 30, 26, 34, 72, 28];
const PINK_BARS = [8, 10, 12, 18, 22, 20, 28, 35, 48, 82, 100, 72, 40];
const BLUE_BARS = [14, 18, 16, 22, 28, 32, 40, 48, 36, 42, 58, 72, 44];

const SIDEBAR_MAIN_KEYS: { key: string; Icon: Icon }[] = [
  { key: "home", Icon: House },
  { key: "customers", Icon: Users },
  { key: "transactions", Icon: ChartBar },
  { key: "subscriptions", Icon: Repeat },
  { key: "orders", Icon: ShoppingBag },
  { key: "paymentRequests", Icon: CurrencyCircleDollar },
];

const SIDEBAR_PRODUK_KEYS: { key: string; Icon: Icon }[] = [
  { key: "paymentLink", Icon: LinkIcon },
  { key: "physical", Icon: TShirt },
  { key: "digital", Icon: Package },
  { key: "onlineClass", Icon: GraduationCap },
  { key: "cohort", Icon: UsersThree },
  { key: "webinar", Icon: VideoCamera },
  { key: "events", Icon: CalendarBlank },
  { key: "coaching", Icon: ChalkboardTeacher },
  { key: "fundraising", Icon: Heart },
  { key: "subscriptionPack", Icon: Stack },
  { key: "ebook", Icon: BookOpen },
  { key: "podcast", Icon: Microphone },
  { key: "audiobook", Icon: Headphones },
];

/* ─── Hooks ─── */

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          setInView(entry.isIntersecting);
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function useCountUp(target: number, active: boolean, duration = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const e = 1 - (1 - t) ** 3;
      setValue(Math.round(target * e));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);

  // When inactive, report 0 without a cascading setState in the effect
  return active ? value : 0;
}

function formatIdr(n: number) {
  return n.toLocaleString("id-ID");
}

/** Staggered fade + lift for any dashboard child */
function FadeIn({
  active,
  delay = 0,
  className = "",
  children,
  from = "up",
}: {
  active: boolean;
  delay?: number;
  className?: string;
  children: ReactNode;
  from?: "up" | "left" | "right" | "scale";
}) {
  const hidden =
    from === "left"
      ? "translateX(-14px)"
      : from === "right"
        ? "translateX(14px)"
        : from === "scale"
          ? "scale(0.96)"
          : "translateY(16px)";

  return (
    <div
      className={className}
      style={{
        opacity: active ? 1 : 0,
        transform: active ? "none" : hidden,
        transition: `opacity 0.83s cubic-bezier(0.16,1,0.3,1) ${active ? delay : 0}ms, transform 0.98s cubic-bezier(0.16,1,0.3,1) ${active ? delay : 0}ms`,
      }}
    >
      {children}
    </div>
  );
}

function BarChart({
  bars,
  color,
  active,
  delay = 0,
}: {
  bars: number[];
  color: string;
  active: boolean;
  delay?: number;
}) {
  return (
    <div className="flex h-[88px] items-end gap-[3px] sm:h-[100px] sm:gap-1">
      {bars.map((h, i) => (
        <div
          key={i}
          className="relative min-w-0 flex-1 overflow-hidden rounded-t-[2px]"
          style={{ height: "100%" }}
        >
          <div
            className="absolute inset-x-0 bottom-0 rounded-t-[2px]"
            style={{
              height: `${h}%`,
              backgroundColor: color,
              transform: active ? "scaleY(1)" : "scaleY(0)",
              transformOrigin: "bottom",
              transition: `transform 1.05s cubic-bezier(0.16,1,0.3,1) ${
                active ? delay + i * 42 : 0
              }ms`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

function ChartCard({
  title,
  legend,
  legendColor,
  bars,
  barColor,
  xLeft,
  xRight,
  active,
  delay,
  lastYearLabel,
}: {
  title?: string;
  legend: string;
  legendColor: string;
  bars: number[];
  barColor: string;
  xLeft: string;
  xRight: string;
  active: boolean;
  delay: number;
  lastYearLabel: string;
}) {
  return (
    <FadeIn active={active} delay={delay} from="up">
      {title ? (
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="text-[13px] font-semibold text-[#1e293b]">{title}</p>
          <span className="inline-flex items-center gap-1 rounded-md border border-[#e2e8f0] px-2 py-0.5 text-[11px] text-[#64748b]">
            {lastYearLabel}
            <CaretDown size={12} weight="bold" />
          </span>
        </div>
      ) : null}
      <div className="mb-2 flex items-center gap-1.5">
        <span
          className="h-2 w-2 rounded-[2px]"
          style={{ backgroundColor: legendColor }}
        />
        <span className="text-[11px] text-[#64748b]">{legend}</span>
      </div>
      <BarChart bars={bars} color={barColor} active={active} delay={delay + 80} />
      <div className="mt-1.5 flex justify-between text-[10px] text-[#94a3b8]">
        <span>{xLeft}</span>
        <span>{xRight}</span>
      </div>
    </FadeIn>
  );
}

function DashCard({
  children,
  className = "",
  active,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  active: boolean;
  delay?: number;
}) {
  return (
    <FadeIn active={active} delay={delay} from="up" className="h-full">
      {/* Inner shell owns hover so FadeIn's entrance transform doesn't block it */}
      <div className={`dash-card h-full rounded-xl border border-[#e8edf3] bg-white ${className}`}>
        {children}
      </div>
    </FadeIn>
  );
}

function MayarBeranda({ active }: { active: boolean }) {
  const { t } = useI18n();
  const saldo = useCountUp(169_884, active, 2100);
  const subs = useCountUp(34, active, 1350);
  const customers = useCountUp(342, active, 1650);

  return (
    <div className="flex min-h-[420px] bg-white text-[13px] text-[#334155] sm:min-h-[480px] lg:min-h-[520px]">
      {/* Sidebar */}
      <aside className="hidden w-[210px] shrink-0 flex-col border-r border-[#eef2f6] bg-[#fafbfc] md:flex">
        <nav className="flex-1 overflow-hidden px-2.5 py-3">
          <ul className="space-y-0.5">
            {SIDEBAR_MAIN_KEYS.map(({ key, Icon }, i) => {
              const label = t(`dashboard.sidebarMain.${key}`);
              return (
                <li key={key}>
                  <FadeIn active={active} delay={60 + i * 60} from="left">
                    <div
                      className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[12px] transition-colors duration-200 ${
                        i === 0
                          ? "bg-[#eef2ff] font-medium text-[#2563eb]"
                          : "text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0f172a]"
                      }`}
                    >
                      <Icon
                        size={15}
                        weight={i === 0 ? "fill" : "regular"}
                        className="shrink-0"
                      />
                      <span className="truncate">{label}</span>
                    </div>
                  </FadeIn>
                </li>
              );
            })}
          </ul>
          <FadeIn active={active} delay={420} from="left">
            <p className="mb-1 mt-4 px-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#94a3b8]">
              {t("dashboard.sidebarProductsHeading")}
            </p>
          </FadeIn>
          <ul className="space-y-0.5">
            {SIDEBAR_PRODUK_KEYS.map(({ key, Icon }, i) => (
              <li key={key}>
                <FadeIn active={active} delay={450 + i * 42} from="left">
                  <div className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[12px] text-[#64748b] transition-colors duration-200 hover:bg-[#f1f5f9] hover:text-[#0f172a]">
                    <Icon size={15} weight="regular" className="shrink-0" />
                    <span className="truncate">
                      {t(`dashboard.sidebarProducts.${key}`)}
                    </span>
                  </div>
                </FadeIn>
              </li>
            ))}
          </ul>
        </nav>
        <FadeIn active={active} delay={1050} from="up" className="border-t border-[#eef2f6] p-2.5">
          <p className="truncate px-1 text-[10px] text-[#94a3b8]">
            https://namabisnis.mayar.link/p
          </p>
          <button
            type="button"
            className="mt-1.5 flex w-full items-center justify-between gap-2 rounded-lg bg-[#0f172a] px-2.5 py-2 text-[11px] font-semibold text-white transition-[transform,background-color,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:bg-[#1e293b] hover:shadow-[0_8px_18px_-10px_rgb(15_23_42/0.55)] active:scale-[0.98]"
          >
            {t("dashboard.copyPayMe")}
            <Copy size={14} weight="bold" className="opacity-70" />
          </button>
        </FadeIn>
      </aside>

      {/* Main */}
      <div className="min-w-0 flex-1 bg-[#f8fafc]">
        <FadeIn
          active={active}
          delay={90}
          from="up"
          className="flex flex-wrap items-center justify-between gap-2 border-b border-[#eef2f6] bg-white px-3 py-2.5 sm:px-5 sm:py-3"
        >
          <div>
            <p className="text-[11px] text-[#94a3b8]">{t("dashboard.company")}</p>
            <h3 className="text-[1.15rem] font-semibold tracking-tight text-[#0f172a] sm:text-[1.25rem]">
              {t("dashboard.homeTitle")}
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              className="hidden items-center gap-1.5 rounded-lg border border-[#e2e8f0] px-2.5 py-1.5 text-[11px] text-[#64748b] transition-[transform,background-color,border-color,color] duration-200 hover:-translate-y-0.5 hover:border-[#cbd5e1] hover:bg-[#f8fafc] hover:text-[#0f172a] sm:inline-flex"
            >
              <Command size={13} weight="bold" />
              {t("dashboard.quickActions")}
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-lg border border-[#2563eb] px-2.5 py-1.5 text-[11px] font-semibold text-[#2563eb] transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-[#eff6ff] hover:shadow-[0_6px_14px_-8px_rgb(37_99_235/0.45)]"
            >
              <Plus size={13} weight="bold" />
              {t("dashboard.productBtn")}
              <CaretDown size={11} weight="bold" />
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-lg bg-[#2563eb] px-2.5 py-1.5 text-[11px] font-semibold text-white transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-[#1d4ed8] hover:shadow-[0_8px_16px_-8px_rgb(37_99_235/0.55)]"
            >
              <Plus size={13} weight="bold" />
              {t("dashboard.createBtn")}
              <CaretDown size={11} weight="bold" />
            </button>
          </div>
        </FadeIn>

        <div className="space-y-3 p-3 sm:space-y-3.5 sm:p-4 lg:p-5">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            <DashCard active={active} delay={180} className="p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[12px] text-[#64748b]">
                    {t("dashboard.totalBalance")}
                  </p>
                  <p className="mt-1 text-[1.65rem] font-semibold tabular-nums tracking-tight text-[#0f172a] sm:text-[1.85rem]">
                    Rp {formatIdr(saldo)}
                  </p>
                </div>
                <button
                  type="button"
                  className="shrink-0 rounded-md border border-[#2563eb] px-3 py-1 text-[11px] font-semibold text-[#2563eb] transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-[#eff6ff] hover:shadow-[0_6px_12px_-8px_rgb(37_99_235/0.4)] active:scale-95"
                >
                  {t("dashboard.topUp")}
                </button>
              </div>
            </DashCard>

            <DashCard active={active} delay={300} className="p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[12px] text-[#64748b]">
                    {t("dashboard.payMeLink")}
                  </p>
                  <p className="mt-1 flex items-center gap-1 truncate text-[14px] font-medium text-[#2563eb] sm:text-[15px]">
                    mayar.to/namabisnis
                    <ArrowSquareOut size={14} weight="bold" />
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex shrink-0 items-center gap-1 rounded-md border border-[#e2e8f0] px-3 py-1 text-[11px] font-semibold text-[#475569] transition-[transform,background-color,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-[#cbd5e1] hover:bg-[#f8fafc] hover:shadow-[0_6px_12px_-8px_rgb(15_23_42/0.2)]"
                >
                  <Copy size={12} weight="bold" />
                  {t("dashboard.copy")}
                </button>
              </div>
            </DashCard>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            <DashCard active={active} delay={390} className="p-4">
              <p className="text-[12px] text-[#64748b]">
                {t("dashboard.subscriptionCount")}
              </p>
              <p className="mt-1 text-[1.5rem] font-semibold tabular-nums text-[#0f172a]">
                {subs}
              </p>
            </DashCard>
            <DashCard active={active} delay={480} className="p-4">
              <p className="text-[12px] text-[#64748b]">
                {t("dashboard.customerCount")}
              </p>
              <p className="mt-1 text-[1.5rem] font-semibold tabular-nums text-[#0f172a]">
                {customers}
              </p>
            </DashCard>
            <DashCard
              active={active}
              delay={570}
              className="col-span-2 p-4 lg:col-span-1"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[12px] text-[#64748b]">
                    {t("dashboard.simplePos")}
                  </p>
                  <p className="mt-1 flex items-center gap-1 truncate text-[13px] font-medium text-[#2563eb]">
                    pos.mayar.to/namabisnis
                    <ArrowSquareOut size={13} weight="bold" />
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex shrink-0 items-center gap-1 rounded-md border border-[#e2e8f0] px-2.5 py-1 text-[11px] font-semibold text-[#475569] transition-[transform,background-color,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-[#cbd5e1] hover:bg-[#f8fafc] hover:shadow-[0_6px_12px_-8px_rgb(15_23_42/0.2)]"
                >
                  <Copy size={12} weight="bold" />
                  {t("dashboard.copy")}
                </button>
              </div>
            </DashCard>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
            <FadeIn active={active} delay={660} from="scale">
              <button
                type="button"
                className="dash-action flex w-full items-center justify-center gap-2 rounded-lg bg-[#2563eb] py-3 text-[12px] font-bold tracking-wide text-white shadow-sm transition-[transform,box-shadow,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:bg-[#1d4ed8] hover:shadow-[0_14px_28px_-12px_rgb(37_99_235/0.55)] active:scale-[0.98] sm:text-[13px]"
              >
                <QrCode size={18} weight="bold" />
                {t("dashboard.openQris")}
              </button>
            </FadeIn>
            <FadeIn active={active} delay={750} from="scale">
              <button
                type="button"
                className="dash-action flex w-full items-center justify-center gap-2 rounded-lg bg-[#f5c518] py-3 text-[12px] font-bold tracking-wide text-[#1e293b] shadow-sm transition-[transform,box-shadow,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:bg-[#f0b800] hover:shadow-[0_14px_28px_-12px_rgb(245_197_24/0.55)] active:scale-[0.98] sm:text-[13px]"
              >
                <CurrencyCircleDollar size={18} weight="fill" />
                {t("dashboard.chargeQris")}
              </button>
            </FadeIn>
          </div>

          <DashCard active={active} delay={810} className="p-4 sm:p-5">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
              <div className="space-y-5">
                <ChartCard
                  title={t("dashboard.businessActivity")}
                  legend={t("dashboard.newCustomers")}
                  legendColor="#f59e0b"
                  bars={ORANGE_BARS}
                  barColor="#f59e0b"
                  xLeft={t("dashboard.dec2021")}
                  xRight={t("dashboard.today")}
                  active={active}
                  delay={870}
                  lastYearLabel={t("dashboard.lastYear")}
                />
                <ChartCard
                  legend={t("dashboard.transactions")}
                  legendColor="#22c55e"
                  bars={GREEN_BARS}
                  barColor="#22c55e"
                  xLeft={t("dashboard.dec2021")}
                  xRight={t("dashboard.today")}
                  active={active}
                  delay={1110}
                  lastYearLabel={t("dashboard.lastYear")}
                />
              </div>
              <div className="space-y-5">
                <ChartCard
                  legend={t("dashboard.visitors")}
                  legendColor="#f43f5e"
                  bars={PINK_BARS}
                  barColor="#f43f5e"
                  xLeft={t("dashboard.jan2022")}
                  xRight={t("dashboard.today")}
                  active={active}
                  delay={990}
                  lastYearLabel={t("dashboard.lastYear")}
                />
                <ChartCard
                  legend={t("dashboard.paymentAmount")}
                  legendColor="#3b82f6"
                  bars={BLUE_BARS}
                  barColor="#3b82f6"
                  xLeft={t("dashboard.dec2021")}
                  xRight={t("dashboard.today")}
                  active={active}
                  delay={1230}
                  lastYearLabel={t("dashboard.lastYear")}
                />
              </div>
            </div>
          </DashCard>
        </div>
      </div>
    </div>
  );
}

/**
 * Section below the hero — live Mayar Beranda.
 * Scroll into view → staggered fade-ins, count-ups, chart grow.
 */
export function ProductDashboard() {
  const { t } = useI18n();
  const { ref, inView } = useInView(0.18);

  return (
    <section
      id="produk"
      ref={ref}
      className="relative border-t border-line/60 bg-bg px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-20 lg:px-10"
    >
      <div className="mx-auto max-w-[1120px]">
        <div className="mx-auto max-w-2xl text-center">
          <p className="specimen-label text-[10px] tracking-[0.16em] text-muted">
            {t("dashboard.eyebrow")}
          </p>
          <h2 className="mt-3 text-[1.65rem] font-bold tracking-tight text-ink sm:text-3xl lg:text-[2.15rem]">
            {t("dashboard.titleBefore")}{" "}
            <span className="text-blue">{t("dashboard.titleHighlight")}</span>
          </h2>
          <p className="mx-auto mt-3 max-w-[42ch] text-[14px] leading-relaxed text-muted sm:text-[15px]">
            {t("dashboard.subtitle")}
          </p>
        </div>

        <div className="relative mx-auto mt-10 max-w-[1040px]">
          <div
            className="pointer-events-none absolute -inset-x-6 -inset-y-4 rounded-[2.5rem] bg-[radial-gradient(ellipse_at_center,rgb(37_99_235/0.07),transparent_68%)]"
            aria-hidden
          />

          {/* 3D float shell around the browser */}
          <div
            className="relative"
            style={{
              transform: inView
                ? "perspective(1400px) rotateX(2deg) rotateY(-3deg) translateY(0)"
                : "perspective(1400px) rotateX(8deg) rotateY(-6deg) translateY(28px)",
              opacity: inView ? 1 : 0.4,
              transition: "transform 1.05s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.05s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <div className="overflow-hidden rounded-[1.1rem] border border-line bg-white shadow-[0_40px_90px_-28px_var(--shadow-tint)] sm:rounded-[1.25rem]">
              <div className="flex items-center gap-2 border-b border-line bg-[#f4f4f3] px-3.5 py-2.5 sm:px-4">
                <div className="flex items-center gap-1.5" aria-hidden>
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                </div>
                <div className="mx-auto flex min-w-0 max-w-[min(100%,28rem)] flex-1 justify-center">
                  <div className="w-full truncate rounded-md border border-line/70 bg-white px-3 py-1 text-center text-[11px] text-muted sm:text-[12px]">
                    {t("dashboard.browserUrl")}
                  </div>
                </div>
                <div className="w-10 shrink-0" aria-hidden />
              </div>

              <MayarBeranda active={inView} />
            </div>
          </div>

          <div
            className="pointer-events-none absolute -top-3 right-4 flex items-center gap-1.5 rounded-full border border-line bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-ink shadow-sm sm:right-6"
            style={{
              opacity: inView ? 1 : 0,
              transition: "opacity 0.6s ease 0.3s",
            }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            {t("dashboard.liveDemo")}
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-lg text-center text-[13px] text-muted">
          {t("dashboard.footerNote")}
        </p>
      </div>
    </section>
  );
}
