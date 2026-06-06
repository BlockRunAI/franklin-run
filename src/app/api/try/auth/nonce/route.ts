import { randomNonce, NONCE_COOKIE } from "@/lib/session";
import { jsonPrivate } from "@/lib/api-response";

// Issues a login nonce, stashed in a short-lived httpOnly cookie. The client
// includes it in the signed message; /verify checks they match (anti-replay).
// jsonPrivate's `no-store` is load-bearing here: a shared cache must never reuse
// one user's nonce for another, or the anti-replay guarantee collapses.
export async function GET() {
  const nonce = randomNonce();
  const res = jsonPrivate({ nonce });
  res.cookies.set(NONCE_COOKIE, nonce, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return res;
}
