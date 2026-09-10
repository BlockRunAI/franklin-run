import { NextRequest, NextResponse } from "next/server";
import { ACCOUNT_CALLBACK, ACCOUNT_CLIENT, ACCOUNT_COOKIE, BLOCKRUN_PORTAL, LOGIN_COOKIE, accountCookieOptions, readLoginState, sealAccountData } from "@/lib/blockrun-account";
export async function GET(req: NextRequest) {
  const login = readLoginState(req.cookies.get(LOGIN_COOKIE)?.value);
  const code = req.nextUrl.searchParams.get("code");
  const failure = () => {
    const r = NextResponse.redirect("https://franklin.run/chat?account_error=login_failed", { headers: { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" } });
    r.cookies.set(LOGIN_COOKIE, "", { ...accountCookieOptions, maxAge: 0 });
    return r;
  };
  if (!login || login.state !== req.nextUrl.searchParams.get("state") || !code || !/^[A-Za-z0-9_-]{43}$/.test(code)) return failure();
  try {
    const upstream = await fetch(`${BLOCKRUN_PORTAL}/api/franklin/token`, {
      method: "POST", headers: { "Content-Type": "application/json" }, cache: "no-store", redirect: "error", signal: AbortSignal.timeout(15_000),
      body: JSON.stringify({ grant_type: "authorization_code", client_id: ACCOUNT_CLIENT, redirect_uri: ACCOUNT_CALLBACK, code, code_verifier: login.verifier }),
    });
    const d = await upstream.json();
    if (!upstream.ok || typeof d.access_token !== "string" || !/^brk_[A-Za-z0-9_]{20,200}$/.test(d.access_token) || typeof d.email !== "string" || !Number.isFinite(d.expires_in) || d.expires_in <= 0) return failure();
    const maxAge = Math.min(d.expires_in, 8 * 60 * 60);
    const sealed = sealAccountData({ accessToken: d.access_token, email: d.email, exp: Date.now() + maxAge * 1000 });
    const r = NextResponse.redirect("https://franklin.run/chat?account_connected=1", { headers: { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" } });
    r.cookies.set(ACCOUNT_COOKIE, sealed, { ...accountCookieOptions, maxAge });
    r.cookies.set(LOGIN_COOKIE, "", { ...accountCookieOptions, maxAge: 0 });
    return r;
  } catch { return failure(); }
}
