"use client";

import {
  ArrowUp,
  ChartBar,
  ClockCounterClockwise,
  DotsThreeOutline,
  Eye,
  FileText,
  House,
  MagnifyingGlass,
  Package,
  QrCode,
  Users,
  WifiHigh,
} from "@phosphor-icons/react";

/**
 * Merchant dashboard — matched to Mayar specimen iPhone mock
 * (balance card, quick actions, pink heatmap, bottom tabs).
 */
export function MerchantScreen() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May"] as const;
  // Pink heatmap intensities matching specimen layout (7 rows × 5 months)
  const heat = [
    0.2, 0.35, 0.55, 0.45, 0.25, 0.3, 0.5, 0.75, 0.6, 0.35, 0.25, 0.55, 0.9,
    0.7, 0.4, 0.35, 0.65, 0.85, 0.55, 0.3, 0.2, 0.45, 0.7, 0.5, 0.28, 0.15,
    0.4, 0.55, 0.35, 0.2, 0.12, 0.3, 0.45, 0.25, 0.15,
  ];

  return (
    <div className="flex h-full flex-col bg-[#f2f4f8] text-ink antialiased">
      {/* Status bar */}
      <div className="flex h-11 shrink-0 items-end justify-between px-5 pb-1 pt-2">
        <span className="text-[12px] font-semibold tabular-nums tracking-tight">
          18:58
        </span>
        <div className="flex items-center gap-1 text-ink">
          <span className="flex items-end gap-[1.5px]" aria-hidden>
            <span className="h-[4px] w-[2.5px] rounded-[0.5px] bg-ink/90" />
            <span className="h-[6px] w-[2.5px] rounded-[0.5px] bg-ink/90" />
            <span className="h-[8px] w-[2.5px] rounded-[0.5px] bg-ink/90" />
            <span className="h-[10px] w-[2.5px] rounded-[0.5px] bg-ink/35" />
          </span>
          <WifiHigh weight="bold" className="h-3 w-3" aria-hidden />
          <span
            className="ml-0.5 h-[9px] w-[18px] rounded-[2.5px] border border-ink/80 p-[1px]"
            aria-hidden
          >
            <span className="block h-full w-[70%] rounded-[1px] bg-ink" />
          </span>
        </div>
      </div>

      {/* App header */}
      <div className="flex items-center justify-between px-4 pb-2.5 pt-1">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2563eb] text-[12px] font-black text-white shadow-sm">
            M
          </span>
          <span className="text-[14px] font-bold tracking-tight">Merchant</span>
        </div>
        <MagnifyingGlass
          weight="bold"
          className="h-4 w-4 text-ink/45"
          aria-hidden
        />
      </div>

      <div className="min-h-0 flex-1 space-y-2.5 overflow-hidden px-3.5 pb-2">
        {/* Balance card */}
        <div className="relative overflow-hidden rounded-[1.15rem] bg-gradient-to-br from-[#3b82f6] via-[#2563eb] to-[#1d4ed8] p-3.5 text-white shadow-[0_14px_28px_-12px_rgb(37_99_235/0.65)]">
          {/* Specimen watermark rings */}
          <div
            className="pointer-events-none absolute -right-6 -top-8 h-36 w-36 rounded-full border-[18px] border-white/[0.07]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-2 top-2 h-24 w-24 rounded-full border-[12px] border-white/[0.06]"
            aria-hidden
          />

          <div className="relative flex items-start justify-between">
            <p className="text-[11px] font-medium text-white/80">Total balance</p>
            <Eye weight="regular" className="h-4 w-4 text-white/75" aria-hidden />
          </div>
          <p className="relative mt-1 text-[22px] font-bold leading-none tracking-tight tabular-nums">
            Rp 3.646.424
          </p>

          <div className="relative mt-3 flex gap-5 text-[10px]">
            <div>
              <p className="text-white/60">Active</p>
              <p className="mt-0.5 font-semibold tabular-nums text-white">
                Rp 2.856.424
              </p>
            </div>
            <div>
              <p className="text-white/60">Pending</p>
              <p className="mt-0.5 font-semibold tabular-nums text-white">
                Rp 790.000
              </p>
            </div>
          </div>

          <div className="relative mt-3.5 flex gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[10px] font-bold text-[#2563eb] shadow-sm">
              <ArrowUp weight="bold" className="h-3 w-3" aria-hidden />
              Withdraw
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-semibold text-white backdrop-blur-sm">
              <ClockCounterClockwise weight="bold" className="h-3 w-3" aria-hidden />
              History
            </span>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { label: "New Invoice", Icon: FileText },
              { label: "PayReq", Icon: ChartBar },
              { label: "QRIS", Icon: QrCode },
            ] as const
          ).map(({ label, Icon }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1.5 rounded-2xl border border-white/80 bg-white py-3 shadow-[0_2px_8px_-2px_rgb(15_23_42/0.08)]"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eff6ff] text-[#2563eb]">
                <Icon weight="duotone" className="h-4 w-4" aria-hidden />
              </span>
              <span className="text-[9px] font-semibold text-ink">{label}</span>
            </div>
          ))}
        </div>

        {/* Heatmap card */}
        <div className="rounded-2xl border border-white/80 bg-white p-3 shadow-[0_2px_8px_-2px_rgb(15_23_42/0.08)]">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-[11px] font-bold tracking-tight text-ink">
              <span className="mr-1.5 text-[9px] font-semibold text-muted">
                2026
              </span>
              Transactions &amp; Revenue
            </p>
          </div>
          <div className="mt-2 flex justify-between px-0.5 text-[8px] font-medium text-muted">
            {months.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
          <div className="mt-1.5 grid grid-cols-5 gap-[3px]">
            {heat.map((v, i) => (
              <div
                key={i}
                className="aspect-square rounded-[2.5px]"
                style={{
                  // Specimen pink/magenta heatmap
                  background: `rgb(236 72 153 / ${0.14 + v * 0.78})`,
                }}
              />
            ))}
          </div>
          <div className="mt-2.5 flex items-center justify-between border-t border-line/30 pt-2">
            <p className="text-[10px] font-semibold text-ink">
              Recent transactions
            </p>
            <p className="text-[10px] font-semibold text-[#2563eb]">See all</p>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex shrink-0 items-end justify-around border-t border-line/30 bg-white px-1 pb-2.5 pt-1.5">
        {(
          [
            { label: "Dashboard", Icon: House, active: true },
            { label: "Products", Icon: Package, active: false },
            { label: "Customers", Icon: Users, active: false },
            { label: "Analytics", Icon: ChartBar, active: false },
            { label: "More", Icon: DotsThreeOutline, active: false },
          ] as const
        ).map(({ label, Icon, active }) => (
          <div
            key={label}
            className="flex min-w-0 flex-1 flex-col items-center gap-0.5 px-0.5"
          >
            <Icon
              weight={active ? "fill" : "regular"}
              className={`h-[15px] w-[15px] ${
                active ? "text-[#2563eb]" : "text-ink/35"
              }`}
              aria-hidden
            />
            <span
              className={`truncate text-[7.5px] font-semibold ${
                active ? "text-[#2563eb]" : "text-muted"
              }`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
