import { NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/session";
import { jsonPrivate } from "@/lib/api-response";

// Returns the currently signed-in wallet address (or null). Per-cookie response —
// jsonPrivate keeps any shared cache from serving one wallet's address to another.
export async function GET(req: NextRequest) {
  const address = verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);
  return jsonPrivate({ address });
}
