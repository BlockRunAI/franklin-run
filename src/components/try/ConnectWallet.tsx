"use client";

import { useEffect, useState } from "react";
import { useChainId, useSwitchChain } from "wagmi";
import { base } from "wagmi/chains";
import { Wallet, LogOut, Loader2, Smartphone, ChevronLeft } from "lucide-react";
import { useUsdcBalance } from "@/hooks/use-usdc-balance";
import type { useAuth } from "@/hooks/use-auth";
import type { SolanaWallet } from "@/hooks/use-wallet";
import { useTryLang } from "@/lib/try-i18n";

type AuthState = ReturnType<typeof useAuth>;

// Plain mobile browser (no extension)? Used to show "open in wallet app".
function useIsMobile() {
  const [isMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    const ua = navigator.userAgent || navigator.vendor;
    return /android|iphone|ipad|ipod|mobile/i.test(ua);
  });
  return isMobile;
}
function useHasInjectedWallet() {
  const [has] = useState(() => {
    if (typeof window === "undefined") return false;
    const w = window as unknown as { ethereum?: unknown; web3?: unknown };
    return w.ethereum !== undefined || w.web3 !== undefined;
  });
  return has;
}

function fmtBal(n: number): string {
  return `$${n < 0.01 ? n.toFixed(4) : n.toFixed(2)}`;
}

// Base58 addresses have no 0x prefix to carry the eye, so show a little more
// of the head than the 6 chars an EVM address gets.
function shortAddr(addr: string, chain: "evm" | "solana" | null): string {
  const head = chain === "solana" ? 4 : 6;
  return `${addr.slice(0, head)}…${addr.slice(-4)}`;
}

// The single wallet control (top-right). "Connect" opens a network chooser —
// Ethereum (injected, EIP-6963) or Solana (Wallet Standard discovery) — then
// connects. Once connected it shows the network, USDC balance + address, and a
// disconnect button. Neither path requires WalletConnect or a project id.
export function ConnectWallet({ auth }: { auth: AuthState }) {
  const { t } = useTryLang();
  const { balance } = useUsdcBalance();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const isMobile = useIsMobile();
  const hasInjected = useHasInjectedWallet();
  const busy = auth.signingIn;

  // null = closed, "chains" = pick a network, "solana" = pick a Solana wallet.
  const [picker, setPicker] = useState<null | "chains" | "solana">(null);

  // Avoid SSR/hydration mismatch — wallet state is client-only, and Wallet
  // Standard discovery has the same constraint as the injected provider.
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const connected = auth.connected;

  if (!mounted) {
    return (
      <button className="btn-primary" disabled>
        <Wallet className="h-4 w-4" />
        {t.connectWallet}
      </button>
    );
  }

  // Connected → network + balance on row 1, address on row 2, disconnect at
  // the right. The 272px sidebar can't fit all four on a single line without
  // the address ellipsis breaking, so we lay it out as two intentional rows.
  if (connected) {
    const isSolana = auth.connectedChain === "solana";
    // "Is this wallet on the network we can transact on." Solana has exactly
    // one network here, so it is always true once connected; only the EVM side
    // can be pointed at the wrong chain. Named for the question, not for Base —
    // it governs the Solana pill too.
    const onExpectedNetwork = isSolana || chainId === base.id;
    return (
      <div className="try-wallet">
        <div className="try-wallet-info">
          <div className="try-wallet-row1">
            {onExpectedNetwork ? (
              <span className="try-wallet-net">
                {isSolana ? t.solanaNetwork : t.baseNetwork}
              </span>
            ) : (
              <button
                className="try-wallet-net try-wallet-net-warn"
                onClick={() => switchChainAsync({ chainId: base.id }).catch(() => {})}
              >
                {t.switchToBase}
              </button>
            )}
            {onExpectedNetwork && balance !== undefined && (
              <span className="try-wallet-bal">{fmtBal(balance)}</span>
            )}
          </div>
          <span className="try-wallet-addr">
            {shortAddr(connected, auth.connectedChain)}
          </span>
        </div>
        <button
          className="try-wallet-disconnect"
          onClick={() => {
            setPicker(null);
            auth.signOut();
            auth.disconnect();
          }}
          aria-label="Disconnect"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    );
  }

  // Pick a Solana wallet. Wallet Standard discovers Phantom / Solflare /
  // Backpack without a per-wallet package, so this list is whatever the
  // browser actually has installed — empty means "install one".
  if (picker === "solana") {
    return (
      <div className="try-wallet-connect">
        <div className="try-wallet-picker">
          <button className="try-wallet-picker-back" onClick={() => setPicker("chains")}>
            <ChevronLeft className="h-3.5 w-3.5" />
            {t.back}
          </button>
          {auth.solanaWallets.length === 0 ? (
            <span className="try-wallet-hint">{t.noSolanaWallet}</span>
          ) : (
            auth.solanaWallets.map((w: SolanaWallet) => (
              <button
                key={w.name}
                className="try-wallet-option"
                onClick={() => {
                  // Close first, like the Ethereum path: the button below then
                  // carries the busy state while the wallet prompt is open.
                  setPicker(null);
                  auth.connectSolana(w);
                }}
                disabled={busy}
              >
                {w.icon && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={w.icon} alt="" className="try-wallet-option-icon" />
                )}
                {w.name}
              </button>
            ))
          )}
        </div>
        {auth.solanaWallets.length === 0 && (
          <span className="try-wallet-hint">{t.installSolanaWallet}</span>
        )}
        <span className="try-wallet-hint">{t.solanaHint}</span>
      </div>
    );
  }

  // Pick a network.
  if (picker === "chains") {
    return (
      <div className="try-wallet-connect">
        <div className="try-wallet-picker">
          <span className="try-wallet-picker-label">{t.chooseNetwork}</span>
          <button
            className="try-wallet-option"
            onClick={() => {
              setPicker(null);
              auth.connect();
            }}
            disabled={busy}
          >
            {t.networkEthereum}
          </button>
          <button className="try-wallet-option" onClick={() => setPicker("solana")} disabled={busy}>
            {t.networkSolana}
          </button>
        </div>
        {auth.error === "NO_WALLET" ? (
          <span className="try-wallet-hint">{isMobile ? t.openInWalletApp : t.installWallet}</span>
        ) : (
          auth.error && <span className="try-wallet-err">{auth.error}</span>
        )}
      </div>
    );
  }

  // Mobile browser with no injected wallet → the Ethereum path can't work
  // here. A Solana wallet's in-app browser still injects a Wallet Standard
  // wallet, so only fall back to the guidance when neither is available.
  if (isMobile && !hasInjected && auth.solanaWallets.length === 0) {
    return (
      <div className="try-wallet-connect">
        <button className="btn-primary" disabled>
          <Smartphone className="h-4 w-4" />
          {t.noWalletFound}
        </button>
        <span className="try-wallet-hint">{t.openInWalletApp}</span>
      </div>
    );
  }

  return (
    <div className="try-wallet-connect">
      <button className="btn-primary" onClick={() => setPicker("chains")} disabled={busy}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
        {busy ? t.connecting : t.connectWallet}
      </button>
      {auth.error === "NO_WALLET" ? (
        <span className="try-wallet-hint">{isMobile ? t.openInWalletApp : t.installWallet}</span>
      ) : (
        auth.error && <span className="try-wallet-err">{auth.error}</span>
      )}
    </div>
  );
}
