import { NextRequest } from "next/server";
import { ACCOUNT_COOKIE, BLOCKRUN_PORTAL, accountCookieOptions, accountOriginAllowed, readAccountSession } from "@/lib/blockrun-account";
import { jsonPrivate } from "@/lib/api-response";
export async function POST(req: NextRequest) {
  if (!accountOriginAllowed(req)) return jsonPrivate({ error: "Invalid origin" }, { status: 403 });
  const session = readAccountSession(req.cookies.get(ACCOUNT_COOKIE)?.value);
  if (session) {
    try {
      const r = await fetch(`${BLOCKRUN_PORTAL}/api/franklin/revoke`, { method: "POST", headers: { Authorization: `Bearer ${session.accessToken}` }, redirect: "error", signal: AbortSignal.timeout(10_000) });
      if (!r.ok) return jsonPrivate({ error: "Could not disconnect. Please retry." }, { status: 502 });
    } catch { return jsonPrivate({ error: "Could not disconnect. Please retry." }, { status: 502 }); }
  }
  const r = jsonPrivate({ ok: true });
  r.cookies.set(ACCOUNT_COOKIE, "", { ...accountCookieOptions, maxAge: 0 });
  return r;
}
