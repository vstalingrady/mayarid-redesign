"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  DOMAIN_COLORS,
  FEATURE_EDGES,
  FEATURE_NODES,
  type FeatureDomain,
  type FeatureNode,
} from "@/data/features";
import { FeatureIcon } from "@/components/FeatureIcon";
import { useI18n } from "@/i18n";

const VB = 720;
const CX = VB / 2;
const CY = VB / 2;
const R_INNER = 168;
const R_OUTER = 298;
/** Full revolution of the constellation around the hub (seconds). */
const REVOLUTION_S = 42;
const AUTOPLAY_MS = 2600;

type Pos = { x: number; y: number };

/**
 * Place nodes on two orbits.
 * `phase` increases over time → inner ring clockwise (screen space),
 * outer ring uses -phase → counter-clockwise (opposite revolution).
 */
function placeNodes(nodes: FeatureNode[], phase: number): Map<string, Pos> {
  const map = new Map<string, Pos>();
  const inner = nodes.filter((n) => n.ring === 0);
  const outer = nodes.filter((n) => n.ring === 1);

  const domainOrder: FeatureDomain[] = [
    "sell",
    "pay",
    "run",
    "grow",
    "platform",
  ];
  const sortByDomain = (a: FeatureNode, b: FeatureNode) =>
    domainOrder.indexOf(a.domain) - domainOrder.indexOf(b.domain);

  const place = (
    list: FeatureNode[],
    radius: number,
    phase0: number,
    /** +1 clockwise-ish, -1 counter-clockwise relative to phase growth */
    direction: 1 | -1,
  ) => {
    const sorted = [...list].sort(sortByDomain);
    const n = sorted.length;
    sorted.forEach((node, i) => {
      const a = phase0 + direction * phase + (i / n) * Math.PI * 2;
      map.set(node.id, {
        x: CX + Math.cos(a) * radius,
        y: CY + Math.sin(a) * radius,
      });
    });
  };

  // Inner: with phase → one direction
  place(inner, R_INNER, -Math.PI / 2, 1);
  // Outer: opposite revolution + angular offset so nodes don't stack on spokes
  place(outer, R_OUTER, -Math.PI / 2 + Math.PI / (outer.length || 12), -1);
  return map;
}

/** Active node + its real product neighbors (selective highlight set). */
function neighborsOf(id: string): Set<string> {
  const s = new Set<string>([id]);
  for (const [a, b] of FEATURE_EDGES) {
    if (a === id) s.add(b);
    if (b === id) s.add(a);
  }
  return s;
}

type Props = {
  inView: boolean;
};

/**
 * Integration graph: Mayar hub + one spoke per feature.
 * Inner orbit revolves one way; outer orbit counter-clockwise (opposite).
 * Autoplay walks the active spoke.
 */
