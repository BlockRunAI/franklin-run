"use client";

import { useEffect, useState } from "react";
import { useDisconnect } from "wagmi";
import { Wallet, LogOut, Loader2 } from "lucide-react";
import { useUsdcBalance } from "@/hooks/use-usdc-balance";
import { useTryLang } from "@/lib/try-i18n";

interface AuthState {
  address: string | null;
  signingIn: boolean;
  signIn: () => void;
  signOut: () => void;
}

// The single wallet control (top-right). "Sign in" = connect wallet + SIWE in
// one click; once signed in shows USDC balance + address. Disconnect signs out.
export function ConnectWallet({ auth }: { auth: AuthState }) {
  const { t } = useTryLang();
  const { disconnect } = useDisconnect();
  const { balance } = useUsdcBalance();

  // Avoid SSR/hydration mismatch — wallet state is client-only.
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button className="btn-primary" disabled>
        <Wallet className="h-4 w-4" />
        {t.signIn}
      </button>
    );
  }

  if (auth.address) {
    return (
      <div className="try-wallet">
        {balance !== undefined && (
          <span className="try-wallet-bal">${balance < 0.01 ? balance.toFixed(4) : balance.toFixed(2)}</span>
        )}
        <span className="try-wallet-addr">
          {auth.address.slice(0, 6)}…{auth.address.slice(-4)}
        </span>
        <button
          className="try-wallet-disconnect"
          onClick={() => {
            auth.signOut();
            disconnect();
          }}
          aria-label="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <button className="btn-primary" onClick={auth.signIn} disabled={auth.signingIn}>
      {auth.signingIn ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
      {auth.signingIn ? t.connecting : t.signIn}
    </button>
  );
}
