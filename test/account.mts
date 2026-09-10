import assert from "node:assert/strict";
import test from "node:test";
import { sealAccountData, readAccountSession, readLoginState, accountOriginAllowed } from "../src/lib/blockrun-account.ts";
import { mediaPollPath, paymentRequestInit } from "../src/lib/payment-client.ts";
process.env.SESSION_SECRET = "account-test-only-secret-with-more-than-32-bytes";
const account = { accessToken: "brk_live_" + "a".repeat(40), email: "test@example.test", exp: Date.now() + 60_000 };
test("account cookie encrypts credentials and rejects alteration, expiry and wrong key", () => {
  const sealed = sealAccountData(account);
  assert.ok(!Buffer.from(sealed, "base64url").toString().includes(account.accessToken));
  assert.deepEqual(readAccountSession(sealed), account);
  const altered = Buffer.from(sealed, "base64url"); altered[20] ^= 1;
  assert.equal(readAccountSession(altered.toString("base64url")), null);
  assert.equal(readAccountSession(sealAccountData({ ...account, exp: Date.now() - 1 })), null);
  const secret = process.env.SESSION_SECRET;
  process.env.SESSION_SECRET = "different-test-only-secret-with-more-than-32-bytes";
  assert.equal(readAccountSession(sealed), null);
  process.env.SESSION_SECRET = secret;
});
test("login state and account sessions cannot be interchanged", () => {
  const sealed = sealAccountData({ state: "s".repeat(43), verifier: "v".repeat(43), exp: Date.now() + 60_000 });
  assert.ok(readLoginState(sealed));
  assert.equal(readAccountSession(sealed), null);
  assert.equal(readLoginState(sealAccountData(account)), null);
});
test("credit mode preserves request properties and rejects wallet signatures", () => {
  const req = paymentRequestInit("credit", { method: "POST", body: "{}", headers: { "anthropic-version": "2023-06-01", "x-blockrun-chain": "solana" } });
  const headers = new Headers(req.headers);
  assert.equal(headers.get("x-franklin-payment"), "credit");
  assert.equal(headers.get("anthropic-version"), "2023-06-01");
  assert.equal(req.body, "{}");
  assert.throws(() => paymentRequestInit("credit", { headers: { "x-payment": "signature" } }));
  assert.equal(new Headers(paymentRequestInit("wallet").headers).get("x-franklin-payment"), "wallet");
});
test("media polls preserve signed queries for credit and both wallet gateways", () => {
  for (const url of ["https://api.blockrun.ai/v1/videos/generations/job?token=signed", "https://blockrun.ai/api/v1/videos/generations/job?token=signed", "https://sol.blockrun.ai/api/v1/videos/generations/job?token=signed", "/api/blockrun/v1/videos/generations/job?token=signed"]) assert.equal(mediaPollPath(url), "/api/blockrun/v1/videos/generations/job?token=signed");
  for (const url of ["https://evil.example/v1/videos/generations/job", "https://blockrun.ai/admin", "https://blockrun.ai/api/v1/videos/generations/job#fragment", "https://user:password@api.blockrun.ai/v1/videos/generations/job"]) assert.throws(() => mediaPollPath(url));
});
test("credit proxy rejects cross-site cookie requests", () => {
  assert.equal(accountOriginAllowed(new Request("https://franklin.run/api/blockrun/v1/messages", { headers: { origin: "https://evil.example" } })), false);
  assert.equal(accountOriginAllowed(new Request("https://franklin.run/api/blockrun/v1/messages", { headers: { origin: "https://franklin.run" } })), true);
  assert.equal(accountOriginAllowed(new Request("https://franklin.run/api/blockrun/v1/crypto/price/BTC", { headers: { "sec-fetch-site": "same-origin" } })), true);
});
