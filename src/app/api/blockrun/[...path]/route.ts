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

// Endpoint allowlist. The proxy is unauthenticated (free models need no wallet),
// so we constrain it to the BlockRun API surface the /try client actually uses.
// path[0] must be "v1" and path[1] one of these — this blocks path-escape
// (encoded "..") to other paths on the upstream host and shrinks the attack
// surface to the known x402 endpoints.
const ALLOWED_ROOTS = new Set([
  "chat", "messages", "images", "videos", "search", "voice", "audio",
  "crypto", "usstock", "fx", "pm", "phone",
]);

function pathAllowed(path: string[]): boolean {
  if (path.length < 2 || path[0] !== "v1" || !ALLOWED_ROOTS.has(path[1])) return false;
  // Reject traversal / separators. Decode each segment first so still-encoded
  // attempts (e.g. "%2e%2e", "%2f") are caught the same as decoded ones; a
  // malformed escape (decodeURIComponent throws) is rejected outright.
  return path.every((raw) => {
    if (!raw) return false;
    let s: string;
    try {
      s = decodeURIComponent(raw);
    } catch {
      return false;
    }
    return !s.includes("..") && !s.includes("/") && !s.includes("\\");
  });
}

// Per-IP sliding-window rate limit. In-memory and per-instance (Cloud Run may
// run several), but still caps anonymous abuse of the free-model relay. Trades
// strict global accuracy for zero dependencies.
const RATE_LIMIT = 60; // requests
const RATE_WINDOW_MS = 60_000; // per minute
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    // Bound memory: drop entries with no hits in the current window.
    for (const [k, v] of hits) if (!v.some((t) => now - t < RATE_WINDOW_MS)) hits.delete(k);
  }
  return recent.length > RATE_LIMIT;
}

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd ? fwd.split(",")[0].trim() : "unknown";
}

// Identify Franklin's web client to the upstream API (the browser's own
// User-Agent is not forwarded, so set our own).
const USER_AGENT = "Franklin-Web/1.0 (+https://franklin.run)";

// Headers we forward from the client to BlockRun. `anthropic-version` is
// required by the `/v1/messages` endpoint; without it the gateway rejects the
// request with `missing anthropic-version header`.
const FORWARD_REQ_HEADERS = ["content-type", "accept", "x-payment", "authorization", "anthropic-version"];
// Headers we relay from BlockRun back to the client (x402 lives in these).
const FORWARD_RES_HEADERS = [
  "content-type",
  "payment-required",
  "x-payment-required",
  "x-payment-response",
  "cache-control",
];

async function proxy(req: NextRequest, path: string[]) {
  if (!pathAllowed(path)) {
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "content-type": "application/json" },
    });
  }
  if (rateLimited(clientIp(req))) {
    return new Response(JSON.stringify({ error: "Too many requests. Slow down." }), {
      status: 429,
      headers: { "content-type": "application/json" },
    });
  }

  const search = req.nextUrl.search || "";
  const target = `${UPSTREAM}/${path.join("/")}${search}`;

  const headers = new Headers();
  for (const h of FORWARD_REQ_HEADERS) {
    const v = req.headers.get(h);
    if (v) headers.set(h, v);
  }
  headers.set("user-agent", USER_AGENT);

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
