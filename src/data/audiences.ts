export type Audience = {
  id: string;
  /** Scene photo — person in context getting paid */
  image: string;
  /** Fallback amount (locale-independent currency display) */
  amount: string;
};

/**
 * Full Mayar audience set. Text rail + stage scene stay in sync.
 * Labels / product / status / alt come from locale JSON (`audiences.items.*`).
 * Order mirrors product messaging: broad → specific specialties.
 */
export const AUDIENCES: readonly Audience[] = [
  {
    id: "any-business",
    amount: "Rp 8.920.000",
    image: "/specimen/audience/any-business.jpg",
  },
  {
    id: "educators",
    amount: "Rp 2.450.000",
    image: "/specimen/audience/educators.jpg",
  },
  {
    id: "creators",
    amount: "Rp 1.250.000",
    image: "/specimen/audience/creators.jpg",
  },
  {
    id: "social-sellers",
    amount: "Rp 489.000",
    image: "/specimen/audience/social-sellers.jpg",
  },
  {
    id: "freelancers",
    amount: "Rp 3.800.000",
    image: "/specimen/audience/freelancers.jpg",
  },
] as const;

/** Auto-advance interval for profession + image carousel */
export const AUDIENCE_INTERVAL_MS = 2600;
/** Slide scroll duration — long enough to read as a real scroll */
export const AUDIENCE_TRANSITION_MS = 480;
