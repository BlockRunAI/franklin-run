"use client";

import {
  appendTransactionMessageInstructions,
  address as toAddress,
  createTransactionMessage,
  getBase64EncodedWireTransaction,
  partiallySignTransactionMessageWithSigners,
  pipe,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
  type Blockhash,
  type TransactionSigner,
} from "@solana/kit";
import {
  getSetComputeUnitLimitInstruction,
  getSetComputeUnitPriceInstruction,
} from "@solana-program/compute-budget";
import { findAssociatedTokenPda, getTransferCheckedInstruction, TOKEN_PROGRAM_ADDRESS } from "@solana-program/token";
import { USDC_SOLANA_MINT } from "./solana-config";

// Solana half of the x402 client. The EVM half signs an EIP-3009 authorization
// and hands over a signature; here the payer signs an entire SPL transfer
// transaction that BlockRun's facilitator (PayAI) co-signs as fee payer and
// submits. That is what makes it gasless — the wallet never needs SOL.
//
// The transaction shape is NOT ours to choose: the facilitator verifies it
// against what it expects to see. This mirrors createSolanaPaymentPayload() in
// blockrun-llm-ts/src/x402.ts, which is the reference implementation for the
// same rail. Keep the two in step.

const USDC_DECIMALS = 6;

// Matches @x402/svm, which the facilitator's verifier is built around: compute
// unit limit first, then price, then the transfer.
const COMPUTE_UNIT_LIMIT = 8_000;
const BASE_COMPUTE_UNIT_PRICE = 1;

/**
 * How far the priority fee may be nudged to make two otherwise identical
 * payments distinguishable. Two payments sharing a blockhash AND the same
 * amount compile to a byte-identical message; ed25519 is deterministic, so they
 * produce the same signature and Solana rejects the second as already
 * processed. Two same-priced calls in a row is an entirely ordinary chat
 * pattern, so this is a real case, not a theoretical one.
 *
 * Each step is +1 microLamport/CU over 8000 CU = 0.008 lamports, and the fee
 * payer is the facilitator, so the whole range costs the user nothing.
 */
const MAX_FEE_NONCE_STEPS = 64;

/** Serialized transactions already emitted, keyed by the blockhash they used. */
const issuedByBlockhash = new Map<string, Set<string>>();

/** How many blockhashes keep a duplicate-guard record. */
const MAX_TRACKED_BLOCKHASHES = 8;

function issuedFor(blockhash: string): Set<string> {
  let issued = issuedByBlockhash.get(blockhash);
  if (!issued) {
    issued = new Set();
    issuedByBlockhash.set(blockhash, issued);
    // A blockhash expires in ~60s, so anything built against an older one can
    // no longer land regardless of what this map says. Trimming the OLDEST is
    // what makes the bound safe: the blockhash being paid against right now is
    // the one just inserted, so it is never the entry dropped.
    while (issuedByBlockhash.size > MAX_TRACKED_BLOCKHASHES) {
      const oldest = issuedByBlockhash.keys().next().value;
      if (oldest === undefined) break;
      issuedByBlockhash.delete(oldest);
    }
  }
  return issued;
}

/** Test seam: drop cached state so a test starts from a cold module. */
export function __resetSolanaPaymentCache(): void {
  issuedByBlockhash.clear();
}

export interface SolanaPaymentRequirement {
  scheme: string;
  network: string;
  asset: string;
  amount: string;
  payTo: string;
  maxTimeoutSeconds?: number;
  extra?: Record<string, unknown>;
}

export class SolanaPaymentError extends Error {}

/**
 * Builds and signs the base64 `X-Payment` payload for a Solana x402 offer.
 *
 * @param signer   The connected wallet, as a Kit signer. Signs only as the
 *                 transfer authority — the fee payer is the facilitator.
 * @param req      The `accepts` entry selected for this chain.
 * @param resource The `resource` block from the 402, echoed back verbatim.
 */
