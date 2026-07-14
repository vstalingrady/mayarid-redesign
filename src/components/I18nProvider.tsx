"use client";

import { LanguageProvider } from "@/i18n";
import type { ReactNode } from "react";

/** Client boundary so the server layout can wrap the tree with i18n. */
export function I18nProvider({ children }: { children: ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
