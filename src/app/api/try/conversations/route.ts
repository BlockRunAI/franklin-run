import { NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/session";
import { listConversations, listConversationMeta } from "@/lib/franklin-store";
import { jsonPrivate, notSignedIn, storeError } from "@/lib/api-response";

// List the signed-in wallet's conversations. Address comes from the verified
// session token only — never from the client.
//
// `?meta=1` (or `?meta=true`) returns lightweight metadata only
// (id/title/timestamps/count) so a client can render the conversation list
// without downloading every message + inlined image, then lazy-load a single
// conversation via GET [id]. Without the flag it returns full conversations
// (backward compatible).
//
// `?limit=N` (1..200) returns only the N most-recently-updated items, bounding
// the response size. Pagination fields stay top-level (never nested under
// `meta`, which is a stable boolean discriminator).
export async function GET(req: NextRequest) {
  const wallet = verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);
  if (!wallet) return notSignedIn();

  const metaFlag = req.nextUrl.searchParams.get("meta");
  const meta = metaFlag === "1" || metaFlag === "true";

  const limitRaw = req.nextUrl.searchParams.get("limit");
  const limitNum = limitRaw ? parseInt(limitRaw, 10) : NaN;
  const limit = Number.isFinite(limitNum) && limitNum > 0 ? Math.min(limitNum, 200) : null;

  try {
    if (meta) {
      let conversations = await listConversationMeta(wallet);
      if (limit) conversations = conversations.slice(0, limit);
      return jsonPrivate({ conversations, meta: true });
    }
    let conversations = await listConversations(wallet);
    if (limit) conversations = conversations.slice(0, limit);
    return jsonPrivate({ conversations });
  } catch (e) {
    return storeError(e);
  }
}
