import type { Metadata } from "next";
import Script from "next/script";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { Instrument_Serif, Noto_Serif_SC } from "next/font/google";
import "./globals.css";
import { cdnUrl } from "@/lib/cdn";
import { LOCALES, LOCALE_META } from "@/lib/blog";
import { homeUrl } from "@/lib/home";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
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

const homeLanguages: Record<string, string> = {};
for (const l of LOCALES) {
  homeLanguages[LOCALE_META[l].htmlLang] = `${SITE_URL}${homeUrl(l)}`;
}
homeLanguages["x-default"] = `${SITE_URL}/`;

export const metadata: Metadata = {
  title: "Franklin Agent — The AI agent with a wallet",
  description:
    "Franklin Agent writes code and spends money to get things done. Open-source. Runs anywhere. Pays per call via USDC and x402 — 55+ models, trading data, image gen, web search. One wallet, no API keys.",
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/", languages: homeLanguages },
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
    title: "Franklin Agent — The AI agent with a wallet",
    description:
      "Other agents write code. Franklin Agent writes code and spends money to get things done. 55+ models, trading data, image gen, web search — one USDC wallet. Open source.",
    siteName: "Franklin Agent",
    images: [
      {
        url: cdnUrl("/images/og-image.png"),
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
    title: "Franklin Agent — The AI agent with a wallet",
    description:
      "The AI agent with a wallet. 55+ models, trading data, image gen — it holds your USDC and spends it for you. Open source.",
    images: [cdnUrl("/images/og-image.png")],
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
    icon: [{ url: cdnUrl("/franklin-icon.png"), type: "image/png", sizes: "256x256" }],
    shortcut: cdnUrl("/franklin-icon.png"),
    apple: cdnUrl("/franklin-icon.png"),
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
      suppressHydrationWarning
      className={`${plexSans.variable} ${plexMono.variable} ${instrumentSerif.variable} ${notoSerifSC.variable} antialiased`}
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
              alternateName: "@blockrun/franklin",
              description:
                "Open-source AI agent with a USDC wallet. Routes across 55+ frontier models (Claude, GPT, Gemini, Grok, DeepSeek, Kimi) and pays per call via the x402 micropayment protocol. No subscriptions, no API keys.",
              url: SITE_URL,
              applicationCategory: "DeveloperApplication",
              applicationSubCategory: "AI Agent",
              operatingSystem: "macOS, Linux, Windows (WSL)",
              softwareVersion: "3.8.x",
              license: "https://www.apache.org/licenses/LICENSE-2.0",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              downloadUrl: "https://www.npmjs.com/package/@blockrun/franklin",
              codeRepository: "https://github.com/blockrunai/franklin",
              programmingLanguage: "TypeScript",
              author: {
                "@type": "Organization",
                name: "BlockRun",
                url: "https://blockrun.ai",
                sameAs: [
                  "https://github.com/blockrunai",
                  "https://x.com/BlockRunAI",
                  "https://t.me/blockrunAI",
                  "https://www.npmjs.com/org/blockrun",
                ],
              },
              keywords:
                "AI agent, autonomous agent, USDC, x402, micropayments, multi-model, smart router, YOPO, pay per outcome, open source, BlockRun, economic agent",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": `${SITE_URL}/#organization`,
              name: "BlockRun",
              alternateName: "BlockRun.ai",
              url: "https://blockrun.ai",
              logo: cdnUrl("/favicon.png").startsWith("http")
                ? cdnUrl("/favicon.png")
                : `${SITE_URL}${cdnUrl("/favicon.png")}`,
              description:
                "BlockRun builds Franklin (the AI agent with a wallet) and ClawRouter (the gateway and payments layer). Crypto-native infrastructure for the economic-agent era.",
              sameAs: [
                "https://github.com/blockrunai",
                "https://x.com/BlockRunAI",
                "https://t.me/blockrunAI",
                "https://www.npmjs.com/org/blockrun",
                "https://franklin.run",
              ],
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
