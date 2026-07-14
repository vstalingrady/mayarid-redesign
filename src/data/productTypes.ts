export type ProductFamily =
  | "payment"
  | "physical"
  | "digital"
  | "live"
  | "fundraise"
  | "saas"
  | "content";

/** One unique Phosphor glyph per product — no shared silhouettes. */
export type ProductIconName =
  | "link"
  | "tshirt"
  | "package"
  | "key"
  | "graduation"
  | "usersThree"
  | "video"
  | "calendar"
  | "heart"
  | "book"
  | "mic"
  | "headphones"
  | "file"
  | "comic"
  | "crown"
  | "appWindow"
  | "coins"
  | "chalkboard";

export type ProductType = {
  id: string;
  label: string;
  href: string;
  icon: ProductIconName;
  family: ProductFamily;
  /** Original mayar.id brick color band */
  originalBand: "blue" | "navy" | "pink";
};

export const FAMILY_LABELS: Record<ProductFamily, string> = {
  payment: "Pembayaran",
  physical: "Fisik",
  digital: "Digital",
  live: "Live & Belajar",
  content: "Konten",
  saas: "SaaS & Membership",
  fundraise: "Galang Dana",
};

/** All sellable product types shown on mayar.id product grid (icons resolved client-side) */
export const PRODUCT_TYPES: ProductType[] = [
  {
    id: "link-pembayaran",
    label: "Link Pembayaran",
    href: "#",
    icon: "link",
    family: "payment",
    originalBand: "blue",
  },
  {
    id: "produk-fisik",
    label: "Produk Fisik",
    href: "#",
    icon: "tshirt",
    family: "physical",
    originalBand: "blue",
  },
  {
    id: "produk-digital",
    label: "Produk Digital",
    href: "#",
    icon: "package",
    family: "digital",
    originalBand: "blue",
  },
  {
    id: "kelas-online",
    label: "Kelas Online",
    href: "#",
    icon: "graduation",
    family: "live",
    originalBand: "navy",
  },
  {
    id: "kelas-cohort",
    label: "Kelas Cohort / Bootcamp",
    href: "#",
    icon: "usersThree",
    family: "live",
    originalBand: "navy",
  },
  {
    id: "webinar",
    label: "Webinar",
    href: "#",
    icon: "video",
    family: "live",
    originalBand: "navy",
  },
  {
    id: "event-acara",
    label: "Event & Acara",
    href: "#",
    icon: "calendar",
    family: "live",
    originalBand: "pink",
  },
  {
    id: "penggalangan-dana",
    label: "Penggalangan Dana",
    href: "#",
    icon: "heart",
    family: "fundraise",
    originalBand: "pink",
  },
  {
    id: "e-book",
    label: "E-Book",
    href: "#",
    icon: "book",
    family: "content",
    originalBand: "pink",
  },
  {
    id: "podcast",
    label: "Podcast",
    href: "#",
    icon: "mic",
    family: "content",
    originalBand: "navy",
  },
  {
    id: "audio-book",
    label: "Audio Book",
    href: "#",
    icon: "headphones",
    family: "content",
    originalBand: "navy",
  },
  {
    id: "tulisan",
    label: "Tulisan",
    href: "#",
    icon: "file",
    family: "content",
    originalBand: "navy",
  },
  {
    id: "web-komik",
    label: "Web Komik",
    href: "#",
    icon: "comic",
    family: "content",
    originalBand: "blue",
  },
  {
    id: "membership",
    label: "Membership",
    href: "#",
    icon: "crown",
    family: "saas",
    originalBand: "blue",
  },
  {
    id: "saas",
    label: "SaaS",
    href: "#",
    icon: "appWindow",
    family: "saas",
    originalBand: "blue",
  },
  {
    id: "lisensi-software",
    label: "Lisensi Software",
    href: "#",
    icon: "key",
    family: "digital",
    originalBand: "pink",
  },
  {
    id: "produk-credit",
    label: "Produk Berbasis Credit",
    href: "#",
    icon: "coins",
    family: "saas",
    originalBand: "pink",
  },
  {
    id: "coaching",
    label: "Coaching & Mentoring",
    href: "#",
    icon: "chalkboard",
    family: "live",
    originalBand: "navy",
  },
];

export const FAMILY_ORDER: ProductFamily[] = [
  "payment",
  "physical",
  "digital",
  "live",
  "content",
  "saas",
  "fundraise",
];

/** Fallback family lifestyle shots (legacy / directions). Prefer PRODUCT_IMAGES. */
export const FAMILY_IMAGES: Record<ProductFamily, string> = {
  payment: "/specimen/products/payment.jpg",
  physical: "/specimen/products/physical.jpg",
  digital: "/specimen/products/digital.jpg",
  live: "/specimen/products/live.jpg",
  content: "/specimen/products/content.jpg",
  saas: "/specimen/products/saas.jpg",
  fundraise: "/specimen/products/fundraise.jpg",
};

