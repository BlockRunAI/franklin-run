import { createClient } from "@solana/kit";
import { solanaRpc } from "@solana/kit-plugin-rpc";
import { walletSigner } from "@solana/kit-plugin-wallet";
import { SOLANA_MAINNET_CHAIN } from "@solana/wallet-standard-chains";

// Solana side of the /try playground's wallet stack, mirroring wagmi-config.ts
// on the EVM side. Wallet Standard handles discovery, so Phantom / Solflare /
// Backpack need no per-wallet package — the same story as EIP-6963 injected
// discovery for Ethereum.

export const SOLANA_CHAIN = SOLANA_MAINNET_CHAIN;

// CAIP-2 id for mainnet (genesis hash), used to match x402 `accepts` entries.
// Distinct from SOLANA_CHAIN, which is the Wallet Standard identifier.
export const SOLANA_CAIP2 = "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp";

// USDC (SPL) on Solana mainnet — 6 decimals, same as USDC on Base, so the
// formatting/threshold logic downstream is shared.
export const USDC_SOLANA_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

// The public endpoint is heavily rate limited and will not survive a polling
// balance hook. Set NEXT_PUBLIC_SOLANA_RPC_URL to a real provider in anything
// other than local dev.
export const SOLANA_RPC_URL =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";

// One client = one chain (the wallet plugin's rule). Built once at module scope
// so the reference stays stable across renders, as ClientProvider requires.
// SSR-safe: the wallet plugin reports "pending" on the server and resolves once
// the browser's storage check completes.
export const solanaClient = createClient()
  .use(walletSigner({ chain: SOLANA_CHAIN }))
  .use(solanaRpc({ rpcUrl: SOLANA_RPC_URL }));

export type SolanaClient = typeof solanaClient;

// Base58 — no 0/O/I/l. Deliberately case-sensitive: unlike an EVM address, a
// Solana address must never be case-folded (see session.ts).
const BASE58_ADDRESS = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

export function isSolanaAddress(address: string): boolean {
  return BASE58_ADDRESS.test(address);
}
