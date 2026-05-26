"use client";

import { Loader2, KeyRound } from "lucide-react";
import { ConnectWallet } from "./ConnectWallet";

interface Props {
  connected?: string;
  signingIn: boolean;
  error: string | null;
  onSignIn: () => void;
}

// Login gate — wallet sign-in is required before using /try.
export function SignIn({ connected, signingIn, error, onSignIn }: Props) {
  return (
    <div className="try-signin">
      <div className="try-signin-card">
        <p className="try-signin-eyebrow">Franklin · web preview</p>
        <h1 className="try-signin-title">
          Sign in with your <em>wallet</em>
        </h1>
        <p className="try-signin-sub">
          Your wallet is your account — no email, no password. Sign once to keep your chats,
          images and videos across devices.
        </p>
        {!connected ? (
          <ConnectWallet />
        ) : (
          <button className="btn-primary lg" onClick={onSignIn} disabled={signingIn}>
            {signingIn ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
            {signingIn ? "Check your wallet…" : "Sign in"}
          </button>
        )}
        {error && <div className="try-error try-signin-error">{error}</div>}
        <p className="try-signin-note">Signing is free and gasless — it just proves you own the address.</p>
      </div>
    </div>
  );
}
