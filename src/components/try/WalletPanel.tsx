"use client";

import { Wallet, ArrowDownToLine } from "lucide-react";
import type { Usage } from "@/hooks/use-usage-stats";
import { useUsdcBalance } from "@/hooks/use-usdc-balance";
import { useTryLang } from "@/lib/try-i18n";

function fmtUsd(n: number): string {
  if (n === 0) return "$0.00";
  if (n < 0.01) return `$${n.toFixed(4)}`;
  return `$${n.toFixed(2)}`;
}
function shortModel(id: string): string {
  return id.includes("/") ? id.split("/")[1] : id;
}

// Wallet & receipts (Franklin's differentiator): USDC balance + everything
// spent, per model/tool, with a per-request x402 receipt log.
export function WalletPanel({ usage }: { usage: Usage }) {
  const { t } = useTryLang();
  const { balance } = useUsdcBalance();
  const byModel = Object.entries(usage.byModel).sort((a, b) => b[1].usd - a[1].usd);
  const maxUsd = byModel[0]?.[1].usd || 1;

  return (
    <div className="try-wallet-panel">
      <div className="try-wallet-inner">
        <h2 className="try-tools-h">{t.walletTitle}</h2>

        <div className="try-wallet-stats">
          <div className="try-wallet-stat">
            <div className="try-wallet-stat-label">{t.balance}</div>
            <div className="try-wallet-stat-val gold">
              {balance !== undefined ? fmtUsd(balance) : "—"}
            </div>
          </div>
          <div className="try-wallet-stat">
            <div className="try-wallet-stat-label">{t.spent}</div>
            <div className="try-wallet-stat-val">{fmtUsd(usage.totalUsd)}</div>
            <div className="try-wallet-stat-sub">{t.requests(usage.requests)}</div>
          </div>
        </div>

        <p className="try-wallet-topup">
          <ArrowDownToLine className="h-3.5 w-3.5" />
          {t.topUp}
        </p>

        {byModel.length > 0 && (
          <div className="try-wallet-section">
            <div className="try-tools-group-label">{t.costByModel}</div>
            {byModel.map(([model, m]) => (
              <div key={model} className="try-wallet-bar-row">
                <span className="try-wallet-bar-name">{shortModel(model)}</span>
                <span className="try-wallet-bar-track">
                  <span className="try-wallet-bar-fill" style={{ width: `${Math.max(4, (m.usd / maxUsd) * 100)}%` }} />
                </span>
                <span className="try-wallet-bar-val">{fmtUsd(m.usd)}</span>
              </div>
            ))}
          </div>
        )}

        {usage.receipts.length > 0 && (
          <div className="try-wallet-section">
            <div className="try-tools-group-label">{t.receipts}</div>
            <div className="try-wallet-receipts">
              {usage.receipts.map((r, i) => (
                <div key={i} className="try-wallet-receipt">
                  <span className="try-wallet-receipt-model">{shortModel(r.model)}</span>
                  <span className="try-wallet-receipt-time">{new Date(r.ts).toLocaleString()}</span>
                  <span className="try-wallet-receipt-usd">{fmtUsd(r.usd)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {usage.requests === 0 && balance === undefined && (
          <p className="try-wallet-empty">
            <Wallet className="h-4 w-4" /> {t.walletEmpty}
          </p>
        )}
      </div>
    </div>
  );
}
