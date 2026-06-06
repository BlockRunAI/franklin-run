import type { Metadata } from "next";
import { WalletProvider } from "@/components/try/WalletProvider";
import { FranklinChat } from "@/components/try/FranklinChat";
import { TryLangProvider } from "@/lib/try-i18n";

export const metadata: Metadata = {
  title: "Franklin — the AI agent with a wallet",
  description:
    "Chat with frontier AI models, generate images and video, and let Franklin use tools — paid per request in USDC via x402. No subscription. Your wallet is your account.",
  alternates: { canonical: "https://franklin.run/chat" },
};

// The chat app (Gemini-style). Soft login — usable without signing in;
// sign in (sidebar) to save history across devices. Marketing lives at /.
export default function Chat() {
  return (
    <main className="try-main try-main-full">
      <WalletProvider>
        <TryLangProvider>
          <FranklinChat />
        </TryLangProvider>
      </WalletProvider>
    </main>
  );
}
