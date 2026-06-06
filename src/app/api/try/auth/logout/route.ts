import { SESSION_COOKIE } from "@/lib/session";
import { jsonPrivate } from "@/lib/api-response";

export async function POST() {
  const res = jsonPrivate({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
