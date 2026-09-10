import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

export const ACCOUNT_COOKIE = "franklin_blockrun_account";
export const LOGIN_COOKIE = "franklin_blockrun_login";
export const BLOCKRUN_PORTAL = "https://user.blockrun.ai";
export const BLOCKRUN_CREDIT_API = "https://api.blockrun.ai/";
export const ACCOUNT_CALLBACK = "https://franklin.run/api/try/account/callback";
export const ACCOUNT_CLIENT = "franklin-web";
export interface AccountSession { accessToken: string; email: string; exp: number }
export interface LoginState { state: string; verifier: string; exp: number }
function key(): Buffer {
  const secret = process.env.SESSION_SECRET;
  if (!secret || Buffer.byteLength(secret) < 32) throw new Error("SESSION_SECRET must be at least 32 bytes for account login");
  return createHash("sha256").update(`franklin-blockrun-account:${secret}`).digest();
}
export function sealAccountData(value: AccountSession | LoginState): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(value)), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), ciphertext]).toString("base64url");
}
function unseal(value: string | undefined): Record<string, unknown> | null {
  if (!value || value.length > 4096) return null;
  try {
    const raw = Buffer.from(value, "base64url");
    const decipher = createDecipheriv("aes-256-gcm", key(), raw.subarray(0, 12));
    decipher.setAuthTag(raw.subarray(12, 28));
    const data = JSON.parse(Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()]).toString());
    return data && typeof data.exp === "number" && data.exp > Date.now() ? data : null;
  } catch { return null; }
}
export function readAccountSession(value: string | undefined): AccountSession | null {
  const d = unseal(value);
  return d && typeof d.accessToken === "string" && /^brk_[A-Za-z0-9_]{20,200}$/.test(d.accessToken) && typeof d.email === "string" ? d as unknown as AccountSession : null;
}
export function readLoginState(value: string | undefined): LoginState | null {
  const d = unseal(value);
  return d && typeof d.state === "string" && typeof d.verifier === "string" ? d as unknown as LoginState : null;
}
export const accountCookieOptions = { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" };
export function accountOriginAllowed(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (origin === "https://franklin.run") return true;
  if (!origin && request.headers.get("sec-fetch-site") === "same-origin") return true;
  return process.env.NODE_ENV !== "production" && origin === new URL(request.url).origin;
}
