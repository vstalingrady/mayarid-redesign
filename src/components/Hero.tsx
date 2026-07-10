const niches = ["Educator", "Creator", "Social Seller", "Freelancer"] as const;

export function Hero() {
  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-background">
      <div className="grain" aria-hidden />

      {/* Ambient orbs */}
      <div
        className="pointer-events-none absolute -top-32 right-[-10%] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(15,118,110,0.18),transparent_68%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-[-12%] left-[-8%] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(180,120,60,0.12),transparent_70%)]"
        aria-hidden
      />

      {/* Floating island nav */}
      <header className="relative z-10 px-4 pt-5 sm:px-6 sm:pt-7">
        <nav className="animate-fade-up mx-auto flex w-full max-w-6xl items-center justify-between rounded-full border border-white/50 bg-surface/70 px-3 py-2 shadow-[0_1px_0_rgba(255,255,255,0.8)_inset,0_12px_40px_-20px_rgba(12,15,20,0.35)] sm:px-4">
          <div className="flex items-center gap-2.5 pl-1">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-[11px] font-semibold tracking-wide text-surface">
              DE
            </span>
            <div className="leading-tight">
              <p className="text-[13px] font-medium tracking-tight text-ink">
                Design Engineer (AI)
              </p>
              <p className="text-[11px] text-muted">Speculative · Mayar</p>
            </div>
          </div>
          <div className="hidden items-center gap-1 text-[12px] text-muted md:flex">
            <span className="rounded-full px-3 py-1.5 text-ink/80">Builder</span>
            <span className="rounded-full px-3 py-1.5 opacity-50">Research</span>
            <span className="rounded-full px-3 py-1.5 opacity-50">Process</span>
          </div>
          <a
            href="https://github.com/vstalingrady/mayarid-redesign"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full bg-ink px-3.5 py-2 text-[12px] font-medium text-surface transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-ink/90 active:scale-[0.98]"
          >
            Repo
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px">
              ↗
            </span>
          </a>
        </nav>
      </header>

      <main className="relative z-10 mx-auto grid w-full max-w-6xl gap-10 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:pb-20 lg:pt-14">
        {/* Copy column */}
        <section className="flex flex-col justify-center lg:col-span-6">
          <div className="animate-fade-up delay-1 mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-line bg-surface/80 px-3 py-1.5">
            <span className="pulse-soft h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted">
              AI Landing Page Builder
            </span>
          </div>

          <h1 className="animate-fade-up delay-2 max-w-[18ch] font-[family-name:var(--font-display)] text-[2.65rem] leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-[3.35rem]">
            Dari deskripsi bisnis{" "}
            <em className="text-accent not-italic">jadi landing page</em> siap
            bayar.
          </h1>

          <p className="animate-fade-up delay-3 mt-5 max-w-md text-[15px] leading-relaxed text-muted sm:text-base">
            Speculative product sprint untuk peran Design Engineer (AI) di
            Mayar — alur generate → edit → preview untuk kreator & UMKM.
            Dibangun dengan Grok Build; arah visual mereferensikan Reve AI.
          </p>

          <div className="animate-fade-up delay-4 mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-[14px] font-medium text-white shadow-[0_1px_0_rgba(255,255,255,0.2)_inset] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-accent/90 active:scale-[0.98]"
            >
              Coba generate (soon)
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/10 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5">
                →
              </span>
            </button>
            <button
              type="button"
              disabled
              className="inline-flex items-center justify-center rounded-full border border-line bg-surface/60 px-6 py-3.5 text-[14px] font-medium text-muted opacity-70"
            >
              Case study — next
            </button>
          </div>

          <div className="animate-fade-up delay-5 mt-8 flex flex-wrap gap-2">
            {niches.map((n) => (
              <span
                key={n}
                className="rounded-full border border-line bg-surface px-3 py-1 text-[12px] text-ink/75"
              >
                {n}
              </span>
            ))}
          </div>

          <p className="animate-fade-up delay-5 mt-8 max-w-md text-[11px] leading-relaxed text-muted/80">
            Karya portofolio spekulatif · tidak terafiliasi dengan Mayar · bukan
            redesign resmi. Stack: Grok Build + Reve AI.
          </p>
        </section>

        {/* Product preview column */}
        <section className="animate-fade-up delay-3 lg:col-span-6">
          <div className="rounded-[2rem] border border-line bg-black/[0.03] p-1.5 shadow-[0_24px_80px_-32px_rgba(12,15,20,0.45)]">
            <div className="overflow-hidden rounded-[calc(2rem-0.375rem)] border border-white/60 bg-surface shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)]">
              {/* Window chrome */}
              <div className="flex items-center justify-between border-b border-line px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#e8b4a0]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#e8d5a0]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#a8d5b5]" />
                </div>
                <p className="font-mono text-[10px] tracking-wide text-muted">
                  builder · draft
                </p>
                <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-medium text-accent">
                  AI live
                </span>
              </div>

              <div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
                {/* Prompt panel */}
                <div className="border-b border-line p-4 md:border-b-0 md:border-r">
                  <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
                    Prompt bisnis
                  </p>
                  <div className="mt-3 rounded-2xl border border-line bg-surface-2/60 p-3">
                    <p className="text-[13px] leading-relaxed text-ink/85">
                      Kelas online copywriting 4 minggu untuk freelancers.
                      Harga Rp 499rb. Target: social seller & content creator.
                      CTA: daftar via link bayar Mayar.
                    </p>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                      <div className="h-full w-[72%] rounded-full bg-accent" />
                    </div>
                    <span className="font-mono text-[10px] text-muted">72%</span>
                  </div>
                  <p className="mt-2 text-[11px] text-muted">
                    Generating layout · hero · pricing · CTA
                  </p>
                </div>

                {/* Generated page preview */}
                <div className="bg-[linear-gradient(165deg,#0c0f14_0%,#1a2420_55%,#0f1f1c_100%)] p-4 text-white">
                  <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-[11px] font-medium tracking-wide text-white/70">
                        COPY LAB
                      </span>
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/60">
                        preview
                      </span>
                    </div>
                    <p className="font-[family-name:var(--font-display)] text-[1.35rem] leading-snug tracking-tight">
                      Tulis copy yang bikin orang bayar.
                    </p>
                    <p className="mt-2 text-[12px] leading-relaxed text-white/55">
                      Program 4 minggu · feedback live · sertifikat
                    </p>
                    <div className="mt-5 grid grid-cols-3 gap-2">
                      {["Modul", "Live Q&A", "Template"].map((item) => (
                        <div
                          key={item}
                          className="rounded-lg border border-white/10 bg-white/[0.05] px-2 py-2.5 text-center text-[10px] text-white/70"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="mt-5 w-full rounded-full bg-teal-400/90 py-2.5 text-[12px] font-semibold text-ink"
                    >
                      Daftar · Rp 499.000
                    </button>
                    <p className="mt-2 text-center text-[10px] text-white/40">
                      Pembayaran aman · link Mayar
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="flex items-center justify-between border-t border-line bg-surface-2/40 px-4 py-3">
                <div className="flex items-center gap-2 text-[11px] text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  Mobile-first · ID copy · payment CTA
                </div>
                <div className="hidden font-mono text-[10px] text-muted sm:block">
                  v0.1 · hero only
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
