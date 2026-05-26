import { NextRequest, NextResponse } from "next/server";
import { recoverMessageAddress } from "viem";
import { createSessionToken, SESSION_COOKIE, NONCE_COOKIE } from "@/lib/session";

// Verifies a wallet login: the signed message must carry the nonce we issued,
// and the signature must recover to the claimed address. On success we set a
// session cookie. EOA (MetaMask) signatures only.
export async function POST(req: NextRequest) {
  let body: { address?: string; message?: string; signature?: `0x${string}` };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  const { address, message, signature } = body;
  if (!address || !message || !signature) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const nonce = req.cookies.get(NONCE_COOKIE)?.value;
  if (!nonce || !message.includes(nonce)) {
    return NextResponse.json({ error: "Invalid or expired nonce" }, { status: 401 });
  }

  let recovered: string;
  try {
    recovered = await recoverMessageAddress({ message, signature });
  } catch {
    return NextResponse.json({ error: "Bad signature" }, { status: 401 });
  }
  if (recovered.toLowerCase() !== address.toLowerCase()) {
    return NextResponse.json({ error: "Signature does not match address" }, { status: 401 });
  }

  const res = NextResponse.json({ address: recovered.toLowerCase() });
  res.cookies.set(SESSION_COOKIE, createSessionToken(recovered), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  });
  res.cookies.set(NONCE_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
