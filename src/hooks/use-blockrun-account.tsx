"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useWallet } from "./use-wallet";
import { paymentRequestInit, type PaymentRail } from "@/lib/payment-client";
interface Account { connected: boolean; email?: string; remaining?: number | null; blocked?: boolean; unavailable?: boolean }
interface PaymentContext {
  account: Account; rail: PaymentRail; ready: boolean; canPay: boolean;
  setRail: (rail: PaymentRail) => void; refresh: () => Promise<void>; disconnect: () => Promise<void>;
  request: (url: string, init?: RequestInit) => Promise<Response>;
}
const Context = createContext<PaymentContext | null>(null);
export function BlockRunAccountProvider({ children }: { children: React.ReactNode }) {
  const { canPay: walletCanPay } = useWallet();
  const [account, setAccount] = useState<Account>({ connected: false });
  const [rail, setRail] = useState<PaymentRail>("wallet");
  const [ready, setReady] = useState(false);
  const refresh = useCallback(async () => {
    const r = await fetch("/api/try/account", { cache: "no-store" });
    if (r.ok) setAccount(await r.json());
  }, []);
  useEffect(() => {
    let active = true;
    // Restore the user's chosen rail even when the status endpoint is unavailable.
    const initialParams = new URLSearchParams(window.location.search);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Restore the browser payment choice before enabling requests.
    if (initialParams.has("account_connected") || sessionStorage.getItem("franklin-payment") === "credit") setRail("credit");
    fetch("/api/try/account", { cache: "no-store" }).then(r => r.json()).then((d: Account) => {
      if (!active) return;
      setAccount(d);
      const params = new URLSearchParams(window.location.search);
      const saved = sessionStorage.getItem("franklin-payment");
      // Once selected, credit stays selected even after expiry: never silently charge a wallet.
      setRail(params.has("account_connected") || saved === "credit" || (saved !== "wallet" && d.connected) ? "credit" : "wallet");
      if (params.has("account_connected")) {
        sessionStorage.setItem("franklin-payment", "credit");
        params.delete("account_connected");
        window.history.replaceState({}, "", window.location.pathname + (params.size ? `?${params}` : ""));
      }
    }).catch(() => {}).finally(() => { if (active) setReady(true); });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (!account.connected) return;
    const update = () => { void refresh().catch(() => {}); };
    const interval = setInterval(update, 60_000);
    window.addEventListener("focus", update);
    return () => { clearInterval(interval); window.removeEventListener("focus", update); };
  }, [account.connected, refresh]);
  const chooseRail = useCallback((value: PaymentRail) => {
    setRail(value);
    sessionStorage.setItem("franklin-payment", value);
  }, []);
  const disconnect = useCallback(async () => {
    const r = await fetch("/api/try/account/logout", { method: "POST" });
    if (!r.ok) throw new Error("Could not disconnect BlockRun. Please retry.");
    setAccount({ connected: false });
  }, []);
  const request = useCallback(async (url: string, init?: RequestInit) => {
    if (!url.startsWith("/api/blockrun/v1/")) throw new Error("Invalid BlockRun request");
    if (rail === "credit" && !account.connected) throw new Error("Sign in to BlockRun to use account credit.");
    const r = await fetch(url, paymentRequestInit(rail, init));
    if (rail === "credit") {
      const remaining = r.headers.get("x-blockrun-credit-remaining-usd");
      if (remaining !== null && Number.isFinite(Number(remaining))) setAccount(a => ({ ...a, remaining: Number(remaining) }));
      if (r.status === 401) {
        setAccount({ connected: false });
        throw new Error("Your BlockRun connection expired. Sign in again.");
      }
      if (r.status === 402) {
        void refresh().catch(() => {});
        throw new Error("Your BlockRun account cannot pay for this request. Check your credit balance and billing limits in BlockRun.");
      }
    }
    return r;
  }, [rail, account.connected, refresh]);
  return <Context.Provider value={{ account, rail, ready, canPay: ready && (rail === "credit" ? account.connected : walletCanPay), setRail: chooseRail, refresh, disconnect, request }}>{children}</Context.Provider>;
}
export function useBlockRunAccount() {
  const context = useContext(Context);
  if (!context) throw new Error("BlockRunAccountProvider is missing");
  return context;
}
