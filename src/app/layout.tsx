import type { Metadata } from "next";
import Script from "next/script";
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
    "The AI agent with a wallet. It holds your USDC and spends it for you — 55+ models, trading data, image generation, video generation, web search. One wallet, no API keys. Open source.",
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  keywords: [
    "AI agent",
    "economic agent",
    "autonomous agent",
    "payment rail for AI",
    "USDC",
    "micropayments",
    "x402",
    "x402 protocol",
    "LLM",
    "smart router",
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
      "Other agents write code. Franklin writes code and spends money to get things done. 55+ models, trading data, image gen, web search — one USDC wallet. Open source.",
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
      "The AI agent with a wallet. 55+ models, trading data, image gen — it holds your USDC and spends it for you. Open source.",
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
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} ${notoSerifSC.variable} antialiased`}
    >
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-CDWTPW4YRM"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-CDWTPW4YRM');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Franklin",
              description: "The AI agent with a wallet. Holds USDC, picks models, buys data, and spends autonomously via x402. Open source.",
              url: SITE_URL,
              applicationCategory: "DeveloperApplication",
              operatingSystem: "macOS, Linux, Windows (WSL)",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              author: { "@type": "Organization", name: "BlockRun", url: "https://blockrun.ai" },
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
