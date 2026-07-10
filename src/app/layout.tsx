import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const SITE_TITLE = "Tallywise - Private Browser Tools for Calculators & PDFs";
const SITE_DESC =
  "Free, private browser tools for calculations and documents: finance, health, school, conversion, and a full PDF studio for merge, split, compress, convert, OCR, edit, and sign.";

export const metadata: Metadata = {
  metadataBase: new URL("https://tallywise.co"),
  title: {
    default: SITE_TITLE,
    template: "%s | Tallywise",
  },
  description: SITE_DESC,
  openGraph: {
    type: "website",
    siteName: "Tallywise",
    title: SITE_TITLE,
    description: SITE_DESC,
    images: ["/og-default.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESC,
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
      className={`${jakarta.variable} ${fraunces.variable} ${jetbrainsMono.variable} h-full antialiased`}
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