export function FeaturesGraph({ inView }: Props) {
  const { t } = useI18n();
  const [phase, setPhase] = useState(0);
  const [activeId, setActiveId] = useState(FEATURE_NODES[0]?.id ?? "");
  const [hovering, setHovering] = useState(false);
  const [tick, setTick] = useState(0);

  const domainLabel = (d: FeatureDomain) => t(`features.domains.${d}`);
  const nodeLabel = (id: string) => t(`features.nodes.${id}.label`);
  const nodeShort = (id: string) => t(`features.nodes.${id}.short`);

  // Continuous revolution around hub (pauses while hovering a node)
  useEffect(() => {
    if (!inView || hovering) return;
    let raf = 0;
    const t0 = performance.now();
    const startPhase = phase;
    const loop = (now: number) => {
      const elapsed = (now - t0) / 1000;
      setPhase(startPhase + (elapsed / REVOLUTION_S) * Math.PI * 2);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- preserve phase across hover pauses
  }, [inView, hovering]);

  // Active-node walk
  useEffect(() => {
    if (!inView || hovering || FEATURE_NODES.length === 0) return;
    const t = window.setInterval(() => {
      setActiveId((cur) => {
        const idx = FEATURE_NODES.findIndex((n) => n.id === cur);
        const next = FEATURE_NODES[(idx + 1) % FEATURE_NODES.length];
        return next?.id ?? cur;
      });
      setTick((n) => n + 1);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(t);
  }, [inView, hovering]);

  const positions = useMemo(
    () => placeNodes(FEATURE_NODES, phase),
    [phase],
  );

  /** All unique node–node pairs for subtle full mesh (background). */
  const meshPairs = useMemo(() => {
    const pairs: [string, string][] = [];
    for (let i = 0; i < FEATURE_NODES.length; i++) {
      for (let j = i + 1; j < FEATURE_NODES.length; j++) {
        const a = FEATURE_NODES[i];
        const b = FEATURE_NODES[j];
        if (a && b) pairs.push([a.id, b.id]);
      }
    }
    return pairs;
  }, []);

  const active = FEATURE_NODES.find((n) => n.id === activeId) ?? null;
  const hot = activeId ? neighborsOf(activeId) : null;

  return (
    <div
      className={`features-graph relative mx-auto flex w-full min-h-0 flex-col items-center justify-center ${
        inView ? "fg-live" : "fg-idle"
      }`}
    >
      {/*
        Always a perfect square so orbits stay circular (never oval).
        Drive size from width only + aspect-ratio:1 — setting both h and w
        independently was stretching the stage tall on mobile.
        12rem ≈ nav + section pad + footer/legend headroom.
      */}
      <div className="features-graph-stage relative mx-auto aspect-square h-auto w-[min(100%,840px,calc(100dvh-12rem))] max-w-full shrink-0">
        <svg
          viewBox={`0 0 ${VB} ${VB}`}
          className="absolute inset-0 h-full w-full overflow-visible"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={t("features.graphAria")}
        >
          <defs>
            <radialGradient id="fg-hub-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgb(37 99 235)" stopOpacity="0.12" />
              <stop offset="65%" stopColor="rgb(37 99 235)" stopOpacity="0.03" />
              <stop offset="100%" stopColor="rgb(37 99 235)" stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle cx={CX} cy={CY} r="100" fill="url(#fg-hub-glow)" />

          {/* Full mesh — every node linked, always faint background */}
          <g className="fg-mesh" aria-hidden>
            {meshPairs.map(([aId, bId]) => {
              const pa = positions.get(aId);
              const pb = positions.get(bId);
              if (!pa || !pb) return null;
              return (
                <line
                  key={`mesh-${aId}-${bId}`}
                  x1={pa.x}
                  y1={pa.y}
                  x2={pb.x}
                  y2={pb.y}
                  stroke="rgb(11 18 32 / 0.05)"
                  strokeWidth={0.75}
                  strokeLinecap="round"
                />
              );
            })}
          </g>

          {/* Selective product edges — only light when they touch the active node */}
          {FEATURE_EDGES.map(([aId, bId]) => {
            const pa = positions.get(aId);
            const pb = positions.get(bId);
            if (!pa || !pb) return null;
            const lit =
              !!hot &&
              ((aId === activeId && hot.has(bId)) ||
                (bId === activeId && hot.has(aId)));
            const domainA = FEATURE_NODES.find((n) => n.id === aId)?.domain;
            const color = domainA ? DOMAIN_COLORS[domainA] : "#2563eb";
            return (
              <g key={`edge-${aId}-${bId}`}>
                <line
                  x1={pa.x}
                  y1={pa.y}
                  x2={pb.x}
                  y2={pb.y}
                  stroke={lit ? color : "rgb(11 18 32 / 0.08)"}
                  strokeOpacity={lit ? 0.85 : 0.2}
                  strokeWidth={lit ? 2.4 : 1}
                  strokeLinecap="round"
                  className="transition-[stroke,stroke-opacity,stroke-width] duration-300"
                />
                {lit ? (
                  <line
                    x1={pa.x}
                    y1={pa.y}
                    x2={pb.x}
                    y2={pb.y}
                    stroke={color}
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeDasharray="8 90"
                    className="fg-edge-flow"
                    opacity={0.95}
                  />
                ) : null}
              </g>
            );
          })}

          {/* Hub → feature spokes */}
          {FEATURE_NODES.map((node) => {
            const p = positions.get(node.id);
            if (!p) return null;
            const isActive = node.id === activeId;
            const isHot = !!hot && hot.has(node.id);
            return (
              <line
                key={`spoke-${node.id}`}
                x1={CX}
                y1={CY}
                x2={p.x}
                y2={p.y}
                stroke={
                  isActive || isHot
                    ? DOMAIN_COLORS[node.domain]
                    : "rgb(11 18 32 / 0.12)"
                }
                strokeOpacity={isActive ? 0.85 : isHot ? 0.45 : 0.2}
                strokeWidth={isActive ? 2.25 : isHot ? 1.5 : 1.1}
                strokeLinecap="round"
                className="transition-[stroke,stroke-opacity,stroke-width] duration-300"
              />
            );
          })}
        </svg>

        {/* Hub — official Mayar M */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 flex h-[4.5rem] w-[4.5rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-line/50 bg-white shadow-[0_12px_36px_-12px_rgb(37_99_235/0.42)] sm:h-[5rem] sm:w-[5rem] lg:h-[5.5rem] lg:w-[5.5rem]">
          <Image
            src="/brand/mayar-favicon-source.png"
            alt="Mayar"
            width={362}
            height={363}
            className="h-10 w-10 object-contain sm:h-11 sm:w-11 lg:h-12 lg:w-12"
            priority={false}
          />
        </div>

        {/*
          Feature nodes: icon is always centered on the orbit point so spokes/edges
          meet the square center. Labels are absolute so they never shift the icon.
        */}
        {FEATURE_NODES.map((node, i) => {
          const p = positions.get(node.id);
          if (!p) return null;
          const isActive = activeId === node.id;
          const isHot = !!hot && hot.has(node.id);
          const left = (p.x / VB) * 100;
          const top = (p.y / VB) * 100;
          const color = DOMAIN_COLORS[node.domain];
          // Label sits inward (toward hub), not out on the rim
          const angle = Math.atan2(p.y - CY, p.x - CX);
          // cos < 0 → left half → inward is to the right of the icon
          const labelTowardCenter = Math.cos(angle) < 0 ? "right" : "left";
          const showLabel = isActive || isHot;

          return (
            <button
              key={node.id}
              type="button"
              onMouseEnter={() => {
                setActiveId(node.id);
                setHovering(true);
              }}
              onMouseLeave={() => setHovering(false)}
              onFocus={() => {
                setActiveId(node.id);
                setHovering(true);
              }}
              onBlur={() => setHovering(false)}
              className={[
                "group absolute z-20 outline-none",
                "fg-node",
                inView ? "fg-node-in" : "",
                isActive || isHot ? "z-30" : "",
                isHot ? "" : "fg-node-dim",
              ].join(" ")}
              style={{
                left: `${left}%`,
                top: `${top}%`,
                animationDelay: inView ? `${i * 40}ms` : "0ms",
                ["--node-color" as string]: color,
              }}
              aria-pressed={isActive}
              aria-label={`${nodeLabel(node.id)} · ${domainLabel(node.domain)}`}
            >
              <span
                className={[
                  "relative flex h-9 w-9 items-center justify-center rounded-2xl border bg-white sm:h-10 sm:w-10 lg:h-11 lg:w-11",
                  "shadow-[0_4px_12px_-5px_rgb(11_18_32/0.16)]",
                  "transition-[border-color,box-shadow,transform] duration-300",
                  isActive
                    ? "fg-node-active border-[color:var(--node-color)] scale-110"
                    : isHot
                      ? "border-[color:var(--node-color)] scale-105"
                      : "border-[rgb(11_18_32/0.08)] group-hover:border-[color:var(--node-color)] group-hover:scale-105",
                  "focus-visible:ring-2 focus-visible:ring-blue/35",
                ].join(" ")}
              >
                <FeatureIcon
                  name={node.icon}
                  size={18}
                  weight={isActive || isHot ? "fill" : "regular"}
                  style={{
                    color: isActive || isHot ? color : "rgb(11 18 32 / 0.5)",
                  }}
                />
                {showLabel ? (
                  <span
                    className={[
                      "pointer-events-none absolute top-1/2 z-10 -translate-y-1/2 whitespace-nowrap",
                      "text-[10px] font-semibold leading-none tracking-tight sm:text-[11px] lg:text-[12px]",
                      "fg-caption",
                      isActive ? "text-ink" : "text-ink/75",
                      // Keep label on the hub-facing side without moving the square
                      labelTowardCenter === "left"
                        ? "right-[calc(100%+0.35rem)]"
                        : "left-[calc(100%+0.35rem)]",
                    ].join(" ")}
                  >
                    {nodeShort(node.id)}
                  </span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>

      {/* Compact footer — stays inside the viewport with the graph */}
      <div className="mx-auto mt-0.5 w-full max-w-lg shrink-0 sm:mt-1">
        <div
          className="mb-1 h-0.5 w-full overflow-hidden rounded-full bg-ink/[0.07] sm:mb-1.5 sm:h-1"
          aria-hidden
        >
          {inView && !hovering ? (
            <div
              key={`${activeId}-${tick}`}
              className="fg-progress h-full rounded-full bg-blue"
              style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
            />
          ) : (
            <div className="h-full w-0 bg-blue" />
          )}
        </div>

        <div
          className="flex min-h-[2.5rem] flex-col items-center justify-center rounded-xl border border-line/60 bg-white/85 px-3 py-1.5 text-center sm:min-h-[2.75rem] sm:rounded-2xl sm:py-2 lg:min-h-[3rem]"
          aria-live="polite"
        >
          {active ? (
            <>
              <p
                key={`title-${active.id}`}
                className="fg-caption flex items-center gap-1.5 text-[12.5px] font-semibold text-ink sm:text-[13.5px] lg:text-[14.5px]"
              >
                <FeatureIcon
                  name={active.icon}
                  size={15}
                  weight="fill"
                  style={{ color: DOMAIN_COLORS[active.domain] }}
                />
                {nodeLabel(active.id)}
              </p>
              <p
                key={`sub-${active.id}`}
                className="fg-caption mt-0.5 text-[10.5px] text-muted sm:text-[11px] lg:text-[12px]"
              >
                <span
                  className="font-semibold"
                  style={{ color: DOMAIN_COLORS[active.domain] }}
                >
                  {domainLabel(active.domain)}
                </span>
                {" · "}
                {t("features.linkedTo").replace(
                  "{count}",
                  String(Math.max(0, (hot?.size ?? 1) - 1)),
                )}
              </p>
            </>
          ) : null}
        </div>
      </div>

      <ul className="mt-1.5 flex list-none flex-wrap items-center justify-center gap-x-3 gap-y-1 sm:mt-2 sm:gap-x-4">
        {(
          ["sell", "pay", "run", "grow", "platform"] as FeatureDomain[]
        ).map((d) => (
          <li
            key={d}
            className="inline-flex items-center gap-1 text-[10px] font-medium text-muted sm:text-[11px]"
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: DOMAIN_COLORS[d] }}
              aria-hidden
            />
            {domainLabel(d)}
          </li>
        ))}
      </ul>
    </div>
  );
}
