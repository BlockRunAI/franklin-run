"use client";

import { useCallback, useEffect, useState } from "react";
import { useAccount, useSignMessage, useConnect } from "wagmi";

// Wallet connection + optional sign-in.
//
// Connecting the injected wallet (wagmi `isConnected`) is all that's needed to
// use paid features — the chat gate keys on `isConnected`, and x402 payments
// sign from the connected wallet. SIWE sign-in is a *separate, best-effort*
// step that establishes a server session so chat history syncs per wallet
// across devices; it must never block or undo a successful connection.
//
// `address` is the SIWE-signed-in wallet (from the server session), distinct
// from the merely-connected wallet (`connected`).
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

  // SIWE: sign a nonce'd message, the backend verifies and sets a session
  // cookie. Throws on failure; callers decide whether that's fatal.
  const siwe = useCallback(
    async (addr: string) => {
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
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sign-in failed");
      setAddress(data.address);
    },
    [signMessageAsync],
  );

  // Match the injected connector by `type` (more reliable than `id` under
  // EIP-6963 multi-provider discovery, and what BlockRun's app uses).
  const injectedConnector = useCallback(
    () => connectors.find((c) => c.type === "injected") ?? connectors[0],
    [connectors],
  );

  // Resolve the connector to use, or throw a friendly NO_WALLET when there's no
  // injected provider at all (desktop without an extension, plain mobile
  // browser) — so the UI shows guidance instead of a raw "Provider not found".
  const resolveConnector = useCallback(() => {
    const c = injectedConnector();
    const w = typeof window !== "undefined" ? (window as { ethereum?: unknown; web3?: unknown }) : undefined;
    const hasProvider = !!w && (w.ethereum !== undefined || w.web3 !== undefined);
    if (!c || !hasProvider) throw new Error("NO_WALLET");
    return c;
  }, [injectedConnector]);

  // Primary action: connect the injected wallet. Kicks off SIWE in the
  // background for history sync, but a SIWE failure never undoes the connect.
  const connect = useCallback(async () => {
    setError(null);
    setSigningIn(true);
    try {
      let addr = connected;
      if (!addr) {
        const res = await connectAsync({ connector: resolveConnector() });
        addr = res.accounts[0];
      }
      // Best-effort: establish a history session. Swallow failures so a
      // rejected signature or backend hiccup doesn't break the connection.
      void siwe(addr).catch(() => {});
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not connect your wallet.");
    } finally {
      setSigningIn(false);
    }
  }, [connected, connectAsync, resolveConnector, siwe]);

  // Explicit SIWE sign-in (connect if needed, then sign). Surfaces errors.
  const signIn = useCallback(async () => {
    setError(null);
    setSigningIn(true);
    try {
      let addr = connected;
      if (!addr) {
        const res = await connectAsync({ connector: resolveConnector() });
        addr = res.accounts[0];
      }
      await siwe(addr);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign-in failed");
    } finally {
      setSigningIn(false);
    }
  }, [connected, connectAsync, resolveConnector, siwe]);

  const signOut = useCallback(async () => {
    await fetch("/api/try/auth/logout", { method: "POST" });
    setAddress(null);
  }, []);

  return { address, connected, loading, signingIn, error, connect, signIn, signOut };
}
