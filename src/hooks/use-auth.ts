"use client";

import { useCallback, useEffect, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";

// Wallet sign-in (SIWE-style): connect wallet, sign a nonce'd message, the
// backend verifies and sets a session cookie. `address` is the signed-in
// wallet (from the server session), distinct from the merely-connected wallet.
export function useAuth() {
  const { address: connected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/try/auth/me")
      .then((r) => r.json())
      .then((d) => setAddress(d.address ?? null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const signIn = useCallback(async () => {
    if (!connected) return;
    setError(null);
    setSigningIn(true);
    try {
      const { nonce } = await (await fetch("/api/try/auth/nonce")).json();
      const message =
        `franklin.run wants you to sign in with your Ethereum account:\n${connected}\n\n` +
        `Sign in to Franklin to keep your chats, images and videos across devices.\n\n` +
        `Nonce: ${nonce}\nIssued At: ${new Date().toISOString()}`;
      const signature = await signMessageAsync({ message });
      const res = await fetch("/api/try/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: connected, message, signature }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Sign-in failed");
      setAddress((await res.json()).address);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign-in failed");
    } finally {
      setSigningIn(false);
    }
  }, [connected, signMessageAsync]);

  const signOut = useCallback(async () => {
    await fetch("/api/try/auth/logout", { method: "POST" });
    setAddress(null);
  }, []);

  return { address, connected, loading, signingIn, error, signIn, signOut };
}
