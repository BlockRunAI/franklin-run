import { NextResponse } from "next/server";
import { randomNonce, NONCE_COOKIE } from "@/lib/session";

// Issues a login nonce, stashed in a short-lived httpOnly cookie. The client
// includes it in the signed message; /verify checks they match (anti-replay).
export async function GET() {
  const nonce = randomNonce();
  const res = NextResponse.json({ nonce });
  res.cookies.set(NONCE_COOKIE, nonce, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return res;
}
