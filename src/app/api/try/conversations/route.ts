import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/session";
import { listConversations } from "@/lib/franklin-store";

// List the signed-in wallet's conversations. Address comes from the verified
// session token only — never from the client.
export async function GET(req: NextRequest) {
  const wallet = verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);
  if (!wallet) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  try {
    const conversations = await listConversations(wallet);
    return NextResponse.json({ conversations });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Store error" }, { status: 500 });
  }
}
