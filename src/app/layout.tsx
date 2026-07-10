import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Mayar AI Landing Page Builder — Speculative Case Study",
  description:
    "Speculative Design Engineer (AI) case study for Mayar's AI Landing Page Builder. Built with Grok Build; visual direction referenced from Reve AI. Unaffiliated portfolio work.",
  openGraph: {
    title: "Mayar AI Landing Page Builder — Speculative Case Study",
    description:
      "Design Engineer (AI) speculative sprint: generate → edit → publish-ready landing pages for creators & UMKM.",
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
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
