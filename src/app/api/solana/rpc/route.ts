import { NextRequest } from "next/server";

// Same-origin JSON-RPC proxy: franklin.run/api/solana/rpc -> BlockRun's Solana RPC.
//
// Exists for exactly the reason /api/blockrun does: the browser cannot call the
// gateway directly. BlockRun's RPC serves no Access-Control-Allow-Origin, and a
// JSON-RPC POST is always preflighted (content-type: application/json), so a
// cross-origin call from the wallet's balance hook is blocked outright.
//
// Deliberately its own route rather than an entry in the /api/blockrun path
// allowlist: that proxy defaults to the Base host, where /v1/solana/rpc is a
// *paid* endpoint ($0.0005/call). Routing balance reads through it would bill
// the user for looking at their own balance. This one is pinned to the free
// Solana host and can never drift onto the paid twin.

const UPSTREAM =
  process.env.SOLANA_RPC_PROXY_URL || "https://sol.blockrun.ai/api/v1/solana/rpc";

// Read-only methods the /chat wallet actually needs. The upstream is free but
// not ours to hand out as an open relay, so the surface stays closed: no
// sendTransaction, no subscriptions, nothing that writes.
const ALLOWED_METHODS = new Set([
  "getTokenAccountsByOwner",
  "getLatestBlockhash",
  "getBalance",
  "getAccountInfo",
  "getMultipleAccounts",
  "getHealth",
]);

// Per-IP sliding window, mirroring the /api/blockrun proxy. In-memory and
// per-instance (Cloud Run may run several) — enough to cap abuse of a relay we
// don't pay per-call for, without a dependency.
const RATE_LIMIT = 120; // requests
const RATE_WINDOW_MS = 60_000;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < RATE_WINDOW_MS)) hits.delete(k);
  }
  return recent.length > RATE_LIMIT;
}

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd ? fwd.split(",")[0].trim() : "unknown";
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

// A JSON-RPC body is either one call or a batch; every entry must be allowed.
function methodsAllowed(body: unknown): boolean {
  const calls = Array.isArray(body) ? body : [body];
  if (calls.length === 0 || calls.length > 10) return false;
  return calls.every(
    (c) =>
      typeof c === "object" &&
      c !== null &&
      typeof (c as { method?: unknown }).method === "string" &&
      ALLOWED_METHODS.has((c as { method: string }).method),
  );
}

export async function POST(req: NextRequest) {
  if (rateLimited(clientIp(req))) {
    return json({ error: "Too many requests. Slow down." }, 429);
  }

  const raw = await req.text();
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: "Bad request" }, 400);
  }
  if (!methodsAllowed(body)) {
    return json({ error: "Method not allowed" }, 403);
  }

  let upstream: Response;
  try {
    upstream = await fetch(UPSTREAM, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: raw,
    });
  } catch {
    return json({ error: "Could not reach the Solana RPC. Try again." }, 502);
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "content-type": upstream.headers.get("content-type") || "application/json",
      "cache-control": "no-store",
    },
  });
}
