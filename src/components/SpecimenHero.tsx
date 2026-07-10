import Image from "next/image";

/**
 * Static recreation of "Specimen Hero / Floating Island".
 * Magic Layers baked everything as raster slices — we rebuild UI as real shapes.
 *
 * IMAGE ASSETS (keep raster):
 * - floating island (photoreal)
 * - product photo (headphones)
 *
 * SHAPES / TEXT (code, not AI pixels):
 * - L-brackets, leader lines, node dots
 * - product card, buttons, qty stepper
 * - all typography & meta labels
 * - Mayar wordmark mark
 *
 * Animation hooks marked with data-anim for a later pass.
 */

const audiences = [
  { label: "Freelancers", active: false },
  { label: "Creators", active: true },
  { label: "Social Sellers", active: false },
  { label: "Educators", active: false },
] as const;

function CornerBracket({
  className,
  flipX,
  flipY,
}: {
  className?: string;
  flipX?: boolean;
  flipY?: boolean;
}) {
  return (
    <svg
      className={className}
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden
      style={{
        transform: `scale(${flipX ? -1 : 1}, ${flipY ? -1 : 1})`,
      }}
    >
      <path
        d="M2 18V4h14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}

function NodeDot({ className }: { className?: string }) {
  return (
    <span
      className={`inline-block h-1.5 w-1.5 rounded-full bg-ink ring-4 ring-bg ${className ?? ""}`}
      aria-hidden
    />
  );
}

function MayarMark() {
  return (
    <div className="flex items-center gap-1.5" data-anim="logo">
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
        <path d="M2 15 L9 2 L16 15 Z" fill="#ef4444" />
        <path d="M5.2 15 L9 7.2 L12.8 15 Z" fill="#0f172a" />
      </svg>
      <span className="text-[15px] font-bold tracking-[0.12em] text-ink">
        MAYAR
      </span>
    </div>
  );
}

function Annotation({
  title,
  lines,
  align = "left",
  className,
  lineTo,
}: {
  title?: string;
  lines: string[];
  align?: "left" | "right";
  className?: string;
  /** CSS for leader line geometry later */
  lineTo?: "top" | "right" | "bottom" | "left";
}) {
  return (
    <div
      className={`absolute z-20 max-w-[11rem] ${align === "right" ? "text-right" : "text-left"} ${className ?? ""}`}
      data-anim="annotation"
      data-line-to={lineTo}
    >
      <div className="specimen-label space-y-0.5 text-[9px] sm:text-[10px]">
        {title ? <p className="font-semibold text-ink/70">{title}</p> : null}
        {lines.map((l) => (
          <p key={l}>{l}</p>
        ))}
      </div>
    </div>
  );
}

function ProductCard() {
  return (
    <div
      className="absolute bottom-[12%] left-0 z-30 w-[min(100%,17.5rem)] rounded-2xl border border-white/70 bg-card p-3.5 shadow-[0_12px_40px_-16px_rgba(15,23,42,0.28)] backdrop-blur-md sm:left-[4%] sm:p-4"
      data-anim="product-card"
    >
      <div className="flex items-start gap-3">
        <div className="relative h-16 w-16 shrink-0 sm:h-[4.5rem] sm:w-[4.5rem]">
          <Image
            src="/specimen/headphones.png"
            alt="Wireless Headphones"
            fill
            className="object-contain"
            sizes="72px"
            priority
          />
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-[13px] font-semibold leading-snug text-ink">
            Wireless
            <br />
            Headphones
          </p>
          <p className="mt-1 text-[13px] font-medium text-ink-soft">
            Rp 599.000
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div
          className="inline-flex items-center rounded-full border border-line bg-white/80 px-1"
          data-anim="qty"
        >
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center text-sm text-muted"
            aria-label="Kurangi"
          >
            −
          </button>
          <span className="w-5 text-center text-[13px] font-medium text-ink">
            1
          </span>
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center text-sm text-muted"
            aria-label="Tambah"
          >
            +
          </button>
        </div>
        <button
          type="button"
          className="rounded-full bg-ink px-5 py-2 text-[12px] font-semibold text-white transition-transform duration-300 ease-[var(--ease)] active:scale-[0.98]"
          data-anim="checkout-btn"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}

export function SpecimenHero() {
  return (
    <section
      className="relative min-h-[100dvh] overflow-hidden bg-bg text-ink"
      data-anim="hero-root"
    >
      <div className="specimen-glow pointer-events-none absolute inset-0" />

      {/* Frame brackets — pure SVG geometry */}
      <CornerBracket className="absolute left-4 top-4 text-ink/50 sm:left-6 sm:top-6" />
      <CornerBracket
        className="absolute right-4 top-4 text-ink/50 sm:right-6 sm:top-6"
        flipX
      />
      <CornerBracket
        className="absolute bottom-4 left-4 text-ink/50 sm:bottom-6 sm:left-6"
        flipY
      />
      <CornerBracket
        className="absolute bottom-4 right-4 text-ink/50 sm:bottom-6 sm:right-6"
        flipX
        flipY
      />

      {/* HUD meta — code text, not baked pixels */}
      <p className="specimen-label absolute left-10 top-5 hidden sm:left-14 sm:top-7 md:block">
        X: 1024.50
        <br />
        Y: 512.25
        <br />
        Z: 0.00
      </p>
      <p className="specimen-label absolute right-10 top-5 text-right hidden sm:right-14 sm:top-7 md:block">
        GRID: 8X8
        <br />
        UNIT: PX
        <br />
        MODE: EDITORIAL
      </p>
      <p className="specimen-label absolute bottom-5 left-10 hidden sm:bottom-7 sm:left-14 md:block">
        TIME: 14:35:22
        <br />
        DATE: 2025-05-24
        <br />
        VER: 1.0.0
      </p>
      <p className="specimen-label absolute bottom-5 right-10 text-right hidden sm:bottom-7 sm:right-14 md:block">
        SESSION: MAYAR-7X21
        <br />
        ENV: PRODUCTION
        <br />
        ID: USR-99821
      </p>

      <div className="relative mx-auto grid min-h-[100dvh] max-w-[1200px] grid-cols-1 items-center gap-8 px-6 py-16 sm:px-10 lg:grid-cols-2 lg:gap-6 lg:py-20">
        {/* ── Left: copy ── */}
        <div className="relative z-10 max-w-xl pt-4 lg:pt-0" data-anim="copy">
          <MayarMark />

          <h1
            className="mt-7 text-[2.35rem] font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.35rem]"
            data-anim="headline"
          >
            <span className="text-blue">Frictionless</span>
            <br />
            <span className="text-ink">Online Checkout</span>
            <br />
            <span className="text-ink">and Payment</span>
          </h1>

          {/* Audience stack — static; animate later */}
          <div className="relative mt-6 pl-1" data-anim="audience">
            <ul className="space-y-0.5">
              {audiences.map((a) =>
                a.active ? (
                  <li
                    key={a.label}
                    className="flex items-center gap-2 text-[1.35rem] font-semibold text-blue sm:text-[1.55rem]"
                  >
                    <span className="text-[0.7em] text-blue" aria-hidden>
                      ▶
                    </span>
                    <span>
                      for {a.label}
                    </span>
                    <span className="text-[0.7em] text-blue" aria-hidden>
                      ◀
                    </span>
                  </li>
                ) : (
                  <li
                    key={a.label}
                    className="pl-5 text-[1.15rem] font-semibold text-ink/15 sm:text-[1.35rem]"
                  >
                    {a.label}
                  </li>
                ),
              )}
            </ul>
          </div>

          <p
            className="mt-6 max-w-md text-[14px] leading-relaxed text-muted sm:text-[15px]"
            data-anim="body"
          >
            Mayar memudahkan bisnis untuk menerima pembayaran, mengelola
            pelanggan, dan menjual produk &amp; jasa dengan mudah dalam satu
            platform
          </p>

          <a
            href="#daftar"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[14px] font-semibold text-white shadow-[0_8px_24px_-10px_rgba(15,23,42,0.5)] transition-transform duration-300 ease-[var(--ease)] active:scale-[0.98]"
            data-anim="cta"
          >
            Daftar Sekarang
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-sm"
              aria-hidden
            >
              →
            </span>
          </a>
        </div>

        {/* ── Right: floating island stage ── */}
        <div
          className="relative mx-auto aspect-square w-full max-w-[34rem] lg:max-w-none"
          data-anim="stage"
        >
          {/* Soft ground shadow under island */}
          <div
            className="pointer-events-none absolute bottom-[8%] left-1/2 h-8 w-[55%] -translate-x-1/2 rounded-[100%] bg-ink/10 blur-xl"
            data-anim="island-shadow"
            aria-hidden
          />

          {/* Island — photoreal asset */}
          <div
            className="relative mx-auto h-[78%] w-[78%] translate-x-[6%] translate-y-[4%]"
            data-anim="island"
          >
            <Image
              src="/specimen/island.jpg"
              alt="Floating island specimen"
              fill
              className="object-contain drop-shadow-[0_30px_50px_rgba(15,23,42,0.18)]"
              sizes="(max-width: 1024px) 90vw, 520px"
              priority
            />
          </div>

          {/* Leader lines + nodes (SVG geometry) */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            fill="none"
            aria-hidden
            data-anim="leaders"
          >
            {/* Specimen → meadow */}
            <path
              d="M18 22 L42 30"
              stroke="rgba(15,23,42,0.35)"
              strokeWidth="0.35"
            />
            <circle cx="42" cy="30" r="0.7" fill="#0f172a" />

            {/* Biosphere → top right edge */}
            <path
              d="M88 28 L68 34"
              stroke="rgba(15,23,42,0.35)"
              strokeWidth="0.35"
            />
            <circle cx="68" cy="34" r="0.7" fill="#0f172a" />

            {/* Resource → lower right rock */}
            <path
              d="M90 72 L72 68"
              stroke="rgba(15,23,42,0.35)"
              strokeWidth="0.35"
            />
            <circle cx="72" cy="68" r="0.7" fill="#0f172a" />

            {/* Product card → island mid */}
            <path
              d="M28 78 L48 62"
              stroke="rgba(15,23,42,0.28)"
              strokeWidth="0.35"
            />
            <circle cx="48" cy="62" r="0.7" fill="#0f172a" />
          </svg>

          <Annotation
            className="left-0 top-[12%] sm:left-[2%] sm:top-[14%]"
            lines={[
              "SPECIMEN: 001",
              "TYPE: FLOATING ISLAND",
              "STATUS: STABLE",
            ]}
            lineTo="right"
          />

          <Annotation
            className="right-0 top-[16%] sm:right-[2%] sm:top-[18%]"
            align="right"
            lines={["BIOSPHERE", "LOW IMPACT", "HIGH VALUE"]}
            lineTo="left"
          />

          <Annotation
            className="bottom-[28%] right-0 sm:bottom-[26%] sm:right-[2%]"
            align="right"
            lines={[
              "RESOURCE NODE",
              "SECURE. SCALABLE.",
              "RELIABLE.",
            ]}
            lineTo="left"
          />

          <Annotation
            className="bottom-[6%] left-[28%] hidden sm:block"
            lines={[
              "PRODUCT CARD",
              "ID: PRD-7X21",
              "STATUS: ACTIVE",
            ]}
            lineTo="top"
          />

          <ProductCard />
        </div>
      </div>

      {/* Trust strip */}
      <div
        className="pointer-events-none absolute bottom-10 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center sm:bottom-12 md:flex"
        data-anim="trust"
      >
        <p className="text-[12px] font-medium text-ink-soft">
          Dipercaya 149.969+ Bisnis
        </p>
        <div className="mt-1 flex gap-0.5 text-[13px] text-ink" aria-label="5 bintang">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i}>★</span>
          ))}
        </div>
      </div>

      {/* Speculative footer note — portfolio honesty */}
      <p className="absolute bottom-3 left-1/2 z-10 w-full -translate-x-1/2 px-4 text-center text-[9px] tracking-wide text-muted-faint sm:bottom-4">
        Speculative specimen · rebuilt from Magic Layers as code · island &amp;
        product photo assets · not affiliated with Mayar
      </p>
    </section>
  );
}
