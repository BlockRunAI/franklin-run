"use client";

import { useState } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClientProvider } from "@solana/react";
import { wagmiConfig } from "@/lib/wagmi-config";
import { solanaClient } from "@/lib/solana-config";

// Wraps the /chat playground only — keeps both wallet stacks out of every other
// page's bundle. The Solana client is nested inside the existing
// QueryClientProvider so one QueryClient serves both chains (@solana/react
// peer-depends on @tanstack/react-query, which wagmi already brought in).
export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ClientProvider client={solanaClient}>{children}</ClientProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
