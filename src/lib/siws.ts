import bs58 from "bs58";
import {
  createSignInMessage,
  parseSignInMessage,
  verifyMessageSignature,
} from "@solana/wallet-standard-util";

// Server-side Sign In With Solana verification — the Solana counterpart to the
// viem `recoverMessageAddress` path used for SIWE.
//
// Deliberately does NOT call the library's `verifySignIn(input, output)`. That
// helper requires the caller to reproduce the *exact* input the wallet was
// given, field for field (statement, uri, version, issuedAt, …). Wallets fill
// in several of those themselves, so reproducing them server-side is brittle
// and fails open on a mismatch we don't care about. Instead we parse what the
// wallet actually signed, assert the three fields that carry the security
// (domain, address, nonce), and then verify the bytes.

/** What the browser sends up — Uint8Arrays don't survive JSON, so both are base64. */
export interface SiwsProof {
  signedMessage: string;
  signature: string;
}

export type SiwsFailure =
  | "BAD_ENCODING"
  | "BAD_MESSAGE"
  | "DOMAIN_MISMATCH"
  | "ADDRESS_MISMATCH"
  | "NONCE_MISMATCH"
  | "STALE"
  | "BAD_SIGNATURE";

// The wallet stamps `Issued At` itself; reject anything wildly out of step with
// our clock so a signature captured long ago can't be replayed after the nonce
// cookie has cycled. Generous enough to absorb ordinary clock skew.
const MAX_AGE_MS = 10 * 60 * 1000;
const MAX_SKEW_MS = 5 * 60 * 1000;

function fromBase64(s: string): Uint8Array {
  return new Uint8Array(Buffer.from(s, "base64"));
}

/**
 * The domain the message must be bound to. Pinned rather than read off the
 * request's Host header: SIWS domain binding exists precisely to stop a
 * signature farmed on an attacker's origin from being replayed here, and a
 * caller-controlled Host would hand that guarantee straight back.
 */
export function expectedSiwsDomain(): string {
  if (process.env.SIWS_DOMAIN) return process.env.SIWS_DOMAIN;
  return process.env.NODE_ENV === "production" ? "franklin.run" : "localhost:3000";
}

/**
 * Verifies a SIWS proof against the claimed address and the nonce we issued.
 * Returns null on success, or the reason it failed.
 */
export function verifySiws(args: {
  address: string;
  proof: SiwsProof;
  nonce: string;
  domain: string;
}): SiwsFailure | null {
  const { address, proof, nonce, domain } = args;

  let signedMessage: Uint8Array;
  let signature: Uint8Array;
  let publicKey: Uint8Array;
  try {
    signedMessage = fromBase64(proof.signedMessage);
    signature = fromBase64(proof.signature);
    // Derive the key from the *claimed* address rather than trusting a
    // client-supplied public key, so the signature has to verify against the
    // identity the session will actually be minted for.
    publicKey = bs58.decode(address);
  } catch {
    return "BAD_ENCODING";
  }
  if (publicKey.length !== 32 || signature.length !== 64) return "BAD_ENCODING";

  const parsed = parseSignInMessage(signedMessage);
  if (!parsed) return "BAD_MESSAGE";
  if (parsed.domain !== domain) return "DOMAIN_MISMATCH";
  if (parsed.address !== address) return "ADDRESS_MISMATCH";
  if (!parsed.nonce || parsed.nonce !== nonce) return "NONCE_MISMATCH";

  if (!parsed.issuedAt) return "STALE";
  const issuedAt = Date.parse(parsed.issuedAt);
  if (!Number.isFinite(issuedAt)) return "STALE";
  const age = Date.now() - issuedAt;
  if (age > MAX_AGE_MS || age < -MAX_SKEW_MS) return "STALE";

  // Re-serialising the parsed fields and requiring byte equality (which
  // verifyMessageSignature checks before the ed25519 check) closes the gap
  // between "the parser saw X" and "the wallet signed X" — a message that only
  // parses to these fields under a non-canonical spelling is rejected.
  const canonical = createSignInMessage(parsed);
  const ok = verifyMessageSignature({
    message: canonical,
    signedMessage,
    signature,
    publicKey,
  });
  return ok ? null : "BAD_SIGNATURE";
}
