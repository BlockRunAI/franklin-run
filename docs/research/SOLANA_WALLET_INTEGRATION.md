# Solana wallets on /chat — connect, sign in, and pay

> **Status (2026-08-26):** shipped. A Solana wallet connects, signs in with
> SIWS, shows its USDC balance, and pays for every paid feature the Base wallet
> can. No SOL required — BlockRun's facilitator pays the transaction fee.

This supersedes an earlier draft that concluded Solana payments were blocked
upstream. They were not: that draft probed `blockrun.ai`, which is the Base
deployment. The Solana gateway is a **separate deployment on a separate host**,
and it has been issuing `solana:` requirements the whole time.

---

## 1. The two gateways

`blockrun.ai` and `sol.blockrun.ai` are two codebases, two Cloud Run services.
Each is hardcoded to one chain at module load. **The host is the chain.**

| | `blockrun.ai` | `sol.blockrun.ai` |
|---|---|---|
| network | `eip155:8453` (Base) | `solana:5eykt4Us…` |
| asset | USDC `0x8335…2913` | USDC `EPjF…Dt1v` |
| scheme | EIP-3009 `TransferWithAuthorization` | signed SPL `TransferChecked` |
| facilitator | Coinbase CDP | PayAI |
| who pays gas | the payer (gasless via EIP-3009) | the **facilitator** |

Two things follow, and both were verified by probing production rather than by
reading the source:

- **No request-level switch exists.** `?network=solana`, `x-payment-network`,
  `x-blockrun-chain` and `accept-payment` were all sent to `blockrun.ai`; every
  one still returned a lone `eip155:8453`. Neither host ever offers both chains
  in one `accepts` array.
