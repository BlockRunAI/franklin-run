import { ACCOUNT_COOKIE, BLOCKRUN_CREDIT_API, accountOriginAllowed, readAccountSession } from "@/lib/blockrun-account";
import { NextRequest } from "next/server";
import { readBoundedBody, RequestBodyError } from "@/lib/request-body";

// Transparent proxy: franklin.run/api/blockrun/<path>  ->  https://blockrun.ai/api/<path>
//
// The /try playground is a browser-wallet client for BlockRun's existing
// x402-paid API (chat / images / videos). Calling blockrun.ai cross-origin
// from the browser would hit CORS and would not expose the 402 "payment-required"
// header, so we forward through this same-origin proxy instead. It passes the
// X-Payment header upstream and relays the payment-required header back to the
// client verbatim — settlement still happens on BlockRun's side, paid to
// BlockRun's configured wallet.

const MAX_REQUEST_BYTES = 8 * 1024 * 1024;
const MAX_PAYMENT_HEADER_BYTES = 64 * 1024;
const REQUEST_TIMEOUT_MS = 180_000;

function upstreamBase(solana = false): URL {
  const host = solana ? "sol.blockrun.ai" : "blockrun.ai";
  const url = new URL((solana ? process.env.BLOCKRUN_SOLANA_API_BASE : process.env.BLOCKRUN_API_BASE) || `https://${host}/api`);
  if (url.username || url.password || url.search || url.hash) throw new Error("BLOCKRUN_API_BASE must not contain credentials, query, or fragment");
  if (process.env.NODE_ENV === "production" && (url.protocol !== "https:" || url.hostname !== host || url.port)) {
    throw new Error("Production BLOCKRUN_API_BASE must use https://blockrun.ai");
  }
  const loopback = ["127.0.0.1", "localhost", "::1"].includes(url.hostname);
  if (url.protocol !== "https:" && !(process.env.NODE_ENV !== "production" && url.protocol === "http:" && loopback)) {
    throw new Error("BLOCKRUN_API_BASE must use HTTPS or a development loopback URL");
  }
  url.pathname = `${url.pathname.replace(/\/+$/, "")}/`;
  return url;
}

const UPSTREAM = upstreamBase();
const SOLANA_UPSTREAM = upstreamBase(true);

// Endpoint allowlist. The proxy is unauthenticated (free models need no wallet),
// so we constrain it to the BlockRun API surface the /try client actually uses.
// path[0] must be "v1" and path[1] one of these — this blocks path-escape
// (encoded "..") to other paths on the upstream host and shrinks the attack
// surface to the known x402 endpoints.
function decodedPath(parts: string[]): string | null {
  if (parts.length < 2 || parts.length > 5) return null;
  const decoded: string[] = [];
  for (const raw of parts) {
    let value: string;
    try { value = decodeURIComponent(raw); }
    catch { return null; }
    if (!/^[A-Za-z0-9._~-]{1,200}$/.test(value) || value === "." || value === "..") return null;
    decoded.push(value);
  }
  return decoded.join("/");
}

const POST_PATHS = [
  /^v1\/(?:messages|chat\/completions|search|voice\/call)$/,
  /^v1\/images\/(?:generations|image2image)$/,
  /^v1\/(?:videos|audio)\/generations$/,
  /^v1\/phone\/numbers\/(?:list|buy|release|renew)$/,
];
const GET_PATHS = [
  /^v1\/(?:images|videos|audio)\/generations\/[A-Za-z0-9._~-]{1,200}$/,
  /^v1\/voice\/call\/[A-Za-z0-9._~-]{1,200}$/,
  /^v1\/(?:crypto|usstock|fx)\/price\/[A-Za-z0-9._~-]{1,200}$/,
  /^v1\/pm\/markets\/search$/,
];

