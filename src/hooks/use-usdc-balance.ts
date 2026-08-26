"use client";

import { useQuery } from "@tanstack/react-query";
import { useChainId, useReadContract } from "wagmi";
import { base } from "wagmi/chains";
import { address as toAddress } from "@solana/kit";
import { USDC_BASE_ADDRESS, USDC_ABI } from "@/lib/wagmi-config";
import { solanaClient, USDC_SOLANA_MINT } from "@/lib/solana-config";
import { useWallet } from "./use-wallet";

// Reads the connected wallet's USDC balance, polling so deposits show up.
// Chain-aware behind one return shape: USDC has 6 decimals on both Base and
// Solana, so everything downstream (formatting, thresholds, WalletPanel) is
// shared.

const POLL_MS = 10_000;

// Minimal shape of the jsonParsed SPL token account we actually read.
interface ParsedTokenAccount {
  account: { data: { parsed: { info: { tokenAmount: { amount: string } } } } };
}

async function fetchSolanaUsdc(owner: string): Promise<bigint> {
  const res = await solanaClient.rpc
    .getTokenAccountsByOwner(
      toAddress(owner),
      { mint: toAddress(USDC_SOLANA_MINT) },
      { encoding: "jsonParsed" },
    )
    .send();
  // An owner can hold USDC in more than one token account (the ATA plus any
  // manually created one), and holds none at all before their first deposit —
  // summing handles both without a separate "does the ATA exist" round trip.
  return (res.value as unknown as ParsedTokenAccount[]).reduce(
    (sum, a) => sum + BigInt(a.account.data.parsed.info.tokenAmount.amount),
    BigInt(0),
  );
}

export function useUsdcBalance() {
  const { chain, address, isConnected } = useWallet();
  const chainId = useChainId();

  const isEvm = chain === "evm";
  const isSolana = chain === "solana";

  const {
    data: evmRaw,
    isLoading: evmLoading,
    error: evmError,
    refetch: evmRefetch,
  } = useReadContract({
    address: USDC_BASE_ADDRESS,
    abi: USDC_ABI,
    functionName: "balanceOf",
    args: address && isEvm ? [address as `0x${string}`] : undefined,
    chainId: base.id,
    query: {
      enabled: isEvm && !!address,
      refetchInterval: POLL_MS,
      staleTime: 5_000,
      refetchOnWindowFocus: true,
    },
  });

  const {
    data: solRaw,
    isLoading: solLoading,
    error: solError,
    refetch: solRefetch,
  } = useQuery({
    queryKey: ["usdc-solana", address],
    queryFn: () => fetchSolanaUsdc(address as string),
    enabled: isSolana && !!address,
    refetchInterval: POLL_MS,
    staleTime: 5_000,
    refetchOnWindowFocus: true,
  });

  const rawBalance = isSolana ? solRaw : evmRaw;
  const balance = rawBalance !== undefined ? Number(rawBalance) / 1_000_000 : undefined;

  const hasSufficientBalance = (amountUsd: number): boolean => {
    if (balance === undefined) return false;
    return balance >= amountUsd;
  };

  return {
    balance,
    rawBalance,
    isLoading: isSolana ? solLoading : evmLoading,
    error: isSolana ? solError : evmError,
    refetch: isSolana ? solRefetch : evmRefetch,
    // Solana has one network here, so "on the right network" is always true
    // once connected; only the EVM path can be pointed at the wrong chain.
    // Not `isOnBase` — it is true for a connected Solana wallet, and a name
    // that says Base invites exactly the chain mix-up it is reporting on.
    isOnExpectedNetwork: isSolana ? true : chainId === base.id,
    isConnected,
    hasSufficientBalance,
  };
}