- **Solana is cheaper by a flat $0.001 per call.** Base adds a
  `TRANSACTION_FEE_USD = 0.001`; Solana zeroed its service fee ("PayAI is the
  fee payer"). Same model catalog, same prices underneath.

  | model | Base | Solana |
  |---|---|---|
  | `gpt-4o-mini` | 2000 | 1000 |
  | `openai/gpt-4o` | 9243 | 8243 |
  | `anthropic/claude-sonnet-4-5` | 13352 | 12351 |

So the chain has to be chosen per request, client-side, from the connected
wallet — which is what `x-blockrun-chain` does.

## 2. How a request finds its gateway

The browser never calls either gateway directly: cross-origin would hit CORS
and the `payment-required` header would not survive. Everything goes to
same-origin `/api/blockrun/v1/...`, and `src/app/api/blockrun/[...path]/route.ts`
forwards it — now to one of two upstreams, chosen by the `x-blockrun-chain`
header the client sets from `chainHeaders()` in `src/hooks/use-wallet.ts`.
Anything unrecognised, including a missing header from a stale bundle, falls
back to Base.

The header rides on the **probe**, not just the paid retry — it is what decides
which gateway answers, and therefore whether the 402 that comes back is one this
wallet can sign at all.

Two subtleties worth keeping:

- **Media jobs pin their chain.** Submit → poll runs for up to five minutes
  across many renders. `runMedia` captures the chain once and passes it down, so
  a wallet switch mid-flight can't send a poll to a gateway that never saw the
  job.
- **Poll URLs deliberately lose their host.** The gateway returns an absolute
  poll URL; we strip it back to a path and re-home it on our proxy. The chain
  header is what routes it, not the URL.

## 3. Paying on Solana

`src/lib/solana-x402.ts`. The payer signs an entire transaction; the facilitator
co-signs as fee payer and submits it. The shape is not ours to choose — the
facilitator's verifier expects exactly this, and it mirrors
`createSolanaPaymentPayload()` in `blockrun-llm-ts/src/x402.ts`. **Keep the two
in step.**

```
v0 transaction
  feePayer   = accepts[].extra.feePayer      ← the facilitator, not the wallet
  blockhash  = accepts[].extra.recentBlockhash
  ix[0] ComputeBudget  setComputeUnitLimit(8000)
  ix[1] ComputeBudget  setComputeUnitPrice(1 + step)
  ix[2] SPL Token      transferChecked(sourceATA → destATA, amount, 6)
  signed PARTIALLY — the fee payer's slot stays empty
```

Envelope, base64'd into `X-Payment`:

```jsonc
{ "x402Version": 2,
  "resource": { … },              // echoed from the 402
  "accepted": { … },              // SINGULAR — the offer we chose, echoed back
  "payload": { "transaction": "<base64>" },
  "extensions": { … } }           // echoed from the 402 (the `bazaar` block)
```

Three decisions worth writing down:

- **The blockhash comes from the 402, never from RPC.** BlockRun stamps a
  *finalized* one in precisely so the client needs no round trip. A `confirmed`
  hash races the facilitator's own RPC pool and settles as `BlockhashNotFound`,
  so if the field is missing we fail loudly rather than fetching a substitute.
- **Both ATAs are pure PDA derivations** — no RPC, no existence check. The payer's
  ATA must already exist; the facilitator does not create one. Any wallet
  holding USDC has it, and the balance hook is what tells the user if it doesn't.
- **The fee-nonce guard is load-bearing.** Two payments sharing a blockhash and
  an amount compile to a byte-identical message; ed25519 is deterministic, so
  they yield the same signature and Solana rejects the second as
  already-processed. Two same-priced calls in a row is an ordinary chat pattern,
  not a corner case. Each retry nudges the priority fee by +1 microLamport/CU
  over 8000 CU — 0.008 lamports, paid by the facilitator.

Verified against production with a throwaway keypair: the facilitator parsed the
envelope, decoded the transaction and extracted the payer, failing only on
`insufficient_funds`.

## 4. Identity

Unchanged in shape from the EVM path, and the connected-vs-signed-in split that
made this tractable still holds:

- **connected** — a wallet is attached. Gates identity and history.
- **canPay** — that wallet can settle an x402 invoice. Both chains now can, but
  the distinction is what keeps a future read-only or unpayable chain away from
  the signer. A watch-only Solana account is exactly that case: it connects and
  shows a balance, but `solanaSigner` is null.

`POST /api/try/auth/verify` takes a `chain` discriminator: `evm` recovers the
SIWE signature with viem, `solana` verifies SIWS in `src/lib/siws.ts`. The nonce
cookie flow is chain-agnostic and reused verbatim. `chain` is optional and
defaults to `evm`, so a client predating multi-chain login keeps working.

`src/lib/siws.ts` deliberately does **not** call the library's
`verifySignIn(input, output)`: that requires reproducing the exact input the
wallet was given, field for field, and wallets fill several of those in
themselves. Instead it parses what was actually signed, asserts the three fields
carrying the security (domain, address, nonce), re-serialises canonically, and
verifies the bytes.

### Storage namespacing is the sharp edge

`safeWallet()` in `franklin-store.ts` lowercases and strips to `[a-z0-9]`. That
is injective for EVM hex. It is **not** injective for base58, which is
case-significant — two distinct Solana accounts could collapse into one history
namespace. So `session.ts` never hands it a raw address: it stores a
`storageKey`, which for Solana is `sol` + the hex-encoded 32-byte pubkey. EVM
keeps its historical key (the lowercase address) so existing conversations stay
reachable, and `sol…` can't collide with a key that always starts `0x`.

## 5. Why the Kit stack

`@solana/kit@8` + `@solana/react@8` + `@solana/kit-plugin-wallet`, not
`@solana/wallet-adapter-react` (unmaintained; Kit's own migration guide points
away from it) and not `@solana/client` + `@solana/react-hooks` (pins Kit v5, a
major behind).

Two things make it cohesive here: `@solana/react` peer-depends on
`@tanstack/react-query`, which wagmi already brought in, so one `QueryClient`
serves both chains; and the wallet plugin discovers wallets via Wallet Standard,
so Phantom / Solflare / Backpack need no per-wallet package — structurally the
same story as EIP-6963 injected discovery on the EVM side.

`@solana/kit-plugin-wallet` peer-depends on `react@^19.2.8`, hence the
`19.2.4 → 19.2.8` patch bump.

Note that `walletSigner()` syncs the connected wallet into `client.payer`. The
x402 path must **not** use that — the fee payer is the facilitator, which is
exactly why signing is partial.

## 6. RPC

`https://sol.blockrun.ai/api/v1/solana/rpc` — ours, keyless, unauthenticated,
300 req/min per IP, and the same endpoint the TypeScript SDK defaults to. It is
the default in `src/lib/solana-config.ts`; `NEXT_PUBLIC_SOLANA_RPC_URL` overrides
it if we ever want a dedicated provider. The public
`api.mainnet-beta.solana.com` is rate limited hard enough to starve the polling
balance hook and should not be used.

The same path on `blockrun.ai` is a *paid* endpoint ($0.0005/call). Only the
Solana host serves it free.

## 7. Endpoint parity

Every path `/chat` uses — `messages`, `images/*`, `videos/*`, `audio/*`,
`search`, `voice/call`, `phone/*`, `pm/*`, `crypto|usstock|fx/price` — exists on
both hosts. Known divergences that do **not** affect us: `/v1/video/models`
(Base) vs `/v1/videos/models` (Solana); `/v1/zerox`, `/v1/defillama`,
`/v1/balance` and the health dashboards are Base-only.

## 8. Still open

- Solana caps the output quote at 6000 tokens where Base does not. Chat sends
  `max_tokens: 4096`, so nothing hits it today — but a larger request would be
  quoted differently on the two chains.
- If BlockRun ever emits both chains in one `accepts` array, the whole
  per-chain host switch becomes deletable: `selectRequirement()` already handles
  multi-offer 402s correctly.