export async function createSolanaPaymentPayload(
  signer: TransactionSigner,
  req: SolanaPaymentRequirement,
  resource: { url: string; description?: string; mimeType?: string },
  extensions?: Record<string, unknown>,
): Promise<string> {
  const feePayer = typeof req.extra?.feePayer === "string" ? req.extra.feePayer : undefined;
  if (!feePayer) {
    throw new SolanaPaymentError(
      "This payment is missing its fee payer, so it can't be signed. Try again in a moment.",
    );
  }
  // BlockRun stamps a *finalized* blockhash into the 402 precisely so the
  // client doesn't need an RPC round trip on the critical path. A `confirmed`
  // hash races the facilitator's own RPC pool and settles as BlockhashNotFound,
  // so never substitute one — if the field is absent, fail loudly instead.
  const blockhash = typeof req.extra?.recentBlockhash === "string" ? req.extra.recentBlockhash : undefined;
  const lastValidBlockHeight =
    typeof req.extra?.lastValidBlockHeight === "string" ? req.extra.lastValidBlockHeight : undefined;
  if (!blockhash || !lastValidBlockHeight) {
    throw new SolanaPaymentError(
      "This payment is missing its blockhash, so it can't be signed. Try again in a moment.",
    );
  }

  const mint = toAddress(req.asset || USDC_SOLANA_MINT);
  // Both ATAs are pure PDA derivations — no RPC. The payer's must already
  // exist (the facilitator does not create one), which it will for any wallet
  // holding USDC; the balance hook is what tells the user if it doesn't.
  const [source] = await findAssociatedTokenPda({
    owner: signer.address,
    mint,
    tokenProgram: TOKEN_PROGRAM_ADDRESS,
  });
  const [destination] = await findAssociatedTokenPda({
    owner: toAddress(req.payTo),
    mint,
    tokenProgram: TOKEN_PROGRAM_ADDRESS,
  });

  const transfer = getTransferCheckedInstruction({
    source,
    mint,
    destination,
    authority: signer,
    amount: BigInt(req.amount),
    decimals: USDC_DECIMALS,
  });

  const build = async (unitPrice: number): Promise<string> => {
    const message = pipe(
      createTransactionMessage({ version: 0 }),
      // The facilitator pays, not us — which is exactly why the signing below
      // has to be *partial*: the fee payer's signature slot stays empty.
      (m) => setTransactionMessageFeePayer(toAddress(feePayer), m),
      (m) =>
        setTransactionMessageLifetimeUsingBlockhash(
          {
            blockhash: blockhash as Blockhash,
            lastValidBlockHeight: BigInt(lastValidBlockHeight),
          },
          m,
        ),
      (m) =>
        appendTransactionMessageInstructions(
          [
            getSetComputeUnitLimitInstruction({ units: COMPUTE_UNIT_LIMIT }),
            getSetComputeUnitPriceInstruction({ microLamports: unitPrice }),
            transfer,
          ],
          m,
        ),
    );
    return getBase64EncodedWireTransaction(await partiallySignTransactionMessageWithSigners(message));
  };

  // Step 0 is the default price, so the ordinary case is one signature and no
  // retry. Only a genuine collision walks the range.
  const issued = issuedFor(blockhash);
  let transaction: string | null = null;
  for (let step = 0; step <= MAX_FEE_NONCE_STEPS; step++) {
    const candidate = await build(BASE_COMPUTE_UNIT_PRICE + step);
    if (!issued.has(candidate)) {
      transaction = candidate;
      break;
    }
  }
  if (transaction === null) {
    // Never emit bytes we know Solana will reject as already-processed — the
    // error it returns explains nothing.
    throw new SolanaPaymentError(
      "Too many identical payments in a row — wait a few seconds and try again.",
    );
  }
  issued.add(transaction);

  const payload = {
    x402Version: 2,
    resource,
    // Singular `accepted` — the offer we chose, echoed back. The gateway reads
    // the amount from here to bind the quote, so it must match what was signed.
    accepted: {
      scheme: req.scheme,
      network: req.network,
      amount: req.amount,
      asset: req.asset,
      payTo: req.payTo,
      maxTimeoutSeconds: req.maxTimeoutSeconds ?? 300,
      extra: req.extra,
    },
    payload: { transaction },
    ...(extensions !== undefined ? { extensions } : {}),
  };

  return btoa(JSON.stringify(payload));
}
