"use client";

import { useCallback, useEffect, useState } from "react";
import { useAccount, useSignMessage, useConnect } from "wagmi";

// Wallet sign-in (SIWE-style): connect wallet, sign a nonce'd message, the
// backend verifies and sets a session cookie. `address` is the signed-in
// wallet (from the server session), distinct from the merely-connected wallet.
export function useAuth() {
  const { address: connected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { connectAsync, connectors } = useConnect();
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
    setError(null);
    setSigningIn(true);
    try {
      // Connect the wallet first if needed (one-click sign-in).
      let addr = connected;
      if (!addr) {
        const injected = connectors.find((c) => c.id === "injected") ?? connectors[0];
        if (!injected) throw new Error("No wallet found. Install MetaMask.");
        const res = await connectAsync({ connector: injected });
        addr = res.accounts[0];
      }
      const { nonce } = await (await fetch("/api/try/auth/nonce")).json();
      const message =
        `franklin.run wants you to sign in with your Ethereum account:\n${addr}\n\n` +
        `Sign in to Franklin to keep your chats, images and videos across devices.\n\n` +
        `Nonce: ${nonce}\nIssued At: ${new Date().toISOString()}`;
      const signature = await signMessageAsync({ message, account: addr as `0x${string}` });
      const res = await fetch("/api/try/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: addr, message, signature }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Sign-in failed");
      setAddress((await res.json()).address);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign-in failed");
    } finally {
      setSigningIn(false);
    }
  }, [connected, signMessageAsync, connectAsync, connectors]);

  const signOut = useCallback(async () => {
    await fetch("/api/try/auth/logout", { method: "POST" });
    setAddress(null);
  }, []);

  return { address, connected, loading, signingIn, error, signIn, signOut };
}
