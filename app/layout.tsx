import type { Metadata } from "next";
import { DM_Sans, Outfit } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "VMK Tennis Academy | Build Champions On & Off the Court",
    template: "%s | VMK Tennis Academy",
  },
  description:
    "Professional tennis coaching for kids, juniors & adults at VMK Tennis Academy. Book a free trial class today.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000")
  ),
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "VMK Tennis Academy",
    title: "VMK Tennis Academy",
    description:
      "Professional tennis coaching for kids, juniors & adults. Book a free trial class.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(dmSans.variable, outfit.variable)}>
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
