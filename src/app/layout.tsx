import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tallywise.co"),
  title: {
    default: "Tallywise — Free Online Calculators for Finance, Health, School & Conversions",
    template: "%s | Tallywise",
  },
  description:
    "Free, instant, in-browser calculators for finance, health, academics, everyday utilities, and unit conversions. No signup, no paywalls — just accurate results.",
  openGraph: {
    type: "website",
    siteName: "Tallywise",
    title: "Tallywise — Free Online Calculators for Finance, Health, School & Conversions",
    description:
      "Free, instant, in-browser calculators for finance, health, academics, everyday utilities, and unit conversions. No signup, no paywalls — just accurate results.",
    images: ["/og-default.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tallywise — Free Online Calculators for Finance, Health, School & Conversions",
    description:
      "Free, instant, in-browser calculators for finance, health, academics, everyday utilities, and unit conversions. No signup, no paywalls — just accurate results.",
    images: ["/og-default.png"],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Tallywise",
  url: "https://tallywise.co",
  logo: "https://tallywise.co/og-default.png",
  sameAs: [],
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
      <head>
        {/* Google AdSense Verification Tag (Critical: must be in raw HTML head for crawler detection) */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6227221633366697"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {/* Google Analytics 4 (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-LJ7KGGZLSY"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LJ7KGGZLSY');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}

