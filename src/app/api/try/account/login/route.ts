import { randomBytes, createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { ACCOUNT_CALLBACK, ACCOUNT_CLIENT, BLOCKRUN_PORTAL, LOGIN_COOKIE, accountCookieOptions, sealAccountData } from "@/lib/blockrun-account";
export async function GET(req: NextRequest) {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (process.env.NODE_ENV === "production" && host && host !== "franklin.run") {
    return NextResponse.redirect("https://franklin.run/api/try/account/login", { headers: { "Cache-Control": "no-store" } });
  }
  const state = randomBytes(32).toString("base64url");
  const verifier = randomBytes(32).toString("base64url");
  try {
    const sealed = sealAccountData({ state, verifier, exp: Date.now() + 600_000 });
    const url = new URL("/api/franklin/authorize", BLOCKRUN_PORTAL);
    url.search = new URLSearchParams({ client_id: ACCOUNT_CLIENT, redirect_uri: ACCOUNT_CALLBACK, response_type: "code", state, code_challenge_method: "S256", code_challenge: createHash("sha256").update(verifier).digest("base64url") }).toString();
    const response = NextResponse.redirect(url, { headers: { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" } });
    response.cookies.set(LOGIN_COOKIE, sealed, { ...accountCookieOptions, maxAge: 600 });
    return response;
  } catch { return NextResponse.redirect("https://franklin.run/chat?account_error=unavailable"); }
}
