"use client";

import { useAuth } from "@/hooks/use-auth";
import { FranklinChat } from "./FranklinChat";
import { SignIn } from "./SignIn";

// Gates /try behind wallet sign-in. FranklinChat (and its hooks) only mount
// once authenticated, so the chat/history hooks can assume a session.
export function TryGate() {
  const { address, connected, loading, signingIn, error, signIn } = useAuth();

  if (loading) {
    return (
      <div className="try-gate-loading">
        <span className="try-coin" aria-hidden />
      </div>
    );
  }
  if (!address) {
    return <SignIn connected={connected} signingIn={signingIn} error={error} onSignIn={signIn} />;
  }
  return <FranklinChat />;
}
