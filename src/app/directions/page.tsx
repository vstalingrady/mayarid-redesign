import Link from "next/link";
import { DirectionA } from "@/components/product-directions/DirectionA";
import { DirectionB } from "@/components/product-directions/DirectionB";
import { DirectionC } from "@/components/product-directions/DirectionC";
import { DirectionD } from "@/components/product-directions/DirectionD";
import { DirectionE } from "@/components/product-directions/DirectionE";
import { DirectionFrame } from "@/components/product-directions/shared";

const NAV = [
  { id: "dir-a", letter: "A", name: "Glass chips" },
  { id: "dir-b", letter: "B", name: "Grouped bento" },
  { id: "dir-c", letter: "C", name: "Filter grid" },
  { id: "dir-d", letter: "D", name: "Coverflow strip" },
  { id: "dir-e", letter: "E", name: "Original color" },
] as const;

export const metadata = {
  title: "Product grid directions — Mayar lab",
  description:
    "Compare five design directions for the Mayar product-types section.",
};

/**
 * Lab page: all product-type section directions stacked for side-by-side choice.
 * Run: npm run dev:lab  →  http://localhost:3001/directions
 */
export default function DirectionsLabPage() {
  return (
    <div className="min-h-[100dvh] bg-bg">
      <header className="sticky top-0 z-40 border-b border-line/80 bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-3 px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-blue">
              Design lab · port 3001
            </p>
            <h1 className="text-[15px] font-bold tracking-tight text-ink sm:text-[16px]">
              Product types — pick a direction
            </h1>
          </div>
          <nav
            className="flex flex-wrap items-center gap-1.5"
            aria-label="Jump to direction"
          >
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className="rounded-full border border-line bg-white px-2.5 py-1 text-[11px] font-semibold text-ink-soft transition-colors hover:border-blue/30 hover:text-ink"
              >
                {n.letter}
                <span className="hidden sm:inline"> · {n.name}</span>
              </a>
            ))}
            <Link
              href="/"
              className="ml-1 rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-white"
            >
              Home
            </Link>
          </nav>
        </div>
      </header>

      <div className="border-b border-line bg-white/60 px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[720px]">
          <h2 className="text-[1.35rem] font-bold tracking-tight text-ink sm:text-[1.5rem]">
            How to use this lab
          </h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-[14px] leading-relaxed text-muted">
            <li>
              Scroll each direction (or jump with the sticky nav). Hover tiles —
              motion matches the dashboard card language where it fits.
            </li>
            <li>
              Compare hierarchy, scan speed, brand fit with the cream specimen,
              and mobile feel (resize the window).
            </li>
            <li>
              Tell the agent which letter wins (or hybrid, e.g.{" "}
              <strong className="text-ink">A+B</strong>). That one ships on the
              main page.
            </li>
          </ol>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <p className="rounded-xl border border-line bg-bg px-3.5 py-2.5 text-[12px] text-ink-soft">
              <span className="font-semibold text-ink">A / B</span> fit the
              specimen best.{" "}
              <span className="font-semibold text-ink">E</span> matches live
              mayar.id energy.
            </p>
            <p className="rounded-xl border border-line bg-bg px-3.5 py-2.5 text-[12px] text-ink-soft">
              <span className="font-semibold text-ink">C</span> is interactive.{" "}
              <span className="font-semibold text-ink">D</span> is motion-first /
              carousel energy.
            </p>
          </div>
        </div>
      </div>

      <DirectionFrame
        id="dir-a"
        letter="A"
        name="Specimen glass chips"
        blurb="White/cream cards, Phosphor icons, same hover lift as dashboard .dash-card. Coherent with the rest of the specimen."
        pros="Brand fit, a11y-friendly, simple to maintain"
        cons="Less loud than original marketing site"
      >
        <DirectionA />
      </DirectionFrame>

      <DirectionFrame
        id="dir-b"
        letter="B"
        name="Grouped bento"
        blurb="Hero tile for Link Pembayaran + family clusters with soft tints. Hierarchy for scanning 18 product types."
        pros="Scannable, premium, fixes flat equal-weight grid"
        cons="Taller section; more layout complexity"
      >
        <DirectionB />
      </DirectionFrame>

      <DirectionFrame
        id="dir-c"
        letter="C"
        name="Filterable grid"
        blurb="Family filter chips + live count. Same card language as A, but interactive discovery."
        pros="Scales past 18 types; feels product-demo-y"
        cons="Needs client JS; filters can hide breadth on first paint"
      >
        <DirectionC />
      </DirectionFrame>

      <DirectionFrame
        id="dir-d"
        letter="D"
        name="Coverflow strip"
        blurb="Horizontal scroll-snap cards with arrows. Same kinetic energy as the audience carousel."
        pros="Distinctive motion; fun on desktop"
        cons="Worse for find-and-click; SEO/scan weaker"
      >
        <DirectionD />
      </DirectionFrame>

      <DirectionFrame
        id="dir-e"
        letter="E"
        name="Original color bricks"
        blurb="Faithful mayar.id blue / navy / pink blocks, plus icon + hover lift polish and complete grid."
        pros="Matches live site recognition; high energy"
        cons="Fights cream specimen palette; contrast care on pink"
      >
        <DirectionE />
      </DirectionFrame>

      <footer className="px-5 py-12 text-center sm:px-8">
        <p className="text-[14px] font-medium text-ink">
          Ready to choose? Reply with{" "}
          <span className="text-blue">A, B, C, D, E</span> or a hybrid.
        </p>
        <p className="mt-2 text-[13px] text-muted">
          Lab only — main homepage is unchanged until you pick.
        </p>
      </footer>
    </div>
  );
}
