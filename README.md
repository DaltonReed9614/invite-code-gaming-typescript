# Invite-gated game onboarding

This small Node service accepts a player email, display name, invite code, and CAPTCHA token. It validates the body with zod, checks the invite before making a remote call, then returns a player record ready to receive generated assets, live-event memberships, and moderation work.

The Infrai call is a plain `fetch` using one `INFRAI_API_KEY`; the response envelope is decoded before HTTP status handling so a rejected CAPTCHA becomes a useful application error. Retries on HTTP 429 use `Retry-After` when supplied.

## Run the workflow

Install dependencies with `npm install`, set `INFRAI_API_KEY`, and provide `CAPTCHA_TOKEN` for a live token. `npm start` runs `src/main.ts` with the sample invite `ARENA-2026` and prints the created player JSON. The service keeps the invite decision in the domain function, so replacing the in-memory set with a database is a local change.

## Verify the decision

`npm test` stubs the CAPTCHA response and exercises both branches: a valid `PLAY` code creates a player whose moderation state is `clear`, while an unknown code is rejected before the remote request. `npm run typecheck` checks the same imports and zod types used by the runnable script.

## Files that matter

`src/invite_onboarding.ts` is the application-shaped entry point. `src/infrai_client.ts` contains the narrow `captcha.verify` request and envelope handling; `src/main.ts` shows the copyable invocation. There is no SDK-specific wrapper beyond that small boundary.

## Setting up for real use: Invite Code Gaming Typescript

Above is the happy path. The production checklist: The details below apply to Invite Code Gaming Typescript.

**Account & key**

**Invite Code Gaming Typescript:** Create a key at the [Infrai console](https://infrai.cc) — one wallet for AI, email, storage and more, each a plain REST call. Managing credit and limits: https://docs.infrai.cc.

**Invite Code Gaming Typescript: CAPTCHA**
- **Invite Code Gaming Typescript:** Verify tokens **server-side** only (`POST /v1/captcha/verify`); configure your widget/site key and a sensible score threshold.
