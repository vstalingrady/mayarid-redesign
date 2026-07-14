/**
 * Partner logos for the integrations hub.
 * Files live in /public/specimen/integrations (fetched from Simple Icons + brand domains).
 */

export type IntegrationLogo = {
  id: string;
  label: string;
  src: string;
  /**
   * icon  — square mark (default)
   * wide  — horizontal wordmark, needs extra horizontal room
   */
  fit?: "icon" | "wide";
};

export type IntegrationClusterId = "payments" | "logistics" | "apps";

export type IntegrationCluster = {
  id: IntegrationClusterId;
  /** UI copy comes from locale JSON (`integrations.clusters.{id}`) */
  logos: IntegrationLogo[];
};

const base = "/specimen/integrations";

export const PAYMENT_LOGOS: IntegrationLogo[] = [
  { id: "visa", label: "Visa", src: `${base}/visa.svg`, fit: "wide" },
  { id: "mastercard", label: "Mastercard", src: `${base}/mastercard.svg`, fit: "wide" },
  { id: "jcb", label: "JCB", src: `${base}/jcb.svg`, fit: "wide" },
  { id: "amex", label: "American Express", src: `${base}/amex.svg`, fit: "wide" },
  { id: "bca", label: "BCA", src: `${base}/bca.png`, fit: "wide" },
  { id: "bni", label: "BNI", src: `${base}/bni.png`, fit: "wide" },
  { id: "mandiri", label: "Mandiri", src: `${base}/mandiri.png`, fit: "wide" },
  { id: "bri", label: "BRI", src: `${base}/bri.png`, fit: "wide" },
  { id: "dana", label: "DANA", src: `${base}/dana.png` },
  { id: "ovo", label: "OVO", src: `${base}/ovo.png` },
  { id: "gopay", label: "GoPay", src: `${base}/gopay.png`, fit: "wide" },
  { id: "shopeepay", label: "ShopeePay", src: `${base}/shopeepay.png`, fit: "wide" },
  { id: "jenius", label: "Jenius", src: `${base}/jenius.png`, fit: "wide" },
];

export const LOGISTICS_LOGOS: IntegrationLogo[] = [
  { id: "jne", label: "JNE", src: `${base}/jne.png`, fit: "wide" },
  { id: "sicepat", label: "SiCepat", src: `${base}/sicepat.png`, fit: "wide" },
  { id: "tiki", label: "TIKI", src: `${base}/tiki.png`, fit: "wide" },
  { id: "anteraja", label: "Anteraja", src: `${base}/anteraja.png`, fit: "wide" },
];

export const APP_LOGOS: IntegrationLogo[] = [
  { id: "gmail", label: "Gmail", src: `${base}/gmail.svg` },
  { id: "slack", label: "Slack", src: `${base}/slack.svg` },
  { id: "microsoft-teams", label: "Microsoft Teams", src: `${base}/microsoft-teams.svg` },
  { id: "google-drive", label: "Google Drive", src: `${base}/google-drive.svg` },
  { id: "dropbox", label: "Dropbox", src: `${base}/dropbox.svg` },
  { id: "whatsapp", label: "WhatsApp", src: `${base}/whatsapp.svg` },
  { id: "telegram", label: "Telegram", src: `${base}/telegram.svg` },
  { id: "notion", label: "Notion", src: `${base}/notion.svg` },
  { id: "airtable", label: "Airtable", src: `${base}/airtable.svg`, fit: "wide" },
  { id: "shopify", label: "Shopify", src: `${base}/shopify.svg`, fit: "wide" },
];

export const INTEGRATION_CLUSTERS: IntegrationCluster[] = [
  { id: "payments", logos: PAYMENT_LOGOS },
  { id: "logistics", logos: LOGISTICS_LOGOS },
  { id: "apps", logos: APP_LOGOS },
];
