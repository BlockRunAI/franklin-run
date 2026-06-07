import type { Metadata } from "next";
import { WalletProvider } from "@/components/try/WalletProvider";
import { FranklinChat, type ChatPrefill } from "@/components/try/FranklinChat";
import { TryLangProvider } from "@/lib/try-i18n";
import { getShowcaseItem, showcaseModelId } from "@/lib/showcase-gallery";

export const metadata: Metadata = {
  title: "Franklin — the AI agent with a wallet",
  description:
    "Chat with frontier AI models, generate images and video, and let Franklin use tools — paid per request in USDC via x402. No subscription. Your wallet is your account.",
  alternates: { canonical: "https://franklin.run/chat" },
};

// The chat app (Gemini-style). Soft login — usable without signing in;
// sign in (sidebar) to save history across devices. Marketing lives at /.
//
// `?from=<showcase id>` (the public /gallery "Make your own" CTA) loads that
// example's prompt + mode + model straight into the composer.
export default async function Chat({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  const item = from ? getShowcaseItem(from) : undefined;
  const initial: ChatPrefill | undefined = item?.prompt
    ? {
        input: item.prompt,
        mode: item.type === "video" ? "video" : "image",
        ...(item.type === "video"
          ? { videoModel: showcaseModelId(item) }
          : { imageModel: showcaseModelId(item) }),
      }
    : undefined;

  return (
    <main className="try-main try-main-full">
      <WalletProvider>
        <TryLangProvider>
          <FranklinChat initial={initial} />
        </TryLangProvider>
      </WalletProvider>
    </main>
  );
}
