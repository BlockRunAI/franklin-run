import crypto from "node:crypto";

// Stateless session token for the /try wallet login. A compact HMAC-signed
// token (no DB needed): base64url(payload).base64url(hmac). Carries the
// verified wallet address + expiry. Mirrors a JWT but dependency-free.

const DEV_SECRET = "dev-insecure-secret-change-me";
// Fail closed in production: a missing/empty SESSION_SECRET would otherwise fall
// back to a publicly-known key, letting anyone forge a session for any wallet.
if (process.env.NODE_ENV === "production" && !process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET must be set in production (see .env.example).");
}
const SECRET = process.env.SESSION_SECRET || DEV_SECRET;
const TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days

export const SESSION_COOKIE = "franklin_try_session";
export const NONCE_COOKIE = "franklin_try_nonce";

interface Payload {
  address: string;
  exp: number;
}

function b64url(buf: Buffer | string): string {
  return Buffer.from(buf).toString("base64url");
}

function sign(data: string): string {
  return crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
}

export function createSessionToken(address: string): string {
  const payload: Payload = { address: address.toLowerCase(), exp: Math.floor(Date.now() / 1000) + TTL_SECONDS };
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
    if (!payload.address || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload.address;
  } catch {
    return null;
  }
}

export function randomNonce(): string {
  return crypto.randomBytes(16).toString("hex");
}
