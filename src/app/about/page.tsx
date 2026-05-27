import type { Metadata } from "next";
import { HomePage } from "@/components/HomePage";
import { getHomeDict } from "@/lib/home";

export const metadata: Metadata = {
  title: "Franklin Agent — the AI agent with a wallet",
  description:
    "Franklin is an autonomous AI agent with a crypto wallet. It holds USDC and spends it on the AI and tools it needs — pay-per-call via x402, no subscription.",
  alternates: { canonical: "https://franklin.run/about" },
};

// The marketing landing page (formerly at /). The chat app now lives at /.
export default function About() {
  return <HomePage dict={getHomeDict("en")} locale="en" />;
}