function proxyPathAllowed(method: string, parts: string[]): boolean {
  const pathname = decodedPath(parts);
  if (!pathname) return false;
  const patterns = method === "POST" ? POST_PATHS : method === "GET" ? GET_PATHS : [];
  return patterns.some((pattern) => pattern.test(pathname));
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
const FORWARD_REQ_HEADERS = ["accept", "anthropic-version"];
// Headers we relay from BlockRun back to the client (x402 lives in these).
const FORWARD_RES_HEADERS = [
  "content-type",
  "payment-required",
  "x-payment-required",
  "x-payment-response",
  "x-blockrun-cost-usd",
  "x-blockrun-credit-remaining-usd",
  "x-blockrun-request-id",
];

function jsonError(status: number, error: string): Response {
  return Response.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
}

async function proxy(req: NextRequest, path: string[]) {
  if (!proxyPathAllowed(req.method, path)) return jsonError(404, "Not found");
  if (req.nextUrl.search.length > 4096) return jsonError(414, "Query string is too long");
  if (rateLimited(clientIp(req))) {
    return jsonError(429, "Too many requests. Slow down.");
  }

  const rail = req.headers.get("x-franklin-payment") || "wallet";
  if (rail !== "wallet" && rail !== "credit") return jsonError(400, "Unknown payment method");
  const account = rail === "credit" ? readAccountSession(req.cookies.get(ACCOUNT_COOKIE)?.value) : null;
  if (rail === "credit") {
    if (!accountOriginAllowed(req)) return jsonError(403, "Invalid origin");
    if (!account) return jsonError(401, "Your BlockRun connection expired. Sign in again.");
    if (req.headers.has("x-payment")) return jsonError(400, "Choose one payment method per request");
  }
  const headers = new Headers();
  if (account) headers.set("authorization", `Bearer ${account.accessToken}`);
  const contentType = req.headers.get("content-type");
  if (req.method === "POST") {
    if (!contentType?.toLowerCase().startsWith("application/json")) return jsonError(415, "Content-Type must be application/json");
    headers.set("content-type", contentType);
  }
  for (const h of FORWARD_REQ_HEADERS) {
    const v = req.headers.get(h);
    if (v) headers.set(h, v.slice(0, 1024));
  }
  const payment = req.headers.get("x-payment");
  if (payment) {
    if (Buffer.byteLength(payment, "utf8") > MAX_PAYMENT_HEADER_BYTES) return jsonError(431, "Payment header is too large");
    headers.set("x-payment", payment);
  }
  headers.set("user-agent", USER_AGENT);

  let encodedPath: string;
  try { encodedPath = path.map((part) => encodeURIComponent(decodeURIComponent(part))).join("/"); }
  catch { return jsonError(404, "Not found"); }
  const target = new URL(encodedPath, rail === "credit" ? BLOCKRUN_CREDIT_API : req.headers.get("x-blockrun-chain") === "solana" ? SOLANA_UPSTREAM : UPSTREAM);
  target.search = req.nextUrl.search;
  const init: RequestInit = {
    method: req.method,
    headers,
    redirect: "manual",
    signal: AbortSignal.any([req.signal, AbortSignal.timeout(REQUEST_TIMEOUT_MS)]),
  };
  try {
    if (req.method === "POST") {
      const body = await readBoundedBody(req, MAX_REQUEST_BYTES);
      const arrayBuffer = body.buffer.slice(body.byteOffset, body.byteOffset + body.byteLength) as ArrayBuffer;
      init.body = arrayBuffer;
    }
  } catch (error) {
    if (error instanceof RequestBodyError) return jsonError(error.status, error.message);
    return jsonError(400, "Could not read request body");
  }

  let upstream: Response;
  try {
    upstream = await fetch(target, init);
  } catch (error) {
    const timedOut = error instanceof DOMException && error.name === "TimeoutError";
    return jsonError(timedOut ? 504 : 502, timedOut ? "Franklin backend timed out" : "Could not reach the Franklin backend. Try again.");
  }
  if (upstream.status >= 300 && upstream.status < 400) {
    await upstream.body?.cancel().catch(() => undefined);
    return jsonError(502, "Franklin backend returned an unsafe redirect");
  }

  const resHeaders = new Headers({ "Cache-Control": "no-store" });
  for (const h of FORWARD_RES_HEADERS) {
    const v = upstream.headers.get(h);
    if (v && Buffer.byteLength(v, "utf8") <= MAX_PAYMENT_HEADER_BYTES) resHeaders.set(h, v);
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
