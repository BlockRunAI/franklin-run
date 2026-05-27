import type { Metadata } from "next";
import { HomePage } from "@/components/HomePage";
import { getHomeDict } from "@/lib/home";
import { LOCALES, LOCALE_META, homeUrl } from "@/lib/locales";

const SITE_URL = "https://franklin.run";

// English marketing homepage (formerly at /). The chat app now lives at /.
// Linked into the same hreflang cluster as the per-locale homepages.
const languages: Record<string, string> = {};
for (const l of LOCALES) {
  languages[LOCALE_META[l].htmlLang] = `${SITE_URL}${homeUrl(l)}`;
}
languages["x-default"] = `${SITE_URL}${homeUrl("en")}`;

export const metadata: Metadata = {
  title: "Franklin Agent — the AI agent with a wallet",
  description:
    "Franklin is an autonomous AI agent with a crypto wallet. It holds USDC and spends it on the AI and tools it needs — pay-per-call via x402, no subscription.",
  alternates: {
    canonical: `${SITE_URL}${homeUrl("en")}`,
    languages,
  },
};

export default function About() {
  return <HomePage dict={getHomeDict("en")} locale="en" />;
}
