import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Instrument_Serif, Noto_Serif_SC } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
});

const notoSerifSC = Noto_Serif_SC({
  variable: "--font-serif-sc",
  weight: ["400", "700"],
});

const SITE_URL = "https://franklin.run";

export const metadata: Metadata = {
  title: "Franklin — The AI Agent with a Wallet",
  description:
    "The first autonomous economic agent. 55+ AI models, one USDC wallet, pay per action. No subscriptions, no API keys. Open source.",
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  keywords: [
    "AI agent",
    "autonomous agent",
    "USDC",
    "micropayments",
    "x402",
    "LLM",
    "coding agent",
    "BlockRun",
    "Franklin",
    "Base",
    "Solana",
    "open source",
  ],
  authors: [{ name: "BlockRun", url: "https://blockrun.ai" }],
  creator: "BlockRun",
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Franklin — The AI Agent with a Wallet",
    description:
      "55+ AI models, one USDC wallet, pay per action. No subscriptions, no API keys, no limits. Open source.",
    siteName: "Franklin",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Franklin — The AI agent with a wallet",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@BlockRunAI",
    creator: "@BlockRunAI",
    title: "Franklin — The AI Agent with a Wallet",
    description:
      "55+ AI models, one USDC wallet, pay per action. Open source autonomous economic agent.",
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
    ],
    shortcut: "/favicon.png",
    apple: "/apple-touch-icon.png",
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
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} ${notoSerifSC.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Franklin",
              description: "The AI agent with a wallet. 55+ models, USDC micropayments, open source.",
              url: SITE_URL,
              applicationCategory: "DeveloperApplication",
              operatingSystem: "macOS, Linux, Windows (WSL)",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              author: { "@type": "Organization", name: "BlockRun", url: "https://blockrun.ai" },
            }),
          }}
        />
      </head>
      <body className="h-full overflow-y-auto">{children}</body>
    </html>
  );
}
