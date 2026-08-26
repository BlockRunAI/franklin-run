"use client";

import { useCallback, useMemo, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import {
  useConnect as useSolanaConnect,
  useConnectedWallet,
  useDisconnect as useSolanaDisconnect,
  useIsWalletReady,
  useSignIn as useSolanaSignIn,
  useWallets,
} from "@solana/kit-plugin-wallet/react";
import type { SolanaSignInInput, SolanaSignInOutput } from "@solana/wallet-standard-features";
import { solanaClient } from "@/lib/solana-config";

// The single wallet facade. Everything outside this file should be chain-blind:
// components ask "is a wallet connected" and "can it pay", not "is wagmi
// connected". Adding Solana by teaching each of the seven previous wagmi call
// sites about a second chain would have doubled every conditional.
//
// Two gates, deliberately distinct:
//   isConnected — a wallet of any chain is attached. Gates identity/history.
//   canPay      — that wallet can settle an x402 invoice. See CAN_PAY_CHAINS.

export type WalletChain = "evm" | "solana";

// Which chain the user last deliberately connected on. Persisted because both
// wallet stacks silently auto-reconnect on mount: wagmi reconnects a remembered
// injected wallet, and the Kit plugin restores a persisted Solana one. Without
// a recorded choice, "which of these two is the active wallet" gets decided by
// a hardcoded tie-break rather than by anything the user did.
const ACTIVE_CHAIN_KEY = "franklin-active-chain";

/** A Wallet Standard wallet as surfaced by the Kit plugin (Phantom, Solflare, …). */
export type SolanaWallet = ReturnType<typeof useWallets>[number];

/** The active Solana connection — `{ account, signer, wallet }`, or null. */
type SolanaConnection = ReturnType<typeof useConnectedWallet>;

// Chains BlockRun issues x402 requirements for. Both gateways are live —
// blockrun.ai settles Base USDC via EIP-3009, sol.blockrun.ai settles Solana
// USDC via a facilitator-paid SPL transfer — so every chain we can connect, we
// can also pay from. Kept as a list rather than folded into `isConnected`
// because a future read-only or unsupported chain would land here first.
const CAN_PAY_CHAINS: readonly WalletChain[] = ["evm", "solana"];

// The header the /api/blockrun proxy reads to pick a gateway, and therefore the
// payment chain (see src/app/api/blockrun/[...path]/route.ts). Every paid
// request must carry it; an unpaid one may, harmlessly. Returns a plain object
// so call sites can spread it into an existing headers literal.
export function chainHeaders(chain: WalletChain | null): Record<string, string> {
  return chain === "solana" ? { "x-blockrun-chain": "solana" } : {};
}

export interface WalletFacade {
  /** The connected chain, or null when nothing is attached. */
  chain: WalletChain | null;
  /** Checksum-free 0x address, or a base58 Solana address. Never case-folded. */
  address: string | null;
  isConnected: boolean;
  /** Whether the connected wallet can settle an x402 payment. */
  canPay: boolean;
  /**
   * False while the Solana plugin is still silently reconnecting a persisted
   * wallet. Gate wallet-dependent UI on this so a reconnecting wallet never
   * flashes "disconnected".
   */
  isReady: boolean;
  /** Wallets discovered for Solana mainnet — the picker's contents. */
  solanaWallets: readonly SolanaWallet[];
  /**
   * The connected Solana wallet as a Kit signer, for building the x402
   * transfer. Null on EVM, and also on a read-only Solana wallet — which is a
   * real case (a watch-only account connects and shows a balance but cannot
   * sign), so the payment path must check rather than assume.
   */
  solanaSigner: NonNullable<SolanaConnection>["signer"] | null;
  connectEvm: () => Promise<string>;
  /**
   * Connects and, where the wallet supports it, signs in (SIWS) in one prompt.
   * `input` carries the server-issued nonce; omit it to connect without a
   * verifiable sign-in.
   */
  connectSolana: (
    wallet: SolanaWallet,
    input?: SolanaSignInInput,
  ) => Promise<{ address: string; signIn: SolanaSignInOutput | null }>;
  disconnect: () => void;
}

export function useWallet(): WalletFacade {
  // ── EVM ──────────────────────────────────────────────────────────────────
  const { address: evmAddress, isConnected: evmConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { disconnect: evmDisconnect } = useDisconnect();

  // ── Solana ───────────────────────────────────────────────────────────────
  const solanaWallets = useWallets(solanaClient);
  const solanaConnected = useConnectedWallet(solanaClient);
  const solanaReady = useIsWalletReady(solanaClient);
  const { dispatchAsync: solanaConnect } = useSolanaConnect(solanaClient);
  const { dispatchAsync: solanaSignIn } = useSolanaSignIn(solanaClient);
  const { dispatch: solanaDisconnect } = useSolanaDisconnect(solanaClient);

  // Read on the first client render, not in an effect. Hydration is safe
  // because this value only ever changes the outcome when BOTH wallets are
  // connected, which cannot be true on the first render — both stacks start
  // disconnected on the server and in the browser. Loading it a render late
  // instead is what would be visible: it is needed the moment the warm-up
  // below resolves, not one commit afterwards.
  const [preferred, setPreferred] = useState<WalletChain | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const v = localStorage.getItem(ACTIVE_CHAIN_KEY);
      return v === "evm" || v === "solana" ? v : null;
    } catch {
      return null; // private mode / storage disabled — fall back to what is connected
    }
  });

  const rememberChain = useCallback((c: WalletChain | null) => {
    setPreferred(c);
    try {
      if (c) localStorage.setItem(ACTIVE_CHAIN_KEY, c);
      else localStorage.removeItem(ACTIVE_CHAIN_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  // Match the injected connector by `type` (more reliable than `id` under
  // EIP-6963 multi-provider discovery, and what BlockRun's app uses). Throws a
  // friendly NO_WALLET when there's no injected provider at all (desktop
  // without an extension, plain mobile browser) so the UI can show guidance
  // instead of a raw "Provider not found".
  const resolveEvmConnector = useCallback(() => {
    const c = connectors.find((x) => x.type === "injected") ?? connectors[0];
    const w =
      typeof window !== "undefined"
        ? (window as { ethereum?: unknown; web3?: unknown })
        : undefined;
    const hasProvider = !!w && (w.ethereum !== undefined || w.web3 !== undefined);
    if (!c || !hasProvider) throw new Error("NO_WALLET");
    return c;
  }, [connectors]);

  // Both connect paths take over as the single active wallet, but only AFTER
  // the wallet actually says yes — a declined prompt must leave the previous
  // wallet exactly as it was rather than logging the user out of it.
  const connectEvm = useCallback(async () => {
    const takeOver = (addr: string) => {
      if (solanaConnected) solanaDisconnect();
      rememberChain("evm");
      return addr;
    };
    if (evmAddress) return takeOver(evmAddress);
    const res = await connectAsync({ connector: resolveEvmConnector() });
    return takeOver(res.accounts[0]);
  }, [
    evmAddress,
    connectAsync,
    resolveEvmConnector,
    solanaConnected,
    solanaDisconnect,
    rememberChain,
  ]);

  const connectSolana = useCallback(
    async (wallet: SolanaWallet, input?: SolanaSignInInput) => {
      // SIWS establishes the connection *and* produces a signed sign-in in a
      // single wallet prompt, so prefer it. Wallets that don't advertise
      // `solana:signIn` fall back to a plain connect — the user is then
      // connected but not signed in, exactly like a rejected SIWE signature.
      const takeOver = () => {
        if (evmConnected) evmDisconnect();
        rememberChain("solana");
      };
      try {
        const out = await solanaSignIn(wallet, input ?? {});
        takeOver();
        return { address: out.account.address, signIn: out };
      } catch (e) {
        // A user-rejected prompt must not silently downgrade to a second
        // prompt; only an unsupported-feature error should fall through.
        if (isUserRejection(e)) throw e;
        const accounts = await solanaConnect(wallet);
        const address = accounts[0]?.address;
        if (!address) throw new Error("NO_WALLET");
        takeOver();
        return { address, signIn: null };
      }
    },
    [solanaSignIn, solanaConnect, evmConnected, evmDisconnect, rememberChain],
  );

  const disconnect = useCallback(() => {
    if (evmConnected) evmDisconnect();
    if (solanaConnected) solanaDisconnect();
    rememberChain(null);
  }, [evmConnected, evmDisconnect, solanaConnected, solanaDisconnect, rememberChain]);

  return useMemo(() => {
    // One active wallet at a time. The session is keyed to a single address,
    // history is namespaced per address and x402 settles from one payer, so a
    // simultaneous EVM + Solana connection would mean two identities and an
    // ambiguous payer.
    //
    // connectEvm/connectSolana disconnect each other, so both being connected
    // should be transient — the tick between "Phantom said yes" and wagmi
    // finishing its disconnect — or the result of the user re-authorizing a
    // wallet from the extension itself. Either way the last chain the user
    // deliberately connected on wins. Preferring one chain unconditionally is
    // what made connecting Phantom look like it did nothing when an injected
    // EVM wallet happened to be auto-reconnected.
    //
    // With no recorded choice, Solana is the default: it is the cheaper rail,
    // and this case is reached only when both wallets auto-reconnected without
    // the user picking either — where the tie should fall to the chain we want
    // people on, not to whichever one an extension happened to restore.
    //
    // The warm-up asymmetry matters too. wagmi has already settled by first
    // paint, while the Kit plugin is still restoring a persisted wallet, so a
    // user who last chose Solana would otherwise see their EVM wallet resolve
    // first and the pill flash Base before flipping to Phantom. While Solana is
    // still warming and Solana is what they chose, report "not connected yet"
    // rather than the wrong chain — ConnectWallet holds its loading shell until
    // isReady, so this window is never rendered as disconnected either.
    const solanaPending = !solanaReady && preferred === "solana";
    const chain: WalletChain | null = solanaPending
      ? null
      : evmConnected && solanaConnected
        ? (preferred ?? "solana")
        : evmConnected
          ? "evm"
          : solanaConnected
            ? "solana"
            : null;
    const address = chain === "evm" ? (evmAddress ?? null) : (solanaConnected?.account.address ?? null);

    return {
      chain,
      address,
      solanaSigner: chain === "solana" ? (solanaConnected?.signer ?? null) : null,
      isConnected: chain !== null,
      canPay: chain !== null && CAN_PAY_CHAINS.includes(chain),
      // Only the Solana plugin has an async warm-up; wagmi's `isConnected` is
      // already settled by the time the tree mounts.
      isReady: solanaReady,
      solanaWallets,
      connectEvm,
      connectSolana,
      disconnect,
    };
  }, [
    preferred,
    evmConnected,
    evmAddress,
    solanaConnected,
    solanaReady,
    solanaWallets,
    connectEvm,
    connectSolana,
    disconnect,
  ]);
}

function isUserRejection(e: unknown): boolean {
  const msg = e instanceof Error ? `${e.name} ${e.message}` : String(e);
  return /reject|denied|cancel|declin/i.test(msg);
}
