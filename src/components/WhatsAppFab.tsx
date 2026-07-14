"use client";

import { WhatsappLogo } from "@phosphor-icons/react";
import { useI18n } from "@/i18n";

/**
 * Always-on floating WhatsApp contact — fixed bottom-right, above chrome.
 * Opens wa.me chat with the sales number (prefilled empty text for user typing).
 */
const WA_HREF =
  "https://api.whatsapp.com/send?phone=6282115253917&text=";

export function WhatsAppFab() {
  const { t } = useI18n();

  return (
    <a
      href={WA_HREF}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("whatsapp.aria")}
      className="fixed bottom-5 right-4 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_14px_-4px_rgb(0_0_0/0.28)] outline-none transition-[transform,background-color] duration-200 ease-[var(--ease)] hover:bg-[#20bd5a] focus-visible:ring-2 focus-visible:ring-[#25D366]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg active:scale-[0.96] sm:bottom-6 sm:right-6 sm:h-[3.75rem] sm:w-[3.75rem]"
    >
      <WhatsappLogo
        weight="fill"
        className="h-7 w-7 sm:h-8 sm:w-8"
        aria-hidden
      />
    </a>
  );
}
