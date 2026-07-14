import Image from "next/image";

/**
 * Official Mayar brand assets live in /public/brand (checked into the repo).
 * Source: Mayar SimplePay wordmark (M + Mayar + SimplePay).
 */

/** Full Mayar wordmark (header lockup). */
export function MayarWordmark({
  className = "",
  size = "sm",
}: {
  className?: string;
  size?: "sm" | "md";
}) {
  // Intrinsic 1112×348 — scale by height only (keep SimplePay legible)
  const h = size === "sm" ? 26 : 30;

  return (
    <Image
      src="/brand/mayar-wordmark.png"
      alt="Mayar"
      width={1112}
      height={348}
      priority
      className={className}
      style={{ height: h, width: "auto" }}
    />
  );
}

/** Official Mayar M mark only. */
export function MayarIcon({
  className = "",
  size = 20,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <Image
      src="/brand/mayar-m.png"
      alt=""
      width={334}
      height={348}
      className={className}
      style={{ height: size, width: "auto" }}
      aria-hidden
    />
  );
}

/**
 * Default brand lockup for the product UI: official wordmark image.
 */
export function MayarMark({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md";
}) {
  return <MayarWordmark className={className} size={size} />;
}
