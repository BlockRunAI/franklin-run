"use client";

import { useEffect, useState } from "react";
import { useAccount, useChainId, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { base } from "wagmi/chains";
import { Wallet, LogOut, Loader2, Smartphone } from "lucide-react";
import { useUsdcBalance } from "@/hooks/use-usdc-balance";
import { useTryLang } from "@/lib/try-i18n";

interface AuthState {
  address: string | null;
  signingIn: boolean;
  error: string | null;
  connect: () => void;
  signOut: () => void;
}

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

// The single wallet control (top-right). "Connect" connects the injected
// wallet (this alone unlocks paid features); once connected it shows the Base
// network, USDC balance + address, and a disconnect button. Connecting does
// not require WalletConnect or a project id — only a browser/in-app wallet.
export function ConnectWallet({ auth }: { auth: AuthState }) {
  const { t } = useTryLang();
  const { isConnected, address } = useAccount();
  const { isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { balance } = useUsdcBalance();
  const isMobile = useIsMobile();
  const hasInjected = useHasInjectedWallet();
  const busy = auth.signingIn || isPending;

  // Avoid SSR/hydration mismatch — wallet state is client-only.
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

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
  if (isConnected && address) {
    const onBase = chainId === base.id;
    return (
      <div className="try-wallet">
        <div className="try-wallet-info">
          <div className="try-wallet-row1">
            {onBase ? (
              <span className="try-wallet-net">{t.baseNetwork}</span>
            ) : (
              <button
                className="try-wallet-net try-wallet-net-warn"
                onClick={() => switchChainAsync({ chainId: base.id }).catch(() => {})}
              >
                {t.switchToBase}
              </button>
            )}
            {onBase && balance !== undefined && <span className="try-wallet-bal">{fmtBal(balance)}</span>}
          </div>
          <span className="try-wallet-addr">
            {address.slice(0, 6)}…{address.slice(-4)}
          </span>
        </div>
        <button
          className="try-wallet-disconnect"
          onClick={() => {
            auth.signOut();
            disconnect();
          }}
          aria-label="Disconnect"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    );
  }

  // Mobile browser with no injected wallet → can't connect here; guide them.
  if (isMobile && !hasInjected) {
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

  // Default → connect the injected wallet.
  return (
    <div className="try-wallet-connect">
      <button className="btn-primary" onClick={auth.connect} disabled={busy}>
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
