"use client";

import { useState, useCallback } from "react";
import { useSwitchChain } from "wagmi";
import { getWalletClient } from "wagmi/actions";
import { getAddress } from "viem";
import { wagmiConfig } from "@/lib/wagmi-config";
import { useWallet, type WalletChain } from "./use-wallet";
import { createSolanaPaymentPayload, SolanaPaymentError } from "@/lib/solana-x402";

const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

// EIP-3009 TransferWithAuthorization — the message USDC supports for gasless,
// signature-authorized transfers. x402 rides on this.
const authorizationTypes = {
  TransferWithAuthorization: [
    { name: "from", type: "address" },
    { name: "to", type: "address" },
    { name: "value", type: "uint256" },
    { name: "validAfter", type: "uint256" },
    { name: "validBefore", type: "uint256" },
    { name: "nonce", type: "bytes32" },
  ],
} as const;

interface PaymentRequirement {
  scheme: string;
  network: string;
  asset: string;
  amount: string;
  payTo: string;
  maxTimeoutSeconds?: number;
  // EVM carries the EIP-712 domain (`name` / `version`); Solana carries the
  // facilitator fee payer and the finalized blockhash to build against.
  extra?: Record<string, unknown> & { name?: string; version?: string };
}

interface ResourceInfo {
  url: string;
  description?: string;
  mimeType?: string;
}

export interface X402Response {
  x402Version: number;
  error?: string;
  resource: ResourceInfo;
  accepts: PaymentRequirement[];
  extensions?: Record<string, unknown>;
}

type PaymentStep = "idle" | "signing" | "done" | "error";

function createNonce(): `0x${string}` {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return `0x${Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")}` as `0x${string}`;
}

// A 402 may offer several ways to pay. Pick the one the connected wallet can
// actually settle rather than assuming accepts[0]. Each BlockRun gateway
// currently answers with a single entry for its own chain, but the Base one
// already emits two when `upto` billing is enabled — and index 0 is only
// "exact" there by convention. Selecting by network is what keeps the label,
// the signature and the retry all describing the same offer.
const NETWORK_PREFIX: Record<WalletChain, string> = {
  evm: "eip155:",
  solana: "solana:",
};

export function selectRequirement(
  accepts: PaymentRequirement[],
  chain: WalletChain | null,
): PaymentRequirement | undefined {
  if (!chain) return undefined;
  return accepts.find((a) => a.network?.startsWith(NETWORK_PREFIX[chain]));
}

