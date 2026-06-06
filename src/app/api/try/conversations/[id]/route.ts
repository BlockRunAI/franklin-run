import { NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/session";
import {
  saveConversation,
  deleteConversation,
  getConversation,
  normalizeConversation,
  isValidConversationId,
  ValidationError,
  MAX_CONVERSATION_BYTES,
} from "@/lib/franklin-store";
import { jsonPrivate, notSignedIn, storeError } from "@/lib/api-response";

function wallet(req: NextRequest): string | null {
  return verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);
}

function badId() {
  return jsonPrivate({ error: "Invalid id" }, { status: 400 });
}

// Fetch one full conversation (messages included) — pairs with the `?meta=1`
// list so clients lazy-load a conversation only when it's opened.
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const addr = wallet(req);
  if (!addr) return notSignedIn();
  const { id } = await params;
  if (!isValidConversationId(id)) return badId();
  try {
    const conversation = await getConversation(addr, id);
    if (!conversation) return jsonPrivate({ error: "Not found" }, { status: 404 });
    return jsonPrivate({ conversation });
  } catch (e) {
    return storeError(e);
  }
}

// Upsert a conversation for the signed-in wallet.
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const addr = wallet(req);
  if (!addr) return notSignedIn();
  const { id } = await params;
  if (!isValidConversationId(id)) return badId();

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return jsonPrivate({ error: "Bad request" }, { status: 400 });
  }
  if (!raw || typeof raw !== "object" || (raw as { id?: unknown }).id !== id) {
    return jsonPrivate({ error: "ID mismatch" }, { status: 400 });
  }

  let convo;
  try {
    convo = normalizeConversation(raw, id);
  } catch (e) {
    if (e instanceof ValidationError) return jsonPrivate({ error: e.message }, { status: 400 });
    throw e;
  }
  if (Buffer.byteLength(JSON.stringify(convo)) > MAX_CONVERSATION_BYTES) {
    return jsonPrivate({ error: "Conversation too large" }, { status: 413 });
  }

  try {
    await saveConversation(addr, convo);
    return jsonPrivate({ ok: true });
  } catch (e) {
    return storeError(e);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const addr = wallet(req);
  if (!addr) return notSignedIn();
  const { id } = await params;
  if (!isValidConversationId(id)) return badId();
  try {
    await deleteConversation(addr, id);
    return jsonPrivate({ ok: true });
  } catch (e) {
    return storeError(e);
  }
}
