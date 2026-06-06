import crypto from "node:crypto";

// Stateless session token for the /try wallet login. A compact HMAC-signed
// token (no DB needed): base64url(payload).base64url(hmac). Carries the
// verified wallet address + expiry. Mirrors a JWT but dependency-free.

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
const EVM_ADDRESS = /^0x[0-9a-f]{40}$/;

interface Payload {
  address: string;
  exp: number;
  aud?: string;
}

function b64url(buf: Buffer | string): string {
  return Buffer.from(buf).toString("base64url");
}

function sign(data: string): string {
  return crypto.createHmac("sha256", getSecret()).update(data).digest("base64url");
}

export function createSessionToken(address: string): string {
  const addr = address.toLowerCase();
  // Only mint for a well-formed EVM address. safeWallet() in franklin-store
  // assumes this shape (lowercase hex is collision-free under its char strip);
  // a future multi-chain login must not silently share a storage namespace.
  if (!EVM_ADDRESS.test(addr)) throw new Error("Invalid EVM address for session token");
  const payload: Payload = { address: addr, exp: Math.floor(Date.now() / 1000) + TTL_SECONDS, aud: AUDIENCE };
  const body = b64url(JSON.stringify(payload));
  return `${body}.${sign(body)}`;
}

// Returns the verified address or null. Uses a constant-time signature compare.
export function verifySessionToken(token: string | undefined): string | null {
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
    if (typeof payload.address !== "string" || !EVM_ADDRESS.test(payload.address)) return null;
    return payload.address;
  } catch {
    return null;
  }
}

export function randomNonce(): string {
  return crypto.randomBytes(16).toString("hex");
}