export const FAMILY_IMAGE_ALT: Record<ProductFamily, string> = {
  payment: "Suasana terima pembayaran lewat ponsel",
  physical: "Paket produk fisik siap dikirim",
  digital: "Laptop dan produk digital di meja kerja",
  live: "Setup kelas online dan webinar",
  content: "Mikrofon podcast dan buku di meja konten",
  saas: "Meja kerja membership dan SaaS",
  fundraise: "Momen galang dana komunitas",
};

/**
 * Real stock photos (Unsplash License) — one unique image per product.
 * Stored under public/specimen/products/items/{id}.jpg
 */
export const PRODUCT_IMAGES: Record<string, string> = {
  "link-pembayaran": "/specimen/products/items/link-pembayaran.jpg",
  "produk-fisik": "/specimen/products/items/produk-fisik.jpg",
  "produk-digital": "/specimen/products/items/produk-digital.jpg",
  "lisensi-software": "/specimen/products/items/lisensi-software.jpg",
  "kelas-online": "/specimen/products/items/kelas-online.jpg",
  "kelas-cohort": "/specimen/products/items/kelas-cohort.jpg",
  webinar: "/specimen/products/items/webinar.jpg",
  "event-acara": "/specimen/products/items/event-acara.jpg",
  coaching: "/specimen/products/items/coaching.jpg",
  "e-book": "/specimen/products/items/e-book.jpg",
  podcast: "/specimen/products/items/podcast.jpg",
  "audio-book": "/specimen/products/items/audio-book.jpg",
  tulisan: "/specimen/products/items/tulisan.jpg",
  "web-komik": "/specimen/products/items/web-komik.jpg",
  membership: "/specimen/products/items/membership.jpg",
  saas: "/specimen/products/items/saas.jpg",
  "produk-credit": "/specimen/products/items/produk-credit.jpg",
  "penggalangan-dana": "/specimen/products/items/penggalangan-dana.jpg",
};

export const PRODUCT_IMAGE_ALT: Record<string, string> = {
  "link-pembayaran": "Pembayaran digital lewat kartu dan ponsel",
  "produk-fisik": "Paket produk fisik siap dikirim",
  "produk-digital": "Laptop di meja kerja produk digital",
  "lisensi-software": "Layar kode dan lisensi software",
  "kelas-online": "Ruang kelas dan pembelajaran online",
  "kelas-cohort": "Kelompok belajar cohort di meja bersama",
  webinar: "Webinar video conference di laptop",
  "event-acara": "Panggung event dan audiens",
  coaching: "Sesi coaching dan mentoring one-on-one",
  "e-book": "Tumpukan buku dan bacaan digital",
  podcast: "Mikrofon studio podcast",
  "audio-book": "Headphone untuk audio book",
  tulisan: "Menulis artikel di mesin ketik dan kertas",
  "web-komik": "Ilustrasi dan komik digital",
  membership: "Tim membership dalam rapat kolaborasi",
  saas: "Dashboard analytics SaaS di laptop",
  "produk-credit": "Koin dan kredit digital",
  "penggalangan-dana": "Galang dana dan donasi komunitas",
};

/** Resolve product image; falls back to family image if missing. */
export function getProductImage(product: ProductType): {
  src: string;
  alt: string;
} {
  const src =
    PRODUCT_IMAGES[product.id] ?? FAMILY_IMAGES[product.family];
  const alt =
    PRODUCT_IMAGE_ALT[product.id] ??
    FAMILY_IMAGE_ALT[product.family] ??
    product.label;
  return { src, alt };
}

export const SECTION_COPY = {
  eyebrow: "Sell anything, anywhere, to anyone",
  title: "Jual Produk & Jasa Apapun dengan Mudah",
  subtitle:
    "Sistem yang sudah disesuaikan dan otomatis untuk menjual berbagai macam produk dan jasa di internet dengan mudah dan cepat.",
} as const;

/** Flatten products in FAMILY_ORDER for list + autoplay sequence. */
export function productsInFamilyOrder(): ProductType[] {
  return FAMILY_ORDER.flatMap((family) =>
    PRODUCT_TYPES.filter((p) => p.family === family),
  );
}

export function getProductById(id: string): ProductType | undefined {
  return PRODUCT_TYPES.find((p) => p.id === id);
}

export function nextProductId(currentId: string): string {
  const list = productsInFamilyOrder();
  if (list.length === 0) return currentId;
  const idx = list.findIndex((p) => p.id === currentId);
  const next = list[(idx + 1) % list.length];
  return next?.id ?? list[0]!.id;
}
