"use client";

import { useAccount, useChainId, useReadContract } from "wagmi";
import { base } from "wagmi/chains";
import { USDC_BASE_ADDRESS, USDC_ABI } from "@/lib/wagmi-config";

// Reads the connected wallet's USDC balance on Base, polling so deposits show up.
export function useUsdcBalance() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const {
    data: rawBalance,
    isLoading,
    error,
    refetch,
  } = useReadContract({
    address: USDC_BASE_ADDRESS,
    abi: USDC_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: base.id,
    query: {
      enabled: !!address && isConnected,
      refetchInterval: 10_000,
      staleTime: 5_000,
      refetchOnWindowFocus: true,
    },
  });

  const balance =
    rawBalance !== undefined ? Number(rawBalance) / 1_000_000 : undefined;

  const hasSufficientBalance = (amountUsd: number): boolean => {
    if (balance === undefined) return false;
    return balance >= amountUsd;
  };

  return {
    balance,
    rawBalance,
    isLoading,
    error,
    refetch,
    isOnBase: chainId === base.id,
    isConnected,
    hasSufficientBalance,
  };
}
