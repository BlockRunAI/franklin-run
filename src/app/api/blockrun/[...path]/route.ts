import { NextRequest } from "next/server";

// Transparent proxy: franklin.run/api/blockrun/<path>  ->  https://blockrun.ai/api/<path>
//
// The /try playground is a browser-wallet client for BlockRun's existing
// x402-paid API (chat / images / videos). Calling blockrun.ai cross-origin
// from the browser would hit CORS and would not expose the 402 "payment-required"
// header, so we forward through this same-origin proxy instead. It passes the
// X-Payment header upstream and relays the payment-required header back to the
// client verbatim — settlement still happens on BlockRun's side, paid to
// BlockRun's configured wallet.

const UPSTREAM = process.env.BLOCKRUN_API_BASE || "https://blockrun.ai/api";

// Headers we forward from the client to BlockRun.
const FORWARD_REQ_HEADERS = ["content-type", "accept", "x-payment", "authorization"];
// Headers we relay from BlockRun back to the client (x402 lives in these).
const FORWARD_RES_HEADERS = [
  "content-type",
  "payment-required",
  "x-payment-required",
  "x-payment-response",
  "cache-control",
];

async function proxy(req: NextRequest, path: string[]) {
  const search = req.nextUrl.search || "";
  const target = `${UPSTREAM}/${path.join("/")}${search}`;

  const headers = new Headers();
  for (const h of FORWARD_REQ_HEADERS) {
    const v = req.headers.get(h);
    if (v) headers.set(h, v);
  }

  const init: RequestInit = { method: req.method, headers };
  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = await req.text();
  }

  let upstream: Response;
  try {
    upstream = await fetch(target, init);
  } catch {
    return new Response(
      JSON.stringify({ error: "Could not reach the Franklin backend. Try again." }),
      { status: 502, headers: { "content-type": "application/json" } },
    );
  }

  const resHeaders = new Headers();
  for (const h of FORWARD_RES_HEADERS) {
    const v = upstream.headers.get(h);
    if (v) resHeaders.set(h, v);
  }

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: resHeaders,
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxy(req, path);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxy(req, path);
}
