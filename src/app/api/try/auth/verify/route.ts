import { NextRequest } from "next/server";
import { recoverMessageAddress } from "viem";
import {
  createSessionToken,
  SESSION_COOKIE,
  NONCE_COOKIE,
  type WalletChain,
} from "@/lib/session";
import { expectedSiwsDomain, verifySiws, type SiwsProof } from "@/lib/siws";
import { jsonPrivate } from "@/lib/api-response";

// Verifies a wallet login on either chain. In both cases the signed message
// must carry the nonce we issued and the signature must belong to the claimed
// address; on success we set a session cookie.
//
//   evm    — SIWE. EOA (MetaMask) signatures only, recovered with viem.
//   solana — SIWS. Wallet Standard's structured sign-in, verified in siws.ts.
//
// `chain` is optional and defaults to "evm" so a client that predates
// multi-chain login keeps working unchanged.

interface Body {
  chain?: WalletChain;
  address?: string;
  message?: string;
  signature?: `0x${string}`;
  proof?: SiwsProof;
}

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return jsonPrivate({ error: "Bad request" }, { status: 400 });
  }

  const chain: WalletChain = body.chain === "solana" ? "solana" : "evm";
  const { address } = body;
  if (!address) return jsonPrivate({ error: "Missing fields" }, { status: 400 });

  const nonce = req.cookies.get(NONCE_COOKIE)?.value;
  if (!nonce) {
    return jsonPrivate({ error: "Invalid or expired nonce" }, { status: 401 });
  }

  let verified: string;

  if (chain === "solana") {
    const { proof } = body;
    if (!proof?.signedMessage || !proof?.signature) {
      return jsonPrivate({ error: "Missing fields" }, { status: 400 });
    }
    const failure = verifySiws({
      address,
      proof,
      nonce,
      domain: expectedSiwsDomain(),
    });
    if (failure) {
      return jsonPrivate({ error: "Sign-in verification failed", reason: failure }, { status: 401 });
    }
    verified = address;
  } else {
    const { message, signature } = body;
    if (!message || !signature) {
      return jsonPrivate({ error: "Missing fields" }, { status: 400 });
    }
    // The nonce is inside the free-text SIWE message, so it has to be checked
    // here; SIWS carries it as a parsed field and is checked in verifySiws.
    if (!message.includes(nonce)) {
      return jsonPrivate({ error: "Invalid or expired nonce" }, { status: 401 });
    }
    let recovered: string;
    try {
      recovered = await recoverMessageAddress({ message, signature });
    } catch {
      return jsonPrivate({ error: "Bad signature" }, { status: 401 });
    }
    if (recovered.toLowerCase() !== address.toLowerCase()) {
      return jsonPrivate({ error: "Signature does not match address" }, { status: 401 });
    }
    verified = recovered.toLowerCase();
  }

  let token: string;
  try {
    token = createSessionToken(chain, verified);
  } catch {
    return jsonPrivate({ error: "Invalid address" }, { status: 400 });
  }

  const res = jsonPrivate({ address: verified, chain });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  });
  res.cookies.set(NONCE_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
