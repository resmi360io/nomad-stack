import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nomadfees.com";

export const metadata: Metadata = {
  title: {
    default: "Nomad Fees — Compare International Payment Costs",
    template: "%s | Nomad Fees",
  },
  description:
    "Compare the real cost of receiving international payments. Wise, Revolut, Payoneer, PayPal and more — ranked by net amount received after all fees and FX markup.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "Nomad Fees — Compare International Payment Costs",
    description:
      "Compare the real cost of receiving international payments across 7 providers.",
    type: "website",
    siteName: "Nomad Fees",
  },
  twitter: {
    card: "summary",
    title: "Nomad Fees — Compare International Payment Costs",
    description:
      "Compare the real cost of receiving international payments across 7 providers.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
