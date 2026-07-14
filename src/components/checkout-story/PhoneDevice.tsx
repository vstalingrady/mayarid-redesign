"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import { BuyerScreen } from "./BuyerScreen";
import { MerchantScreen } from "./MerchantScreen";

type Props = {
  progressRef: MutableRefObject<number>;
};

/**
 * CSS 3D iPhone — wider face so the screen doesn’t look squashed.
 * Mild yaw only (heavy rotateY foreshortens width hard).
 */
export function PhoneDevice({ progressRef }: Props) {
  const shellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const p = progressRef.current;
      const el = shellRef.current;
      if (el) {
        // Face the direction of travel: tip right early, tip left late
        // Peak roll/pitch mid-story so the swap reads as a flip, not a slide
        const mid = Math.sin(Math.PI * p);
        const yaw = 12 - p * 24; // +12° → -12°
        const roll = -1.5 + p * 3 + mid * 2;
        const pitch = 3 + mid * 4;
        el.style.transform = `rotateX(${pitch.toFixed(2)}deg) rotateY(${yaw.toFixed(2)}deg) rotateZ(${roll.toFixed(2)}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progressRef]);

  return (
    <div
      className="phone-device relative mx-auto flex h-full w-full max-h-full items-center justify-center"
      style={{
        perspective: "1200px",
        perspectiveOrigin: "50% 45%",
      }}
    >
      {/* Floor shadow */}
      <div
        className="pointer-events-none absolute bottom-[2%] left-1/2 z-0 h-[6%] w-[70%] -translate-x-1/2 rounded-[50%] bg-black/35 blur-2xl"
        aria-hidden
      />

      <div
        ref={shellRef}
        className="relative z-[1] h-full w-full"
        style={{
          // Match parent: slightly wider than pure 9:19 so the chassis doesn’t read as a stick
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {/* Depth / thickness (back face slightly offset in Z) */}
        <div
          className="absolute inset-0 rounded-[clamp(1.7rem,13%,2.25rem)]"
          style={{
            transform: "translateZ(-10px) scale(0.99)",
            background: "linear-gradient(145deg, #1a1a1c 0%, #0a0a0b 100%)",
            boxShadow: "0 0 0 1px rgb(0 0 0 / 0.5)",
          }}
          aria-hidden
        />

        {/* Outer titanium shell — thinner chrome so glass reads wider */}
        <div
          className="absolute inset-0 rounded-[clamp(1.7rem,12%,2.25rem)] p-[clamp(0.22rem,1.7%,0.34rem)]"
          style={{
            background: `
              linear-gradient(
                145deg,
                #6b6b70 0%,
                #3a3a3e 18%,
                #1c1c1e 42%,
                #2a2a2e 68%,
                #4a4a4e 88%,
                #1a1a1c 100%
              )
            `,
            boxShadow: `
              0 28px 50px -16px rgb(0 0 0 / 0.55),
              0 12px 24px -12px rgb(0 0 0 / 0.4),
              inset 0 1px 0 rgb(255 255 255 / 0.22),
              inset 0 -1px 0 rgb(0 0 0 / 0.45),
              inset 1px 0 0 rgb(255 255 255 / 0.08),
              inset -1px 0 0 rgb(0 0 0 / 0.35)
            `,
            transform: "translateZ(0)",
          }}
        >
          {/* Inner black bezel */}
          <div
            className="relative h-full w-full overflow-hidden rounded-[clamp(1.4rem,11%,1.9rem)]"
            style={{
              background: "#050505",
              boxShadow: `
                inset 0 0 0 1.5px rgb(0 0 0 / 0.8),
                inset 0 0 20px rgb(0 0 0 / 0.5)
              `,
            }}
          >
            {/* Screen — slim side bezels so usable width is wide */}
            <div
              className="absolute overflow-hidden bg-white"
              style={{
                top: "1.25%",
                bottom: "1.25%",
                left: "1.8%",
                right: "1.8%",
                borderRadius: "clamp(1.2rem, 10%, 1.65rem)",
                boxShadow: "inset 0 0 0 1px rgb(0 0 0 / 0.12)",
              }}
            >
              <ScreenStack progressRef={progressRef} />
            </div>

            {/* Dynamic Island */}
            <div
              className="pointer-events-none absolute left-1/2 z-20 -translate-x-1/2 rounded-full bg-black"
              style={{
                top: "clamp(0.55rem, 3.1%, 0.78rem)",
                width: "clamp(4.4rem, 32%, 5.6rem)",
                height: "clamp(1.05rem, 5.8%, 1.3rem)",
                boxShadow:
                  "inset 0 0 0 1px rgb(255 255 255 / 0.06), 0 1px 2px rgb(0 0 0 / 0.5)",
              }}
              aria-hidden
            >
              <span
                className="absolute right-[16%] top-1/2 h-[40%] w-[11%] -translate-y-1/2 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 35% 35%, #3a5a80, #0a1525 70%)",
                  boxShadow: "0 0 4px rgb(80 140 220 / 0.35)",
                }}
              />
            </div>

            {/* Home indicator */}
            <div
              className="pointer-events-none absolute bottom-[0.4rem] left-1/2 z-20 h-[0.2rem] w-[26%] -translate-x-1/2 rounded-full bg-ink/25"
              aria-hidden
            />
          </div>
        </div>

        {/* Side buttons — left */}
        <span
          className="pointer-events-none absolute rounded-l-sm"
          style={{
            top: "18%",
            left: "-2px",
            width: "3px",
            height: "4.5%",
            background: "linear-gradient(90deg, #2a2a2c, #4a4a4e)",
            transform: "translateZ(4px)",
          }}
          aria-hidden
        />
        <span
          className="pointer-events-none absolute rounded-l-sm"
          style={{
            top: "25%",
            left: "-2px",
            width: "3px",
            height: "7%",
            background: "linear-gradient(90deg, #2a2a2c, #4a4a4e)",
            transform: "translateZ(4px)",
          }}
          aria-hidden
        />
        <span
          className="pointer-events-none absolute rounded-l-sm"
          style={{
            top: "34%",
            left: "-2px",
            width: "3px",
            height: "7%",
            background: "linear-gradient(90deg, #2a2a2c, #4a4a4e)",
            transform: "translateZ(4px)",
          }}
          aria-hidden
        />
        {/* Power — right */}
        <span
          className="pointer-events-none absolute rounded-r-sm"
          style={{
            top: "22%",
            right: "-2px",
            width: "3px",
            height: "9%",
            background: "linear-gradient(270deg, #2a2a2c, #4a4a4e)",
            transform: "translateZ(4px)",
          }}
          aria-hidden
        />

        {/* Specular gloss overlay */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[clamp(1.7rem,13%,2.25rem)]"
          style={{
            background:
              "linear-gradient(115deg, rgb(255 255 255 / 0.14) 0%, transparent 38%, transparent 62%, rgb(255 255 255 / 0.05) 100%)",
            transform: "translateZ(2px)",
          }}
          aria-hidden
        />
      </div>
    </div>
  );
}

function ScreenStack({
  progressRef,
}: {
  progressRef: MutableRefObject<number>;
}) {
  const buyerRef = useRef<HTMLDivElement>(null);
  const merchantRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const p = progressRef.current;
      const buyer = 1 - Math.min(1, Math.max(0, (p - 0.32) / 0.28));
      const merchant = Math.min(1, Math.max(0, (p - 0.38) / 0.28));
      if (buyerRef.current) buyerRef.current.style.opacity = String(buyer);
      if (merchantRef.current)
        merchantRef.current.style.opacity = String(merchant);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progressRef]);

  return (
    <div className="relative h-full w-full">
      <div ref={buyerRef} className="absolute inset-0">
        <BuyerScreen />
      </div>
      <div ref={merchantRef} className="absolute inset-0 opacity-0">
        <MerchantScreen />
      </div>
    </div>
  );
}
