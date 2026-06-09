import { en as defaultDict } from "@/lib/home/en";
import type { HomeDict } from "@/lib/home/types";

interface TrustBarProps {
  dict?: HomeDict;
}

export function TrustBar({ dict = defaultDict }: TrustBarProps) {
  const t = dict.trustBar;

  return (
    <div className="trust-bar">
      <p>
        {t.builtOn} <strong>USDC</strong> · <strong>Base</strong> ·{" "}
        <strong>Solana</strong> · <strong>x402</strong> · {t.routesPrefix}{" "}
        <strong>{t.routesModels}</strong> {t.providersPrefix} Anthropic,
        OpenAI, Google, DeepSeek, Moonshot and Z.AI.
      </p>
    </div>
  );
}
