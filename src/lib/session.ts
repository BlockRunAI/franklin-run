import crypto from "node:crypto";
import bs58 from "bs58";

// Stateless session token for the /try wallet login. A compact HMAC-signed
// token (no DB needed): base64url(payload).base64url(hmac). Carries the
// verified wallet address + chain + expiry. Mirrors a JWT but dependency-free.

const DEV_SECRET = "dev-insecure-secret-change-me";
const TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days

// Fail closed in production: a missing/empty SESSION_SECRET would otherwise fall
// back to a publicly-known key, letting anyone forge a session for any wallet.
// Resolved lazily (not at module load) so `next build` — which evaluates route
// modules with NODE_ENV=production but no runtime env — doesn't throw; the
// guard fires on the first real sign/verify at request time instead.
function getSecret(): string {
  const s = process.env.SESSION_SECRET;
  if (process.env.NODE_ENV === "production" && !s) {
    throw new Error("SESSION_SECRET must be set in production (see .env.example).");
  }
  return s || DEV_SECRET;
}

export const SESSION_COOKIE = "franklin_try_session";
export const NONCE_COOKIE = "franklin_try_nonce";

// Bind tokens to this app so an HMAC blob minted elsewhere with the same
// SESSION_SECRET can't be replayed here. Legacy tokens (no `aud`) are still
// accepted so existing sessions don't get logged out on deploy.
const AUDIENCE = "franklin-try";

export type WalletChain = "evm" | "solana";

const EVM_ADDRESS = /^0x[0-9a-f]{40}$/;
// Base58, case-significant. Validated here rather than imported from
// solana-config.ts so this module stays free of client-side Kit imports.
const SOLANA_ADDRESS = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

export interface Session {
  chain: WalletChain;
  address: string;
  /**
   * Collision-free, lowercase-safe key for the conversation store. Pass this —
   * never the raw address — to franklin-store, whose safeWallet() lowercases
   * and strips to [a-z0-9]. That transform is injective for EVM hex but NOT for
   * base58, where two addresses differing only in case are different accounts
   * that would otherwise share a namespace.
   */
  storageKey: string;
}

interface Payload {
  address: string;
  exp: number;
  aud?: string;
  /** Absent on tokens minted before multi-chain login — those are EVM. */
  chain?: WalletChain;
}

function b64url(buf: Buffer | string): string {
  return Buffer.from(buf).toString("base64url");
}

function sign(data: string): string {
  return crypto.createHmac("sha256", getSecret()).update(data).digest("base64url");
}

// EVM keeps its historical key (the lowercase address itself) so existing
// stored conversations stay reachable. Solana hex-encodes the 32-byte public
// key: lowercase, alphanumeric, and injective, so case survives the trip
// through safeWallet(). The "sol" prefix cannot collide with an EVM key, which
// always starts "0x".
function storageKeyFor(chain: WalletChain, address: string): string {
  if (chain === "evm") return address.toLowerCase();
  return `sol${Buffer.from(bs58.decode(address)).toString("hex")}`;
}

function normalize(chain: WalletChain, address: string): string | null {
  if (chain === "evm") {
    const addr = address.toLowerCase();
    return EVM_ADDRESS.test(addr) ? addr : null;
  }
  // No case folding — base58 is case-significant.
  if (!SOLANA_ADDRESS.test(address)) return null;
  try {
    // Reject anything that isn't a real 32-byte public key; storageKeyFor
    // decodes it again and must not throw at storage time.
    if (bs58.decode(address).length !== 32) return null;
  } catch {
    return null;
  }
  return address;
}

export function createSessionToken(chain: WalletChain, address: string): string {
  const addr = normalize(chain, address);
  if (!addr) throw new Error(`Invalid ${chain} address for session token`);
  const payload: Payload = {
    address: addr,
    chain,
    exp: Math.floor(Date.now() / 1000) + TTL_SECONDS,
    aud: AUDIENCE,
  };
  const body = b64url(JSON.stringify(payload));
  return `${body}.${sign(body)}`;
}

// Returns the verified session or null. Uses a constant-time signature compare.
export function verifySessionToken(token: string | undefined): Session | null {
  if (!token) return null;
  const [body, mac] = token.split(".");
  if (!body || !mac) return null;
  const expected = sign(body);
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as Payload;
    // exp must be a real number — a missing/NaN exp must NOT read as
    // never-expiring (NaN comparisons are always false).
    if (typeof payload.exp !== "number" || !Number.isFinite(payload.exp)) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    if (payload.aud !== undefined && payload.aud !== AUDIENCE) return null;
    if (typeof payload.address !== "string") return null;
    const chain: WalletChain = payload.chain ?? "evm";
    if (chain !== "evm" && chain !== "solana") return null;
    const address = normalize(chain, payload.address);
    if (!address) return null;
    return { chain, address, storageKey: storageKeyFor(chain, address) };
  } catch {
    return null;
  }
}

export function randomNonce(): string {
  return crypto.randomBytes(16).toString("hex");
}
