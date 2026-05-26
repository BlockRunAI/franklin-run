import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/session";
import { saveConversation, deleteConversation, type StoredConversation } from "@/lib/franklin-store";

function wallet(req: NextRequest): string | null {
  return verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);
}

// Upsert a conversation for the signed-in wallet.
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const addr = wallet(req);
  if (!addr) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const { id } = await params;
  let convo: StoredConversation;
  try {
    convo = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  if (convo.id !== id) return NextResponse.json({ error: "ID mismatch" }, { status: 400 });
  try {
    await saveConversation(addr, convo);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Store error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const addr = wallet(req);
  if (!addr) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const { id } = await params;
  try {
    await deleteConversation(addr, id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Store error" }, { status: 500 });
  }
}
