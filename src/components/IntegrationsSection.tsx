"use client";

import Image from "next/image";
import {
  INTEGRATION_CLUSTERS,
  type IntegrationCluster,
  type IntegrationClusterId,
  type IntegrationLogo,
} from "@/data/integrations";
import { useStageCycle, useStageInView } from "@/hooks/useStageCycle";
import { useI18n } from "@/i18n";

const CYCLE_MS = 4200;

type ClusterCopy = {
  title: string;
  hint: string;
  toastTitle: string;
  toastAmount: string;
  toastAction: string;
};

function LogoTile({
  logo,
  dimmed,
}: {
  logo: IntegrationLogo;
  dimmed?: boolean;
}) {
  const wide = logo.fit === "wide";
  return (
    <div
      title={logo.label}
      className={[
        "flex shrink-0 items-center justify-center rounded-lg border border-line/50 bg-white transition-[opacity,transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:rounded-xl",
        wide
          ? "h-9 w-auto min-w-[3.75rem] px-2.5 sm:h-10 sm:min-w-[4.25rem] sm:px-3"
          : "h-9 w-9 sm:h-10 sm:w-10",
        dimmed
          ? "scale-[0.97] opacity-[0.42] shadow-[0_2px_8px_-4px_rgb(11_18_32/0.12)]"
          : "scale-100 opacity-100 shadow-[0_6px_14px_-8px_rgb(37_99_235/0.35),0_0_0_1px_rgb(37_99_235/0.15)]",
      ].join(" ")}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logo.src}
        alt={logo.label}
        width={wide ? 96 : 28}
        height={24}
        className={
          wide
            ? "pointer-events-none block h-5 w-auto max-h-5 object-contain sm:h-[1.35rem] sm:max-h-[1.35rem]"
            : "pointer-events-none block h-5 w-5 object-contain sm:h-6 sm:w-6"
        }
        style={wide ? { maxWidth: "5.5rem" } : undefined}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

function ClusterCard({
  cluster,
  copy,
  active,
  onSelect,
}: {
  cluster: IntegrationCluster;
  copy: ClusterCopy;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      onFocus={onSelect}
      className={[
        "w-full rounded-2xl border p-3 text-left transition-[border-color,background-color,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:p-3.5",
        active
          ? "border-blue/25 bg-blue/[0.04] shadow-[0_12px_28px_-18px_rgb(37_99_235/0.4)]"
          : "border-ink/10 bg-white/70 shadow-none",
      ].join(" ")}
      aria-pressed={active}
    >
      <div className="flex items-baseline justify-between gap-2">
        <p
          className={[
            "text-[11px] font-bold tracking-tight transition-colors duration-300 sm:text-[12px]",
            active ? "text-blue" : "text-ink",
          ].join(" ")}
        >
          {copy.title}
        </p>
        <p className="truncate text-[10px] text-muted">{copy.hint}</p>
      </div>
      <div className="mt-2.5 flex flex-wrap items-center gap-1.5 sm:gap-2">
        {cluster.logos.map((logo) => (
          <LogoTile key={logo.id} logo={logo} dimmed={!active} />
        ))}
      </div>
    </button>
  );
}

/**
 * Integrations hub — payments / logistics / apps around Mayar + Zapier.
 * Motion: motion.css stage-* classes (product-explorer pattern).
 */
export function IntegrationsSection() {
  const { t, messages } = useI18n();
  const { ref, inView, seen } = useStageInView(0.05);
  const { index, tick, jumpTo } = useStageCycle(
    INTEGRATION_CLUSTERS.length,
    CYCLE_MS,
    inView,
  );

  const clusterCopy = (id: IntegrationClusterId): ClusterCopy => {
    const c = messages.integrations?.clusters?.[id] as
      | Partial<ClusterCopy>
      | undefined;
    return {
      title: c?.title ?? id,
      hint: c?.hint ?? "",
      toastTitle: c?.toastTitle ?? "",
      toastAmount: c?.toastAmount ?? "",
      toastAction: c?.toastAction ?? "",
    };
  };

  const activeId =
    INTEGRATION_CLUSTERS[index]?.id ?? INTEGRATION_CLUSTERS[0]!.id;
  const activeCluster =
    INTEGRATION_CLUSTERS.find((c) => c.id === activeId) ??
    INTEGRATION_CLUSTERS[0]!;
  const active = clusterCopy(activeCluster.id);
  const live = seen;

  const select = (id: IntegrationClusterId) => {
    const i = INTEGRATION_CLUSTERS.findIndex((c) => c.id === id);
    if (i >= 0) jumpTo(i);
  };

  return (
    <section
      id="integrasi"
      ref={ref}
      aria-labelledby="integrations-heading"
      className="relative overflow-hidden border-t border-line/50 bg-bg px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_25%_50%,rgb(37_99_235/0.05),transparent_55%)]"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-[1120px] items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-14">
        <div
          className={`relative order-2 pb-16 lg:order-1 lg:pb-14 ${
            seen ? "stage-enter-delay" : "stage-pending"
          }`}
        >
          <div
            className={`relative overflow-hidden rounded-2xl border border-line/70 bg-white shadow-[0_28px_60px_-28px_rgb(11_18_32/0.22)] sm:rounded-[1.25rem] ${
              live ? "stage-float" : ""
            }`}
          >
            <div className="flex items-center gap-1.5 border-b border-line/50 bg-[#fafbfc] px-3.5 py-2.5">
              <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
              <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
              <span className="h-2 w-2 rounded-full bg-[#28c840]" />
              <span className="ml-2 text-[11px] font-medium text-muted">
                {t("integrations.windowTitle")}
              </span>
            </div>

            <div className="space-y-3 p-3.5 sm:space-y-3.5 sm:p-5">
              <div className="flex items-center justify-center gap-3 sm:gap-4">
                <div
                  className={`flex items-center gap-2 rounded-2xl border border-line/60 bg-bg/80 px-3 py-2 sm:px-4 sm:py-2.5 ${
                    live ? "stage-hub-glow" : ""
                  }`}
                >
                  <Image
                    src="/brand/mayar-wordmark.png"
                    alt="Mayar"
                    width={1112}
                    height={348}
                    className="h-5 w-auto object-contain sm:h-6"
                  />
                </div>

                <div
                  className="relative h-px w-8 bg-gradient-to-r from-ink/15 via-blue/55 to-ink/15 sm:w-12"
                  aria-hidden
                >
                  {live ? (
                    <span className="stage-flow absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-blue shadow-[0_0_0_3px_rgb(37_99_235/0.18)]" />
                  ) : null}
                </div>

                <div
                  className={`flex items-center gap-2 rounded-2xl border border-line/60 bg-white px-3 py-2 sm:px-3.5 sm:py-2.5 ${
                    live ? "stage-hub-glow-delay" : ""
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/specimen/integrations/zapier.svg"
                    alt="Zapier"
                    width={20}
                    height={20}
                    className="h-5 w-5 object-contain"
                  />
                  <span className="text-[12px] font-bold text-ink sm:text-[13px]">
                    Zapier
                  </span>
                </div>
              </div>

              <p className="text-center text-[10px] font-medium text-muted sm:text-[11px]">
                {t("integrations.hubBlurb")}
              </p>

              <div className="grid gap-2.5 sm:gap-3">
                {INTEGRATION_CLUSTERS.map((cluster, i) => (
                  <div
                    key={cluster.id}
                    className={seen ? "stage-enter" : "opacity-0"}
                    style={
                      seen
                        ? { animationDelay: `${100 + i * 80}ms` }
                        : undefined
                    }
                  >
                    <ClusterCard
                      cluster={cluster}
                      copy={clusterCopy(cluster.id)}
                      active={cluster.id === activeId}
                      onSelect={() => select(cluster.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Toast — float shell + content swap */}
          <div
            className={`absolute -bottom-2 left-3 z-10 h-[7.75rem] w-[15.75rem] sm:-bottom-3 sm:left-5 sm:h-[8rem] sm:w-[16.5rem] ${
              live ? "stage-float-soft" : "opacity-0"
            }`}
          >
            <div
              className={`flex h-full w-full flex-col rounded-2xl border border-line/60 bg-white p-3.5 shadow-[0_18px_40px_-16px_rgb(11_18_32/0.35)] sm:p-4 ${
                seen ? "stage-toast-in" : ""
              }`}
            >
              <div
                key={`${activeCluster.id}-${tick}`}
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
                    <p className="line-clamp-1 text-[12px] font-bold leading-snug text-ink sm:text-[13px]">
                      {active.toastTitle}
                    </p>
                    <p className="mt-0.5 truncate text-[11.5px] text-muted sm:text-[12px]">
                      {activeCluster.id === "logistics" ? (
                        active.toastAmount
                      ) : (
                        <>
                          {t("integrations.amountPrefix")}{" "}
                          <span className="font-semibold text-ink">
                            {active.toastAmount}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  tabIndex={-1}
                  className="mt-auto flex h-9 w-full shrink-0 items-center justify-center rounded-lg bg-blue text-[12px] font-bold text-white shadow-[0_8px_16px_-10px_rgb(37_99_235/0.55)]"
                >
                  {active.toastAction}
                </button>
              </div>
            </div>
          </div>
        </div>

        <header
          className={`order-1 max-w-xl lg:order-2 ${seen ? "stage-enter" : "stage-pending"}`}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue sm:text-[12px]">
            {t("integrations.eyebrow")}
          </p>
          <h2
            id="integrations-heading"
            className="mt-3 text-balance text-[1.75rem] font-bold leading-[1.12] tracking-tight text-ink sm:text-[2.15rem] lg:text-[2.45rem]"
          >
            {t("integrations.title")}
          </h2>
          <p className="mt-4 text-pretty text-[14px] leading-relaxed text-muted sm:text-[15px]">
            {t("integrations.body")}
          </p>

          <ul className="mt-6 flex flex-wrap gap-2">
            {INTEGRATION_CLUSTERS.map((c, i) => {
              const isActive = c.id === activeId;
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => jumpTo(i)}
                    className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors duration-200 sm:text-[12px] ${
                      isActive
                        ? "bg-ink text-white shadow-sm"
                        : "bg-ink/[0.05] text-muted hover:bg-ink/[0.08] hover:text-ink"
                    }`}
                  >
                    {clusterCopy(c.id).title}
                  </button>
                </li>
              );
            })}
          </ul>
        </header>
      </div>
    </section>
  );
}
