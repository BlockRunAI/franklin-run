"use client";

import { useCallback, useMemo } from "react";
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

  const connectEvm = useCallback(async () => {
    if (evmAddress) return evmAddress;
    const res = await connectAsync({ connector: resolveEvmConnector() });
    return res.accounts[0];
  }, [evmAddress, connectAsync, resolveEvmConnector]);

  const connectSolana = useCallback(
    async (wallet: SolanaWallet, input?: SolanaSignInInput) => {
      // SIWS establishes the connection *and* produces a signed sign-in in a
      // single wallet prompt, so prefer it. Wallets that don't advertise
      // `solana:signIn` fall back to a plain connect — the user is then
      // connected but not signed in, exactly like a rejected SIWE signature.
      try {
        const out = await solanaSignIn(wallet, input ?? {});
        return { address: out.account.address, signIn: out };
      } catch (e) {
        // A user-rejected prompt must not silently downgrade to a second
        // prompt; only an unsupported-feature error should fall through.
        if (isUserRejection(e)) throw e;
        const accounts = await solanaConnect(wallet);
        const address = accounts[0]?.address;
        if (!address) throw new Error("NO_WALLET");
        return { address, signIn: null };
      }
    },
    [solanaSignIn, solanaConnect],
  );

  const disconnect = useCallback(() => {
    if (evmConnected) evmDisconnect();
    if (solanaConnected) solanaDisconnect();
  }, [evmConnected, evmDisconnect, solanaConnected, solanaDisconnect]);

  return useMemo(() => {
    // One active wallet at a time. The session is keyed to a single address,
    // history is namespaced per address and x402 settles from one payer, so a
    // simultaneous EVM + Solana connection would mean two identities and an
    // ambiguous payer. EVM wins the tie because it is the payable chain.
    const chain: WalletChain | null = evmConnected
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
