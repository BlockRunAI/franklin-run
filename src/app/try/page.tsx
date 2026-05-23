import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WalletProvider } from "@/components/try/WalletProvider";
import { FranklinChat } from "@/components/try/FranklinChat";

export const metadata: Metadata = {
  title: "Try Franklin — the AI agent with a wallet, in your browser",
  description:
    "A web preview of Franklin. Connect a browser wallet and chat with frontier AI models, paying per message in USDC via x402. No account, no subscription.",
  alternates: { canonical: "https://franklin.run/try" },
};

export default function TryPage() {
  return (
    <>
      <Header variant="paper" />
      <main className="try-main">
        <WalletProvider>
          <FranklinChat />
        </WalletProvider>
      </main>
      <Footer />
    </>
  );
}
