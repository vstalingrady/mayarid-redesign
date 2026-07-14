export type Locale = "id" | "en";

export const LOCALES: readonly Locale[] = ["id", "en"] as const;
export const DEFAULT_LOCALE: Locale = "id";
export const LOCALE_STORAGE_KEY = "mayar-locale";

/** Nested dictionary of translation strings / structured copy */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Messages = Record<string, any>;
