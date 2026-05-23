"use client";

import { useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Wallet, LogOut, Loader2 } from "lucide-react";
import { useUsdcBalance } from "@/hooks/use-usdc-balance";

function useHasInjectedWallet() {
  const [hasWallet] = useState(() => {
    if (typeof window === "undefined") return false;
    const win = window as unknown as { ethereum?: unknown };
    return win.ethereum !== undefined;
  });
  return hasWallet;
}

// Browser-extension wallet connect button, styled for franklin.run.
export function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const hasInjected = useHasInjectedWallet();
  const { balance } = useUsdcBalance();

  if (isConnected && address) {
    return (
      <div className="try-wallet">
        {balance !== undefined && (
          <span className="try-wallet-bal">
            ${balance < 0.01 ? balance.toFixed(4) : balance.toFixed(2)}
          </span>
        )}
        <span className="try-wallet-addr">
          {address.slice(0, 6)}…{address.slice(-4)}
        </span>
        <button
          className="try-wallet-disconnect"
          onClick={() => disconnect()}
          aria-label="Disconnect wallet"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (!hasInjected) {
    return (
      <a
        className="btn-primary"
        href="https://metamask.io/download/"
        target="_blank"
        rel="noreferrer"
      >
        <Wallet className="h-4 w-4" />
        Install a wallet
      </a>
    );
  }

  const injected = connectors.find((c) => c.id === "injected") ?? connectors[0];

  return (
    <button
      className="btn-primary"
      onClick={() => injected && connect({ connector: injected })}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Wallet className="h-4 w-4" />
      )}
      {isPending ? "Connecting…" : "Connect wallet"}
    </button>
  );
}
