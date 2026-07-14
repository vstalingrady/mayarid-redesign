"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { getProductImage, type ProductType } from "@/data/productTypes";
import { useI18n } from "@/i18n";

type Props = {
  product: ProductType;
};

type Layer = {
  id: string;
  src: string;
  alt: string;
  family: ProductType["family"];
  label: string;
};

/**
 * Left media — dual-buffer crossfade + ken-burns zoom (starts at 1.0).
 */
export function ProductMediaPanel({ product }: Props) {
  const { t } = useI18n();

  const toLayer = (p: ProductType): Layer => {
    const { src } = getProductImage(p);
    return {
      id: p.id,
      src,
      alt: t(`products.alts.${p.id}`),
      family: p.family,
      label: t(`products.types.${p.id}`),
    };
  };

  const [front, setFront] = useState<Layer>(() => toLayer(product));
  const [back, setBack] = useState<Layer>(() => toLayer(product));
  const [showFront, setShowFront] = useState(true);
  const shownIdRef = useRef(product.id);

  // Apply live locale strings at render time (no effect sync)
  const withLocale = (layer: Layer): Layer => ({
    ...layer,
    label: t(`products.types.${layer.id}`),
    alt: t(`products.alts.${layer.id}`),
  });

  useEffect(() => {
    if (product.id === shownIdRef.current) return;
    const next = toLayer(product);
    shownIdRef.current = product.id;
    // Defer so we don't setState synchronously in the effect body
    const id = window.requestAnimationFrame(() => {
      setShowFront((wasFront) => {
        if (wasFront) setBack(next);
        else setFront(next);
        return !wasFront;
      });
    });
    return () => window.cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- toLayer closes over t
  }, [product, t]);

  const frontLive = withLocale(front);
  const backLive = withLocale(back);
  const caption = showFront ? frontLive : backLive;

  return (
    <div className="product-explorer-media relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-line/70 bg-white/30 sm:aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-0">
      <ImageLayer layer={frontLive} active={showFront} />
      <ImageLayer layer={backLive} active={!showFront} />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-ink/60 via-ink/25 to-transparent px-3 pb-3 pt-14 sm:px-4 sm:pb-3.5">
        <p
          key={`fam-${caption.id}`}
          className="product-explorer-caption font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-white/85 sm:text-[10px]"
        >
          {t(`products.families.${caption.family}`)}
        </p>
        <p
          key={`lbl-${caption.id}`}
          className="product-explorer-caption text-[15px] font-semibold leading-snug text-white sm:text-base"
        >
          {caption.label}
        </p>
      </div>
    </div>
  );
}

function ImageLayer({ layer, active }: { layer: Layer; active: boolean }) {
  return (
    <div
      className={`absolute inset-0 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        active ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden={!active}
    >
      {/* key forces ken-burns restart when this layer becomes active */}
      <Image
        key={`${layer.id}-${active ? "on" : "off"}`}
        src={layer.src}
        alt={active ? layer.alt : ""}
        fill
        sizes="(max-width: 1024px) 100vw, 60vw"
        className={`object-cover ${active ? "product-explorer-kenburns" : ""}`}
        priority={false}
      />
    </div>
  );
}
