/**
 * Testimonials from mayar.id homepage + case studies.
 *
 * Icons: real assets scraped from reference/mayar-id/assets
 * (same files Framer serves for the live mayar.id quote cards).
 *
 * Video titles + quote body text live in locale JSON.
 */

export type VideoTestimonial = {
  id: string;
  poster: string;
  href?: string;
};

/**
 * Circular icon on each quote card.
 * - avatar: photo / full-bleed mark fills the circle
 * - badge: logo with padding (icon marks on transparent/white)
 */
export type OrgQuoteIcon =
  | { kind: "avatar"; src: string }
  | { kind: "badge"; src: string; bg?: string };

export type OrgQuote = {
  id: string;
  org: string;
  person: string;
  icon: OrgQuoteIcon;
};

const I = "/specimen/testimonials/icons" as const;

export const VIDEO_TESTIMONIALS: readonly VideoTestimonial[] = [
  {
    id: "kang-aviv",
    poster: "/specimen/testimonials/whw2FM6vManEPWYhCSLqidxYT8.jpg",
    href: "https://mayar.id/case-study/kang-aviv-institute",
  },
  {
    id: "anang",
    poster: "/specimen/testimonials/8GTEpSx6ZsRKx2xd7C0HskhbYU.jpg",
    href: "https://www.youtube.com/watch?v=ApRxsxD2g_4",
  },
  {
    id: "dinar",
    poster: "/specimen/testimonials/0YMhFiJ7Vkycw4cmOyNZ8bTt5s.jpg",
    href: "https://www.youtube.com/watch?v=Unaph8DAqDs",
  },
  {
    id: "rinaldi",
    poster: "/specimen/testimonials/SmV1oYvB0zPEWJBYM9pfbdLChMU.jpg",
    href: "https://www.youtube.com/watch?v=Jmnn52ajHxc",
  },
] as const;

/**
 * Org quote cards — icons matched 1:1 to mayar.id homepage Framer assets.
 * Quote text: `testimonials.quotes.{id}` in locale JSON.
 */
export const ORG_QUOTES: readonly OrgQuote[] = [
  {
    id: "greenpeace",
    org: "Greenpeace Indonesia",
    person: "Ina Nathania",
    icon: { kind: "avatar", src: `${I}/greenpeace-g.jpg` },
  },
  {
    id: "digitalskola",
    org: "Digital Skola",
    person: "Stephanie Octavia",
    icon: { kind: "badge", src: `${I}/digitalskola-mark.png`, bg: "#fff" },
  },
  {
    id: "bossexcel",
    org: "Bossexcel.id",
    person: "Konten Kreator",
    icon: { kind: "avatar", src: `${I}/bossexcel.png` },
  },
  {
    id: "pacmann",
    org: "Pacmann",
    person: "Firas Rasyid",
    icon: { kind: "badge", src: `${I}/pacmann-mark.png`, bg: "#fff" },
  },
  {
    id: "srz",
    org: "SRZ Consulting",
    person: "Latisha",
    icon: { kind: "avatar", src: `${I}/srz.jpeg` },
  },
  {
    id: "parenting-berdua",
    org: "Parenting Berdua",
    person: "Konten Kreator",
    icon: { kind: "avatar", src: `${I}/parenting-berdua.png` },
  },
  {
    id: "hope",
    org: "HOPE Worldwide ID",
    person: "Michiel Kindangen",
    icon: { kind: "avatar", src: `${I}/hope-worldwide.png` },
  },
  {
    id: "tibra",
    org: "Tibra Overseas",
    person: "Tri Handoko",
    icon: { kind: "avatar", src: `${I}/tibra.jpeg` },
  },
  {
    id: "yayasan-guru-belajar",
    org: "Yayasan Guru Belajar",
    person: "Handy Pratama",
    icon: { kind: "badge", src: `${I}/yayasan-guru.png`, bg: "#fff" },
  },
  {
    id: "anang-quote",
    org: "Anang Marjono",
    person: "Content Creator",
    icon: { kind: "avatar", src: `${I}/anang.png` },
  },
  {
    id: "dinar-quote",
    org: "Dinar The HR",
    person: "HR Educator",
    icon: { kind: "avatar", src: `${I}/dinar.png` },
  },
  {
    id: "maksimalindiri",
    org: "Maksimalindiri",
    person: "Kreator & mentor",
    icon: { kind: "avatar", src: `${I}/maksimalindiri.png` },
  },
] as const;

/** Seconds for one full marquee loop (longer = slower) */
export const ORG_MARQUEE_SECONDS = 42;

export const ORG_QUOTE_INTERVAL_MS = 4500;
export const ORG_QUOTE_TRANSITION_MS = 550;
export const TESTIMONIALS = [] as const;
export const TESTIMONIAL_CYCLE_MS = 5200;
