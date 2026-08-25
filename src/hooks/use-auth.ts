"use client";

import { useCallback, useEffect, useState } from "react";
import { useSignMessage } from "wagmi";
import { useWallet, type SolanaWallet, type WalletChain } from "./use-wallet";

// Wallet connection + optional sign-in, on either chain.
//
// Connecting a wallet is all that's needed to *use* the app; whether that
// wallet can pay is a separate question answered by `canPay` (see use-wallet).
// Sign-in is a *separate, best-effort* step that establishes a server session
// so chat history syncs per wallet across devices; it must never block or undo
// a successful connection.
//
// `address` is the signed-in wallet (from the server session), distinct from
// the merely-connected wallet (`connected`).

interface Me {
  address: string | null;
  chain: WalletChain | null;
}

// Uint8Array doesn't survive JSON — the SIWS proof crosses the wire as base64.
function toBase64(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s);
}

export function useAuth() {
  const wallet = useWallet();
  const { signMessageAsync } = useSignMessage();
  const [address, setAddress] = useState<string | null>(null);
  const [chain, setChain] = useState<WalletChain | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/try/auth/me")
      .then((r) => r.json())
      .then((d: Me) => {
        setAddress(d.address ?? null);
        setChain(d.chain ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fetchNonce = useCallback(async (): Promise<string> => {
    const { nonce } = await (await fetch("/api/try/auth/nonce")).json();
    return nonce;
  }, []);

  const postVerify = useCallback(async (body: Record<string, unknown>) => {
    const res = await fetch("/api/try/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Sign-in failed");
    setAddress(data.address);
    setChain(data.chain);
  }, []);

  // SIWE: sign a nonce'd message, the backend verifies and sets a session
  // cookie. Throws on failure; callers decide whether that's fatal.
  const siwe = useCallback(
    async (addr: string) => {
      const nonce = await fetchNonce();
      const message =
        `franklin.run wants you to sign in with your Ethereum account:\n${addr}\n\n` +
        `Sign in to Franklin to keep your chats, images and videos across devices.\n\n` +
        `Nonce: ${nonce}\nIssued At: ${new Date().toISOString()}`;
      const signature = await signMessageAsync({ message, account: addr as `0x${string}` });
      await postVerify({ chain: "evm", address: addr, message, signature });
    },
    [fetchNonce, postVerify, signMessageAsync],
  );

  // Primary action: connect the injected EVM wallet. Kicks off SIWE in the
  // background for history sync, but a SIWE failure never undoes the connect.
  const connect = useCallback(async () => {
    setError(null);
    setSigningIn(true);
    try {
      const addr = await wallet.connectEvm();
      void siwe(addr).catch(() => {});
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not connect your wallet.");
    } finally {
      setSigningIn(false);
    }
  }, [wallet, siwe]);

  // Solana: one prompt does both. The wallet builds the SIWS message around
  // our nonce, so connection and sign-in succeed or fail together — unlike the
  // EVM path there is no second signature to decline. A wallet without
  // `solana:signIn` still connects; it just has no server session.
  const connectSolana = useCallback(
    async (target: SolanaWallet) => {
      setError(null);
      setSigningIn(true);
      try {
        const nonce = await fetchNonce();
        const { address: addr, signIn } = await wallet.connectSolana(target, {
          domain: window.location.host,
          nonce,
          statement:
            "Sign in to Franklin to keep your chats, images and videos across devices.",
        });
        if (signIn) {
          await postVerify({
            chain: "solana",
            address: addr,
            proof: {
              signedMessage: toBase64(signIn.signedMessage),
              signature: toBase64(signIn.signature),
            },
          }).catch(() => {});
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not connect your wallet.");
      } finally {
        setSigningIn(false);
      }
    },
    [wallet, fetchNonce, postVerify],
  );

  // Explicit EVM sign-in (connect if needed, then sign). Surfaces errors.
  const signIn = useCallback(async () => {
    setError(null);
    setSigningIn(true);
    try {
      const addr = await wallet.connectEvm();
      await siwe(addr);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign-in failed");
    } finally {
      setSigningIn(false);
    }
  }, [wallet, siwe]);

  const signOut = useCallback(async () => {
    await fetch("/api/try/auth/logout", { method: "POST" });
    setAddress(null);
    setChain(null);
  }, []);

  return {
    address,
    chain,
    connected: wallet.address,
    connectedChain: wallet.chain,
    isConnected: wallet.isConnected,
    canPay: wallet.canPay,
    isReady: wallet.isReady,
    solanaWallets: wallet.solanaWallets,
    loading,
    signingIn,
    error,
    connect,
    connectSolana,
    signIn,
    signOut,
    disconnect: wallet.disconnect,
  };
}
