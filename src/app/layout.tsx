import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { I18nProvider } from "@/components/I18nProvider";
import "./globals.css";
import "./motion.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mayar Homepage Recreation (Portfolio) — Unofficial",
  description:
    "Unofficial portfolio recreation of mayar.id. Not affiliated with Mayar / PT Mayar Kernel Supernova. For demonstration only.",
  icons: {
    icon: [
      { url: "/favicon.png?v=3", type: "image/png", sizes: "48x48" },
      { url: "/favicon-32.png?v=3", type: "image/png", sizes: "32x32" },
      { url: "/icon-192.png?v=3", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/apple-touch-icon.png?v=3", sizes: "180x180" }],
  },
  openGraph: {
    title: "Mayar Homepage Recreation (Portfolio) — Unofficial",
    description:
      "Unofficial portfolio recreation of mayar.id. Not affiliated with Mayar. Demo only.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-[100dvh] bg-bg text-ink font-sans">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
