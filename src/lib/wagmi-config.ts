import { http, createConfig } from "wagmi";
import { base, mainnet } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

// Optional — only enables WalletConnect (mobile QR) when a project id is set.
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_ID || "";
const isClient = typeof window !== "undefined";

// Browser-wallet config for the /try playground. Base is primary (USDC + x402),
// mainnet is included so users connected to Ethereum can switch over.
export const wagmiConfig = createConfig({
  chains: [base, mainnet],
  connectors: [
    injected(),
    ...(isClient && projectId ? [walletConnect({ projectId })] : []),
  ],
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
  },
  ssr: true,
});

// USDC on Base mainnet — the asset x402 payments settle in.
export const USDC_BASE_ADDRESS =
  "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as const;

export const USDC_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
] as const;
