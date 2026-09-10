import { NextRequest } from "next/server";
import { ACCOUNT_COOKIE, BLOCKRUN_CREDIT_API, readAccountSession } from "@/lib/blockrun-account";
import { jsonPrivate } from "@/lib/api-response";
export async function GET(req: NextRequest) {
  const session = readAccountSession(req.cookies.get(ACCOUNT_COOKIE)?.value);
  if (!session) return jsonPrivate({ connected: false });
  try {
    const r = await fetch(new URL("v1/credits", BLOCKRUN_CREDIT_API), { headers: { Authorization: `Bearer ${session.accessToken}` }, cache: "no-store", redirect: "error", signal: AbortSignal.timeout(10_000) });
    if (r.status === 401 || r.status === 403) return jsonPrivate({ connected: false });
    if (!r.ok) return jsonPrivate({ connected: true, email: session.email, remaining: null, unavailable: true });
    const d = await r.json();
    return jsonPrivate({ connected: true, email: session.email, remaining: typeof d.remaining_usd === "number" ? d.remaining_usd : null, blocked: d.blocked === true });
  } catch { return jsonPrivate({ connected: true, email: session.email, remaining: null, unavailable: true }); }
}
