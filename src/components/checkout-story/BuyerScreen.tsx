"use client";

const PAYMENTS = [
  { src: "/specimen/integrations/shopeepay.png", alt: "ShopeePay" },
  { src: "/specimen/integrations/gopay.png", alt: "GoPay" },
  { src: "/specimen/integrations/ovo.png", alt: "OVO" },
  { src: "/specimen/integrations/dana.png", alt: "DANA" },
  { src: "/specimen/integrations/bca.png", alt: "BCA" },
] as const;

/**
 * 1-click checkout UI — specimen fidelity, compact for phone screen.
 */
export function BuyerScreen() {
  return (
    <div className="flex h-full flex-col bg-[#f7f8fa] text-[10px] leading-snug text-ink antialiased">
      {/* Status — leave room for 3D Dynamic Island */}
      <div className="flex h-12 shrink-0 items-end justify-between px-4 pb-1.5 pt-3">
        <span className="text-[11px] font-semibold tabular-nums">9:41</span>
        <div className="flex items-center gap-1 text-[10px] text-ink/70">
          <span className="inline-block h-2 w-3 rounded-[1px] border border-ink/40" />
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-hidden px-2.5 pb-2">
        {/* Contact card */}
        <div className="rounded-xl border border-line/50 bg-white p-2.5 shadow-[0_1px_3px_rgb(15_23_42/0.04)]">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[12px] font-bold text-ink">Azmya</p>
              <p className="mt-0.5 text-[9px] text-muted">081100000000</p>
              <p className="text-[9px] text-muted">azmya@mayar.id</p>
            </div>
            <span className="text-[10px] text-muted" aria-hidden>
              ✎
            </span>
          </div>
          <div className="mt-2 border-t border-line/40 pt-2">
            <p className="text-[9px] font-semibold text-muted">Alamat Pengiriman</p>
            <p className="mt-0.5 text-[9.5px] leading-snug text-ink/85">
              Jalan Kukagalih No 90B · Sukajadi, Talang Kelapa, Banyuasin, Sumatera
              Selatan
            </p>
          </div>
        </div>

        {/* Courier */}
        <div className="rounded-xl border border-line/50 bg-white p-2.5">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/specimen/integrations/sicepat.png"
              alt="SiCepat"
              className="h-5 w-auto object-contain"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold text-ink">SiCepat</p>
              <p className="text-[8.5px] text-muted">REG (2-4 HARI)</p>
            </div>
          </div>
          <button
            type="button"
            tabIndex={-1}
            className="mt-2 w-full rounded-lg bg-ink/[0.04] py-1.5 text-center text-[9px] font-semibold text-blue"
          >
            UBAH KURIR PENGIRIMAN
          </button>
        </div>

        {/* Payments */}
        <div className="rounded-xl border border-line/50 bg-white p-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            {PAYMENTS.map((p) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={p.alt}
                src={p.src}
                alt={p.alt}
                className="h-4 w-auto max-w-[2rem] object-contain"
              />
            ))}
            <span className="rounded bg-ink/[0.06] px-1.5 py-0.5 text-[8px] font-bold text-ink">
              QRIS
            </span>
          </div>
          <button
            type="button"
            tabIndex={-1}
            className="mt-2 w-full rounded-lg bg-ink/[0.04] py-1.5 text-center text-[9px] font-semibold text-blue"
          >
            UBAH METODE PEMBAYARAN
          </button>
        </div>

        {/* Totals */}
        <div className="rounded-xl border border-line/50 bg-white px-2.5 py-2">
          <div className="flex justify-between text-[9px] text-muted">
            <span>Dikirim Dari</span>
            <span className="font-medium text-ink">Bandung, Kota</span>
          </div>
          <div className="mt-1 flex justify-between text-[9px] text-muted">
            <span>Harga</span>
            <span className="tabular-nums text-ink">Rp 99.000</span>
          </div>
          <div className="mt-0.5 flex justify-between text-[9px] text-muted">
            <span>Total</span>
            <span className="tabular-nums text-ink">(x1) Rp 99.000</span>
          </div>
          <div className="mt-0.5 flex justify-between text-[9px] text-muted">
            <span>SiCepat</span>
            <span className="tabular-nums text-ink">Rp 45.500</span>
          </div>
          <div className="mt-1.5 flex justify-between border-t border-line/40 pt-1.5 text-[11px] font-bold text-ink">
            <span>Total</span>
            <span className="tabular-nums">Rp 144.500</span>
          </div>
          <p className="mt-1 text-right text-[8px] font-semibold text-blue">
            PUNYA KODE DISKON?
          </p>
        </div>
      </div>

      <div className="shrink-0 border-t border-line/40 bg-white px-2.5 pb-3 pt-2">
        <button
          type="button"
          tabIndex={-1}
          className="flex h-10 w-full items-center justify-center rounded-xl bg-blue text-[12px] font-bold tracking-wide text-white shadow-[0_8px_18px_-10px_rgb(37_99_235/0.65)]"
        >
          BAYAR
        </button>
      </div>
    </div>
  );
}
