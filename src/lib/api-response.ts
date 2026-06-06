import { NextResponse } from "next/server";

// Shared response helpers for the authenticated /api/try/* routes.
//
// Every response carries `Cache-Control: private, no-store` + `Vary: Cookie`.
// Next route handlers set NO cache headers by default, so once a CDN fronts the
// app a shared cache could key a per-wallet response by URL alone and serve one
// wallet's conversation history (inlined images included) to another. These
// headers make every /api/try/* payload uncacheable by shared caches.
const PRIVATE_HEADERS = {
  "Cache-Control": "private, no-store",
  Vary: "Cookie",
} as const;

export function jsonPrivate(body: unknown, init?: { status?: number }): NextResponse {
  return NextResponse.json(body, { status: init?.status ?? 200, headers: PRIVATE_HEADERS });
}

export function notSignedIn(): NextResponse {
  return jsonPrivate({ error: "Not signed in" }, { status: 401 });
}

// Log the real error server-side; return a generic message. Raw store errors
// (GCS SDK) can embed bucket names, the project id, and object paths that carry
// the wallet address — never surface those to the client.
export function storeError(e: unknown): NextResponse {
  console.error("[api/try] store error:", e);
  return jsonPrivate({ error: "Store error" }, { status: 500 });
}
