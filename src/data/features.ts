/**
 * Feature graph for "Fitur All-in-One Terintegrasi".
 * Nodes + domain clusters + edges (hub + peer links) for an integration map.
 */
export type FeatureIconName =
  | "rocket"
  | "cursorClick"
  | "cube"
  | "chartLine"
  | "link"
  | "currencyDollar"
  | "receipt"
  | "shieldCheck"
  | "chat"
  | "megaphone"
  | "bell"
  | "gitBranch"
  | "gauge"
  | "userCircle"
  | "percent"
  | "envelope"
  | "brackets"
  | "table";

export type FeatureDomain =
  | "sell"
  | "pay"
  | "run"
  | "grow"
  | "platform";

export type FeatureNode = {
  id: string;
  label: string;
  short: string;
  icon: FeatureIconName;
  domain: FeatureDomain;
  /** 0 = inner orbit, 1 = outer orbit */
  ring: 0 | 1;
};

export const FEATURES_COPY = {
  eyebrow: "Otomatisasi bisnis dengan teknologi",
  title: "Fitur All-in-One Terintegrasi",
  subtitle:
    "Mulai dari buat halaman web, landing page, checkout, terima pembayaran digital, kirim invoice, kelola order, buat kampanye marketing hingga manajemen pelanggan",
  hubLabel: "Mayar",
  hubHint: "Satu platform · semua alur",
} as const;

export const DOMAIN_LABELS: Record<FeatureDomain, string> = {
  sell: "Jual",
  pay: "Bayar",
  run: "Operasi",
  grow: "Tumbuh",
  platform: "Platform",
};

export const DOMAIN_COLORS: Record<FeatureDomain, string> = {
  sell: "#2563eb",
  pay: "#0d9488",
  run: "#7c3aed",
  grow: "#db2777",
  platform: "#475569",
};

/** All productized capabilities as graph nodes. */
export const FEATURE_NODES: FeatureNode[] = [
  // Inner ring — core commerce loop
  {
    id: "landing-page",
    label: "Landing Page",
    short: "Landing",
    icon: "rocket",
    domain: "sell",
    ring: 0,
  },
  {
    id: "one-click-checkout",
    label: "1-Click Checkout",
    short: "Checkout",
    icon: "cursorClick",
    domain: "pay",
    ring: 0,
  },
  {
    id: "online-payments",
    label: "Online Payments",
    short: "Payments",
    icon: "currencyDollar",
    domain: "pay",
    ring: 0,
  },
  {
    id: "order-management",
    label: "Order Management",
    short: "Orders",
    icon: "cube",
    domain: "run",
    ring: 0,
  },
  {
    id: "analytics",
    label: "Analytics",
    short: "Analytics",
    icon: "chartLine",
    domain: "run",
    ring: 0,
  },
  {
    id: "customer-portal",
    label: "Customer Portal",
    short: "Portal",
    icon: "userCircle",
    domain: "run",
    ring: 0,
  },
  // Outer ring — extended platform
  {
    id: "payment-link",
    label: "Payment Link",
    short: "Pay Link",
    icon: "link",
    domain: "pay",
    ring: 1,
  },
  {
    id: "billing-system",
    label: "Billing System",
    short: "Billing",
    icon: "receipt",
    domain: "pay",
    ring: 1,
  },
  {
    id: "discount-code",
    label: "Discount Code",
    short: "Discount",
    icon: "percent",
    domain: "sell",
    ring: 1,
  },
  {
    id: "payment-reminder",
    label: "Payment Reminder",
    short: "Reminder",
    icon: "envelope",
    domain: "pay",
    ring: 1,
  },
  {
    id: "marketing-tools",
    label: "Marketing Tools",
    short: "Marketing",
    icon: "megaphone",
    domain: "grow",
    ring: 1,
  },
  {
    id: "notification",
    label: "Notification",
    short: "Notify",
    icon: "bell",
    domain: "grow",
    ring: 1,
  },
  {
    id: "wa-telegram",
    label: "WA & Telegram",
    short: "Chat",
    icon: "chat",
    domain: "grow",
    ring: 1,
  },
  {
    id: "finance-tools",
    label: "Finance Tools",
    short: "Finance",
    icon: "gauge",
    domain: "run",
    ring: 1,
  },
  {
    id: "webhooks",
    label: "Webhooks",
    short: "Hooks",
    icon: "gitBranch",
    domain: "platform",
    ring: 1,
  },
  {
    id: "api-mcp",
    label: "API & MCP",
    short: "API",
    icon: "brackets",
    domain: "platform",
    ring: 1,
  },
  {
    id: "google-sheet",
    label: "Google Sheets",
    short: "Sheets",
    icon: "table",
    domain: "platform",
    ring: 1,
  },
  {
    id: "iso-soc2",
    label: "ISO 27001 & SOC2",
    short: "Security",
    icon: "shieldCheck",
    domain: "platform",
    ring: 1,
  },
];

/** Peer edges — real product relationships (not just hub spokes). */
export const FEATURE_EDGES: [string, string][] = [
  ["landing-page", "one-click-checkout"],
  ["landing-page", "payment-link"],
  ["one-click-checkout", "online-payments"],
  ["payment-link", "online-payments"],
  ["online-payments", "order-management"],
  ["online-payments", "billing-system"],
  ["order-management", "customer-portal"],
  ["order-management", "notification"],
  ["billing-system", "payment-reminder"],
  ["billing-system", "finance-tools"],
  ["discount-code", "one-click-checkout"],
  ["marketing-tools", "landing-page"],
  ["wa-telegram", "notification"],
  ["wa-telegram", "payment-reminder"],
  ["analytics", "order-management"],
  ["analytics", "finance-tools"],
  ["webhooks", "api-mcp"],
  ["api-mcp", "google-sheet"],
  ["iso-soc2", "online-payments"],
  ["customer-portal", "notification"],
];

export const FEATURE_CHIPS = FEATURE_NODES;
export const FEATURE_ROWS = [FEATURE_NODES];