export function useX402Payment() {
  const { address, isConnected, canPay, chain, solanaSigner } = useWallet();
  const { switchChainAsync } = useSwitchChain();
  const [step, setStep] = useState<PaymentStep>("idle");
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setStep("idle");
    setError(null);
  }, []);

  const createPayment = useCallback(
    async (
      requirements: PaymentRequirement,
      resource?: ResourceInfo,
      // Echoed verbatim into the Solana payload. The gateway puts its discovery
      // (`bazaar`) block here and expects to see it come back unchanged.
      extensions?: Record<string, unknown>,
    ): Promise<{ payload: string | null; error: string | null }> => {
      if (!address || !isConnected) {
        const msg = "Wallet not connected";
        setError(msg);
        setStep("error");
        return { payload: null, error: msg };
      }
      // Connected on a chain this resource can't be paid from. Say so plainly
      // instead of failing later inside a signing path built for another chain.
      if (!canPay) {
        const msg = "This wallet's network can't pay for this request.";
        setError(msg);
        setStep("error");
        return { payload: null, error: msg };
      }

      setStep("signing");
      setError(null);

      // Solana settles a whole signed SPL transfer rather than an EIP-3009
      // authorization, so it forks before any of the EVM machinery below.
      if (chain === "solana") {
        if (!solanaSigner) {
          const msg = "This Solana wallet can't sign transactions — reconnect with a signing account.";
          setError(msg);
          setStep("error");
          return { payload: null, error: msg };
        }
        try {
          const payload = await createSolanaPaymentPayload(
            solanaSigner,
            requirements,
            resource || {
              url: "https://franklin.run/api/blockrun/v1/messages",
              description: "Franklin web playground",
              mimeType: "application/json",
            },
            extensions,
          );
          setStep("done");
          return { payload, error: null };
        } catch (e) {
          // A SolanaPaymentError is already phrased for a human; anything else
          // is a wallet rejection or an unexpected failure.
          const msg =
            e instanceof SolanaPaymentError
              ? e.message
              : e instanceof Error
                ? e.message
                : "Payment failed";
          setError(msg);
          setStep("error");
          return { payload: null, error: msg };
        }
      }

      try {
        const requiredChainId = parseInt(
          requirements.network.split(":")[1] || "8453",
        );

        try {
          await switchChainAsync({ chainId: requiredChainId });
          await new Promise((r) => setTimeout(r, 1000));
        } catch {
          const msg = "Please switch to the Base network in your wallet and try again";
          setError(msg);
          setStep("error");
          return { payload: null, error: msg };
        }

        let walletClient;
        try {
          walletClient = await getWalletClient(wagmiConfig);
        } catch {
          const msg = "Please switch to the Base network in your wallet and try again";
          setError(msg);
          setStep("error");
          return { payload: null, error: msg };
        }
        if (!walletClient) {
          const msg = "Could not get wallet. Please reconnect.";
          setError(msg);
          setStep("error");
          return { payload: null, error: msg };
        }

        // Checksummed once — `address` now comes from the chain-agnostic wallet
        // facade as a plain string, and viem wants a branded `0x${string}`.
        const from = getAddress(address);

        const nonce = createNonce();
        const now = Math.floor(Date.now() / 1000);
        const validAfter = now - 600;
        const validBefore = now + (requirements.maxTimeoutSeconds || 300);
        const chainId = requiredChainId;

        const domain = {
          name: requirements.extra?.name || "USD Coin",
          version: requirements.extra?.version || "2",
          chainId,
          verifyingContract: getAddress(requirements.asset || USDC_BASE),
        } as const;

        const message = {
          from,
          to: getAddress(requirements.payTo),
          value: BigInt(requirements.amount),
          validAfter: BigInt(validAfter),
          validBefore: BigInt(validBefore),
          nonce,
        };

        // Race the wallet signature against a timeout — some wallets leave the
        // promise pending if the user dismisses a flagged/blocked request
        // (e.g. the Blockaid warning) instead of explicitly rejecting, which
        // would otherwise hang the whole flow.
        const signature = await Promise.race([
          walletClient.signTypedData({
            account: from,
            domain,
            types: authorizationTypes,
            primaryType: "TransferWithAuthorization",
            message,
          }),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Wallet signature timed out — please try again.")), 120_000),
          ),
        ]);

        const payload = {
          x402Version: 2,
          resource: resource || {
            url: "https://franklin.run/api/blockrun/v1/chat/completions",
            description: "Franklin web playground",
            mimeType: "application/json",
          },
          accepted: {
            scheme: requirements.scheme,
            network: requirements.network,
            amount: requirements.amount,
            asset: getAddress(requirements.asset),
            payTo: getAddress(requirements.payTo),
            maxTimeoutSeconds: requirements.maxTimeoutSeconds || 300,
            extra: requirements.extra,
          },
          payload: {
            signature,
            authorization: {
              from,
              to: getAddress(requirements.payTo),
              value: requirements.amount,
              validAfter: validAfter.toString(),
              validBefore: validBefore.toString(),
              nonce,
            },
          },
          extensions: {},
        };

        setStep("done");
        return { payload: btoa(JSON.stringify(payload)), error: null };
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Signing failed";
        setError(msg);
        setStep("error");
        return { payload: null, error: msg };
      }
    },
    [address, isConnected, canPay, chain, solanaSigner, switchChainAsync],
  );

  const makePayment = useCallback(
    async (
      requirements: X402Response,
    ): Promise<{ payload: string | null; error: string | null }> => {
      const paymentReq = selectRequirement(requirements.accepts ?? [], chain);
      if (!paymentReq) {
        const msg = requirements.accepts?.length
          ? "This request can't be paid from the connected wallet's network."
          : "No payment requirements found";
        setError(msg);
        setStep("error");
        return { payload: null, error: msg };
      }
      return createPayment(paymentReq, requirements.resource, requirements.extensions);
    },
    [createPayment, chain],
  );

  return { isConnected, step, error, makePayment, createPayment, reset };
}

// Parse x402 requirements from a 402 response's header (base64-encoded JSON).
export function parseX402FromResponse(response: Response): X402Response | null {
  const paymentRequired =
    response.headers.get("payment-required") ||
    response.headers.get("X-Payment-Required");
  if (!paymentRequired) return null;
  try {
    return JSON.parse(atob(paymentRequired));
  } catch {
    return null;
  }
}
