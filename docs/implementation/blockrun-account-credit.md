# BlockRun account credit on Franklin web

Franklin now offers wallet USDC (Base or Solana) and BlockRun account credit. The homepage and chat sidebar link to BlockRun sign-in. After signing in and confirming the connection, the user returns to `/chat` with credit selected. Balance refreshes on focus and every minute; billing links open the account portal.

The account connection is independent of wallet history and Team identity. Team currently requires a Base wallet signature and provides shared messages, one-time invites, member roles and versioned files. Agent execution remains in the desktop app. `/desktop` describes the native app and links to the public Franklin monorepo releases.

## Deployment order

1. Deploy the companion `enterprise` change that adds `/api/franklin/authorize`, `/api/franklin/token` and `/api/franklin/revoke` on `user.blockrun.ai`. It issues expiring delegated account keys and preserves the Franklin authorization request across Google login.
2. Ensure Franklin's existing `SESSION_SECRET` is at least 32 bytes. It encrypts account cookies. The two services use their own secrets; no shared secret or browser API key is needed.
3. Deploy this website with the existing Cloud Run deploy script. A GitHub push alone does not publish franklin.run.
4. Complete a real sign-in on `https://franklin.run`, confirm the displayed BlockRun account, verify the balance, run a request, inspect the account ledger, then disconnect. Mock route tests do not replace this production identity and settlement check.

The registered callback is exactly `https://franklin.run/api/try/account/callback`. Other callback hosts are deliberately rejected. Preview builds can test UI, cookie handling and mocked routes; they cannot complete production OAuth back to localhost.

Credit requests only use `api.blockrun.ai` and server-held credentials. A 401/402 never retries against a wallet gateway. Each request captures its payment rail, including detached media jobs and polls. Signed media queries are preserved. Headers reporting actual cost/remaining credit are forwarded; the account dashboard remains authoritative for settled usage.

## Validation

- `npm run test:account`: encryption, cookie type separation, expiry, origin checks, payment headers, media poll URLs.
- `npm run test:routes`: mocked login/callback and gateway routes, state binding, bearer injection, SSE forwarding, credit refusal, mixed-rail rejection, polling, Base and Solana routing. No live credentials or charges.
- `npm run test:team`: owner/member/viewer rules, single-use invites, messages, files and optimistic concurrency, including GCS generation races and file read/save version compatibility. Run only in a disposable local test directory; it clears its local team store.
- `npm run lint`, `npm run typecheck`, `npm run build`.

Existing local conversation history stays on the current browser unless wallet history sign-in is used. Account credit sign-in does not merge wallet identities or upload local history to an account.
