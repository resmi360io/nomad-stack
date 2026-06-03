import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { PostHogProvider } from "./providers";
import { Header } from "@/components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://paidacross.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Paid Across — real cost of receiving international payments",
    template: "%s | Paid Across",
  },
  description:
    "Compare the real cost of receiving international payments. Wise, Revolut, Payoneer, PayPal and more — ranked by net amount received after all fees and FX markup.",
  openGraph: {
    title: "Paid Across — real cost of receiving international payments",
    description:
      "Compare Wise, Revolut, Payoneer, PayPal and more on the net amount you actually receive — fees and FX combined.",
    url: SITE_URL,
    type: "website",
    siteName: "Paid Across",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Paid Across" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Paid Across — real cost of receiving international payments",
    description:
      "Compare Wise, Revolut, Payoneer, PayPal and more on the net amount you actually receive.",
  },
  ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } }
    : {}),
};

const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Paid Across",
      url: SITE_URL,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Paid Across",
      publisher: { "@id": `${SITE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/receive/{search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <PostHogProvider>
          <Header />
          {children}
        </PostHogProvider>
        <Analytics />
      </body>
    </html>
  );
}
