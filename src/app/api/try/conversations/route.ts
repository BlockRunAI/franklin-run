import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/session";
import { listConversations, listConversationMeta } from "@/lib/franklin-store";

// List the signed-in wallet's conversations. Address comes from the verified
// session token only — never from the client.
//
// `?meta=1` returns lightweight metadata only (id/title/timestamps/count) so a
// client can render the conversation list without downloading every message +
// inlined image, then lazy-load a single conversation via GET [id]. Without the
// flag it returns full conversations (backward compatible).
export async function GET(req: NextRequest) {
  const wallet = verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);
  if (!wallet) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const meta = req.nextUrl.searchParams.get("meta") === "1";
  try {
    if (meta) {
      const conversations = await listConversationMeta(wallet);
      return NextResponse.json({ conversations, meta: true });
    }
    const conversations = await listConversations(wallet);
    return NextResponse.json({ conversations });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Store error" }, { status: 500 });
  }
}
