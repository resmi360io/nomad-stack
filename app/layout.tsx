import type { Metadata } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { PostHogProvider } from "./providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

// One variable family for words and figures: one file for every weight, self-hosted by next/font
// with a size-adjusted fallback so layout holds still while it loads.
const textFont = Schibsted_Grotesk({
  variable: "--font-text",
  subsets: ["latin"],
  display: "swap",
});


const SITE_URL = "https://paidacross.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  title: {
    default: "Paid Across: real cost of receiving international payments",
    template: "%s | Paid Across",
  },
  description:
    "Compare the real cost of receiving international payments. Wise, Revolut, Payoneer, PayPal and more, ranked by net amount received after all fees and FX markup.",
  openGraph: {
    title: "Paid Across: real cost of receiving international payments",
    description:
      "Compare Wise, Revolut, Payoneer, PayPal and more on the net amount you actually receive, fees and FX combined.",
    url: SITE_URL,
    type: "website",
    siteName: "Paid Across",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Paid Across" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Paid Across: real cost of receiving international payments",
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
      className={`${textFont.variable} h-full antialiased`}
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
          <Footer />
        </PostHogProvider>
        <Analytics />
      </body>
    </html>
  );
}
