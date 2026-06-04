import { NextRequest, NextResponse } from "next/server";
import { saveShare, type SharedMessage } from "@/lib/share-store";

// Public "copy link" endpoint. The desktop app has a local wallet but no web
// session cookie, so creating a share is unauthenticated — anyone running
// Franklin can publish a snapshot. The id is unguessable (~96 bits) and the
// snapshot is immutable, so "open create" is acceptable: you can only ever read
// what you were handed a link to. (Add rate-limiting before a public launch.)

const MAX_MESSAGES = 200;
const MAX_BYTES = 2 * 1024 * 1024; // 2 MB — a snapshot with inline data: images

// Allow cross-origin from the Electron renderer (file:// → origin "null", or
// localhost in dev). Snapshot create is public + non-credentialed, so * is fine.
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function POST(req: NextRequest) {
  let body: { title?: string; messages?: SharedMessage[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400, headers: CORS });
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  if (messages.length === 0) {
    return NextResponse.json({ error: "No messages" }, { status: 400, headers: CORS });
  }
  if (messages.length > MAX_MESSAGES) {
    return NextResponse.json({ error: "Too many messages" }, { status: 413, headers: CORS });
  }
  if (Buffer.byteLength(JSON.stringify(messages), "utf8") > MAX_BYTES) {
    return NextResponse.json({ error: "Conversation too large to share" }, { status: 413, headers: CORS });
  }

  // Keep only the fields a public render needs; drop anything non-shareable.
  const clean: SharedMessage[] = messages
    .filter((m) => m && (m.role === "user" || m.role === "assistant"))
    .map((m) => {
      const out: SharedMessage = { role: m.role, content: String(m.content ?? "") };
      if (m.kind) out.kind = m.kind;
      // Only inline data: images travel; local 127.0.0.1 media is dropped.
      if (m.image && m.image.startsWith("data:")) out.image = m.image;
      // Tool-call activity travels (capped) so the share reproduces tool usage.
      if (m.kind === "tools" && Array.isArray(m.tools)) {
        out.tools = m.tools.slice(0, 50).map((s) => ({
          label: String(s?.label ?? "").slice(0, 120),
          ...(s?.detail ? { detail: String(s.detail).slice(0, 200) } : {}),
        }));
      }
      return out;
    });

  try {
    const id = await saveShare({ title: String(body.title ?? "Franklin chat"), messages: clean });
    const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://franklin.run";
    return NextResponse.json({ id, url: `${origin}/s/${id}` }, { headers: CORS });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Store error" },
      { status: 500, headers: CORS },
    );
  }
}
