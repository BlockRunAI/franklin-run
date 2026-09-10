"use client";
/* eslint-disable @next/next/no-html-link-for-pages -- OAuth needs a full document navigation to the login route. */
import { useEffect, useState } from "react";
import { CreditCard, LogOut } from "lucide-react";
import { useBlockRunAccount } from "@/hooks/use-blockrun-account";
import { useTryLang } from "@/lib/try-i18n";
import { ACCOUNT_COPY } from "@/lib/account-i18n";
export function AccountControl() {
  const { lang } = useTryLang();
  const L = ACCOUNT_COPY[lang];
  const payment = useBlockRunAccount();
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    setError(new URLSearchParams(window.location.search).has("account_error"));
  }, []);
  return <section className="try-account-control" aria-label={L.title}>
    <label>{L.title}<select aria-label={L.title} value={payment.rail} onChange={e => payment.setRail(e.target.value as "wallet" | "credit")} disabled={!payment.ready || busy}>
      <option value="wallet">{L.wallet}</option><option value="credit">{L.credit}</option>
    </select></label>
    {payment.account.connected ? <>
      <span className="try-account-email">{payment.account.email}</span>
      <strong>{L.balance}: {typeof payment.account.remaining === "number" ? `$${payment.account.remaining.toFixed(2)}` : "—"}</strong>
      <a href="https://user.blockrun.ai/dashboard/credits" target="_blank" rel="noreferrer">{L.topup}</a>
      <button type="button" disabled={busy} onClick={async () => { setBusy(true); setError(false); try { await payment.disconnect(); } catch { setError(true); } finally { setBusy(false); } }}><LogOut size={14} />{L.disconnect}</button>
    </> : <a className="try-account-login" href="/api/try/account/login"><CreditCard size={16} />{L.login}</a>}
    {error && <span role="alert">{L.error}</span>}
  </section>;
}
