/**
 * Site footer structure (hrefs + non-copy metadata).
 * Column titles and link labels live in locale JSON (`footer.columns.*`).
 */

export type FooterColumnId =
  | "industri"
  | "teknologi"
  | "bantuan"
  | "perusahaan"
  | "legal";

export type FooterColumnMeta = {
  id: FooterColumnId;
  /** Ordered hrefs — labels come from locale by index */
  hrefs: readonly string[];
};

const MAYAR = "https://mayar.id";

function m(path: string): string {
  return `${MAYAR}${path.startsWith("/") ? path : `/${path}`}`;
}

export const FOOTER_COLUMN_META: readonly FooterColumnMeta[] = [
  {
    id: "industri",
    hrefs: [
      m("/learning"),
      m("/creator-economy"),
      m("/online-retail"),
      m("/event-organizer"),
      m("/fundraiser-online"),
      m("/software-and-saas"),
      m("/writing-and-comic"),
    ],
  },
  {
    id: "teknologi",
    hrefs: [
      m("/ai-website-builder"),
      "https://docs.mayar.id/api-reference/introduction",
      m("/mcp"),
      m("/video-drm"),
      m("/headless-commerce"),
      m("/integrasi-zapier"),
      "https://github.com/mayarid/mayar-cli",
      "https://clawhub.ai/mayar/mayar",
      "https://github.com/mayarid/mayar-cli/blob/main/SKILL.md",
    ],
  },
  {
    id: "bantuan",
    hrefs: [
      m("/pricing"),
      m("/case-study"),
      "https://www.youtube.com/@mayarid",
      "https://www.youtube.com/@mayarid",
      m("/faq"),
      "https://docs.mayar.id/",
      "https://docs.mayar.id/api-reference/introduction",
      "https://docs.mayar.id/llms.txt",
      "https://mayar.instatus.com/",
      "https://feedback.mayar.id/changelog",
      "https://learning.mayar.link/",
      m("/resources"),
      "https://tools.mayar.id/",
      "https://learning.mayar.link/",
      "https://academy.myr.id/",
      m("/demo"),
      "https://portal.mayar.id/",
      "https://dev.mayar.id/",
      m("/agents"),
    ],
  },
  {
    id: "perusahaan",
    hrefs: [
      m("/about"),
      "https://blog.mayar.id/",
      m("/jobs"),
      "https://github.com/mayarid",
      "https://huggingface.co/mayarid",
      "https://app.air.inc/a/bmQJyn6J7",
      "https://trust.mayar.id/",
    ],
  },
  {
    id: "legal",
    hrefs: [m("/kebijakan-privasi"), m("/kebijakan-layanan")],
  },
] as const;

/**
 * Compliance seals from mayar.id footer (AICPA SOC, ISO 27001, GDPR, HIPAA).
 * Source assets: reference/mayar-id (framerusercontent circular PNGs).
 * `onBlue` — light pad for seals that are blue-on-transparent (HIPAA).
 */
export const FOOTER_CERTIFICATES = [
  {
    id: "aicpa-soc",
    label: "AICPA SOC",
    src: "/specimen/footer/aicpa-soc.png",
    href: "https://trust.mayar.id/",
    onBlue: "default" as const,
  },
  {
    id: "iso-27001",
    label: "ISO 27001",
    src: "/specimen/footer/iso-badge.png",
    href: "https://trust.mayar.id/",
    onBlue: "default" as const,
  },
  {
    id: "gdpr",
    label: "GDPR",
    src: "/specimen/footer/gdpr.png",
    href: "https://trust.mayar.id/",
    onBlue: "default" as const,
  },
  {
    id: "hipaa",
    label: "HIPAA",
    src: "/specimen/footer/hipaa.png",
    href: "https://trust.mayar.id/",
    // Blue caduceus on transparent — needs white circular plate on #2563eb
    onBlue: "light" as const,
  },
] as const;

/** Entity names + addresses (proper nouns; not locale-switched). */
export const FOOTER_LEGAL_ENTITIES = [
  {
    name: "PT Mayar Kernel Supernova",
    address:
      "Jl. Trunojoyo No.11, Citarum, Kec. Bandung Wetan, Kota Bandung, Jawa Barat, Indonesia 40115",
  },
  {
    name: "Mayar International Pte. Ltd.",
    address:
      "160 Robinson Road #14-04 Singapore Business Federation Center Singapore 068914",
  },
] as const;

/**
 * Store badges — official assets from mayar.id footer (Google Play / App Store
 * SVGs extracted from Framer data-URLs; Chrome Web Store PNG from framerusercontent).
 */
export const FOOTER_STORES = [
  {
    id: "google-play",
    label: "GET IT ON Google Play",
    href: "https://play.google.com/store/apps/details?id=com.mayarlite&pli=1",
    image: "/specimen/footer/google-play.svg",
    width: 135,
    height: 40,
  },
  {
    id: "app-store",
    label: "Download on the App Store",
    href: "https://apps.apple.com/in/app/mayar-lite/id6759159349",
    image: "/specimen/footer/app-store.svg",
    width: 120,
    height: 40,
  },
  {
    id: "chrome",
    label: "Available in the Chrome Web Store",
    href: "https://chromewebstore.google.com/detail/maodipinhjgkmklcahljendkhepmpfah?utm_source=item-share-cb",
    image: "/specimen/footer/chrome-web-store.png",
    width: 140,
    height: 40,
  },
] as const;

export const FOOTER_SOCIAL = [
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/mayar_id",
  },
  {
    id: "twitter",
    label: "Twitter / X",
    href: "https://twitter.com/mayar_id_",
  },
  {
    id: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/@mayarid",
  },
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/mayarid",
  },
] as const;
