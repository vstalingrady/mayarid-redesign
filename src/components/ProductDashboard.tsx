"use client";

import {
  BookOpen,
  CaretDown,
  ChartBar,
  ChalkboardTeacher,
  Command,
  Copy,
  CurrencyCircleDollar,
  FileText,
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

/* ─── Chart series ─── */

const ORANGE_BARS = [38, 52, 88, 100, 22, 34, 68, 92, 48, 82, 96, 54, 28];
const GREEN_BARS = [12, 18, 22, 20, 16, 24, 28, 22, 30, 26, 34, 72, 28];
const PINK_BARS = [8, 10, 12, 18, 22, 20, 28, 35, 48, 82, 100, 72, 40];
const BLUE_BARS = [14, 18, 16, 22, 28, 32, 40, 48, 36, 42, 58, 72, 44];

const SIDEBAR_MAIN: { label: string; Icon: Icon }[] = [
  { label: "Beranda", Icon: House },
  { label: "Pelanggan", Icon: Users },
  { label: "Transaksi", Icon: ChartBar },
  { label: "Berlangganan", Icon: Repeat },
  { label: "Order", Icon: ShoppingBag },
  { label: "Permintaan Pembayaran", Icon: CurrencyCircleDollar },
];

const SIDEBAR_PRODUK: { label: string; Icon: Icon }[] = [
  { label: "Link Pembayaran", Icon: LinkIcon },
  { label: "Produk Fisik", Icon: TShirt },
  { label: "Produk Digital", Icon: Package },
  { label: "Kelas Online", Icon: GraduationCap },
  { label: "Kelas Cohort", Icon: UsersThree },
  { label: "Webinar", Icon: VideoCamera },
  { label: "Event & Acara", Icon: CalendarBlank },
  { label: "Coaching & Mentoring", Icon: ChalkboardTeacher },
  { label: "Penggalangan Dana", Icon: Heart },
  { label: "Paket Berlangganan", Icon: Stack },
  { label: "E-Book", Icon: BookOpen },
  { label: "Podcast", Icon: Microphone },
  { label: "Audio Book", Icon: Headphones },
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
    if (!active) {
      setValue(0);
      return;
    }
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

  return value;
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
        transition: `opacity 0.55s cubic-bezier(0.16,1,0.3,1) ${active ? delay : 0}ms, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${active ? delay : 0}ms`,
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
              transition: `transform 0.7s cubic-bezier(0.16,1,0.3,1) ${
                active ? delay + i * 28 : 0
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
}) {
  return (
    <FadeIn active={active} delay={delay} from="up">
      {title ? (
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="text-[13px] font-semibold text-[#1e293b]">{title}</p>
          <span className="inline-flex items-center gap-1 rounded-md border border-[#e2e8f0] px-2 py-0.5 text-[11px] text-[#64748b]">
            Last Year
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
    <FadeIn
      active={active}
      delay={delay}
      from="up"
      className={`rounded-xl border border-[#e8edf3] bg-white ${className}`}
    >
      {children}
    </FadeIn>
  );
}

function MayarBeranda({ active }: { active: boolean }) {
  const saldo = useCountUp(169_884, active, 1400);
  const subs = useCountUp(34, active, 900);
  const customers = useCountUp(342, active, 1100);

  return (
    <div className="flex min-h-[420px] bg-white text-[13px] text-[#334155] sm:min-h-[480px] lg:min-h-[520px]">
      {/* Sidebar */}
      <aside className="hidden w-[210px] shrink-0 flex-col border-r border-[#eef2f6] bg-[#fafbfc] md:flex">
        <nav className="flex-1 overflow-hidden px-2.5 py-3">
          <ul className="space-y-0.5">
            {SIDEBAR_MAIN.map(({ label, Icon }, i) => (
              <li key={label}>
                <FadeIn active={active} delay={40 + i * 40} from="left">
                  <div
                    className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[12px] ${
                      i === 0
                        ? "bg-[#eef2ff] font-medium text-[#2563eb]"
                        : "text-[#475569]"
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
            ))}
          </ul>
          <FadeIn active={active} delay={280} from="left">
            <p className="mb-1 mt-4 px-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#94a3b8]">
              Produk
            </p>
          </FadeIn>
          <ul className="space-y-0.5">
            {SIDEBAR_PRODUK.map(({ label, Icon }, i) => (
              <li key={label}>
                <FadeIn active={active} delay={300 + i * 28} from="left">
                  <div className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[12px] text-[#64748b]">
                    <Icon size={15} weight="regular" className="shrink-0" />
                    <span className="truncate">{label}</span>
                  </div>
                </FadeIn>
              </li>
            ))}
          </ul>
        </nav>
        <FadeIn active={active} delay={700} from="up" className="border-t border-[#eef2f6] p-2.5">
          <p className="truncate px-1 text-[10px] text-[#94a3b8]">
            https://namabisnis.mayar.link/p
          </p>
          <button
            type="button"
            className="mt-1.5 flex w-full items-center justify-between gap-2 rounded-lg bg-[#0f172a] px-2.5 py-2 text-[11px] font-semibold text-white"
          >
            COPY PAY-ME LINK
            <Copy size={14} weight="bold" className="opacity-70" />
          </button>
        </FadeIn>
      </aside>

      {/* Main */}
      <div className="min-w-0 flex-1 bg-[#f8fafc]">
        <FadeIn
          active={active}
          delay={60}
          from="up"
          className="flex flex-wrap items-center justify-between gap-2 border-b border-[#eef2f6] bg-white px-3 py-2.5 sm:px-5 sm:py-3"
        >
          <div>
            <p className="text-[11px] text-[#94a3b8]">Mayar CompanyX</p>
            <h3 className="text-[1.15rem] font-semibold tracking-tight text-[#0f172a] sm:text-[1.25rem]">
              Beranda
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              className="hidden items-center gap-1.5 rounded-lg border border-[#e2e8f0] px-2.5 py-1.5 text-[11px] text-[#64748b] sm:inline-flex"
            >
              <Command size={13} weight="bold" />
              Quick Actions
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-lg border border-[#2563eb] px-2.5 py-1.5 text-[11px] font-semibold text-[#2563eb]"
            >
              <Plus size={13} weight="bold" />
              PRODUK
              <CaretDown size={11} weight="bold" />
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-lg bg-[#2563eb] px-2.5 py-1.5 text-[11px] font-semibold text-white"
            >
              <Plus size={13} weight="bold" />
              BUAT
              <CaretDown size={11} weight="bold" />
            </button>
          </div>
        </FadeIn>

        <div className="space-y-3 p-3 sm:space-y-3.5 sm:p-4 lg:p-5">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            <DashCard active={active} delay={120} className="p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[12px] text-[#64748b]">Total Saldo</p>
                  <p className="mt-1 text-[1.65rem] font-semibold tabular-nums tracking-tight text-[#0f172a] sm:text-[1.85rem]">
                    Rp {formatIdr(saldo)}
                  </p>
                </div>
                <button
                  type="button"
                  className="shrink-0 rounded-md border border-[#2563eb] px-3 py-1 text-[11px] font-semibold text-[#2563eb] transition-transform active:scale-95"
                >
                  TOP-UP
                </button>
              </div>
            </DashCard>

            <DashCard active={active} delay={200} className="p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[12px] text-[#64748b]">PayMe Link Anda</p>
                  <p className="mt-1 flex items-center gap-1 truncate text-[14px] font-medium text-[#2563eb] sm:text-[15px]">
                    mayar.to/namabisnis
                    <ArrowSquareOut size={14} weight="bold" />
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex shrink-0 items-center gap-1 rounded-md border border-[#e2e8f0] px-3 py-1 text-[11px] font-semibold text-[#475569]"
                >
                  <Copy size={12} weight="bold" />
                  COPY
                </button>
              </div>
            </DashCard>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            <DashCard active={active} delay={260} className="p-4">
              <p className="text-[12px] text-[#64748b]">Jumlah Berlangganan</p>
              <p className="mt-1 text-[1.5rem] font-semibold tabular-nums text-[#0f172a]">
                {subs}
              </p>
            </DashCard>
            <DashCard active={active} delay={320} className="p-4">
              <p className="text-[12px] text-[#64748b]">Jumlah Pelanggan</p>
              <p className="mt-1 text-[1.5rem] font-semibold tabular-nums text-[#0f172a]">
                {customers}
              </p>
            </DashCard>
            <DashCard
              active={active}
              delay={380}
              className="col-span-2 p-4 lg:col-span-1"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[12px] text-[#64748b]">Mayar Simple POS</p>
                  <p className="mt-1 flex items-center gap-1 truncate text-[13px] font-medium text-[#2563eb]">
                    pos.mayar.to/namabisnis
                    <ArrowSquareOut size={13} weight="bold" />
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex shrink-0 items-center gap-1 rounded-md border border-[#e2e8f0] px-2.5 py-1 text-[11px] font-semibold text-[#475569]"
                >
                  <Copy size={12} weight="bold" />
                  COPY
                </button>
              </div>
            </DashCard>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
            <FadeIn active={active} delay={440} from="scale">
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#2563eb] py-3 text-[12px] font-bold tracking-wide text-white shadow-sm transition-transform active:scale-[0.98] sm:text-[13px]"
              >
                <QrCode size={18} weight="bold" />
                BUKA QRIS STATIS
              </button>
            </FadeIn>
            <FadeIn active={active} delay={500} from="scale">
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#f5c518] py-3 text-[12px] font-bold tracking-wide text-[#1e293b] shadow-sm transition-transform active:scale-[0.98] sm:text-[13px]"
              >
                <CurrencyCircleDollar size={18} weight="fill" />
                TAGIH PAKAI QRIS
              </button>
            </FadeIn>
          </div>

          <DashCard active={active} delay={540} className="p-4 sm:p-5">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
              <div className="space-y-5">
                <ChartCard
                  title="Aktivitas Bisnis"
                  legend="Pelanggan Baru"
                  legendColor="#f59e0b"
                  bars={ORANGE_BARS}
                  barColor="#f59e0b"
                  xLeft="Des 2021"
                  xRight="Today"
                  active={active}
                  delay={580}
                />
                <ChartCard
                  legend="Transaksi"
                  legendColor="#22c55e"
                  bars={GREEN_BARS}
                  barColor="#22c55e"
                  xLeft="Des 2021"
                  xRight="Today"
                  active={active}
                  delay={740}
                />
              </div>
              <div className="space-y-5">
                <ChartCard
                  legend="Pengunjung"
                  legendColor="#f43f5e"
                  bars={PINK_BARS}
                  barColor="#f43f5e"
                  xLeft="Jan 2022"
                  xRight="Today"
                  active={active}
                  delay={660}
                />
                <ChartCard
                  legend="Rp Pembayaran"
                  legendColor="#3b82f6"
                  bars={BLUE_BARS}
                  barColor="#3b82f6"
                  xLeft="Des 2021"
                  xRight="Today"
                  active={active}
                  delay={820}
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
            Satu dashboard · semua penjualan
          </p>
          <h2 className="mt-3 text-[1.65rem] font-bold tracking-tight text-ink sm:text-3xl lg:text-[2.15rem]">
            Kelola bisnis dari{" "}
            <span className="text-blue">satu layar</span>
          </h2>
          <p className="mx-auto mt-3 max-w-[42ch] text-[14px] leading-relaxed text-muted sm:text-[15px]">
            Saldo, pelanggan, link pembayaran, QRIS, dan aktivitas — semua di
            Beranda Mayar. Scroll ke sini, biar hidup.
          </p>
        </div>

        <div className="relative mx-auto mt-10 max-w-[1040px]">
          <div
            className="pointer-events-none absolute -inset-x-6 -inset-y-4 rounded-[2.5rem] bg-[radial-gradient(ellipse_at_center,rgb(37_99_235/0.07),transparent_68%)]"
            aria-hidden
          />

          {/* 3D float shell around the browser */}
          <div
            className="relative transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              transform: inView
                ? "perspective(1400px) rotateX(2deg) rotateY(-3deg) translateY(0)"
                : "perspective(1400px) rotateX(8deg) rotateY(-6deg) translateY(28px)",
              opacity: inView ? 1 : 0.4,
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
                    web.mayar.id · Beranda
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
              transition: "opacity 0.4s ease 0.2s",
            }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            Live demo
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-lg text-center text-[13px] text-muted">
          Satu link pembayaran, ratusan produk digital &amp; fisik, kelas online,
          dan langganan — semua terhubung ke saldo yang sama.
        </p>
      </div>
    </section>
  );
}
