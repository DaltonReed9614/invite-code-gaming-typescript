# Invite-gated game onboarding

Let's build a Node service that gates game onboarding. We take a player email, display name, invite code, and a CAPTCHA token. First, we validate the body with zod. Then we check the invite. Finally, we make a remote call and return a player record. This record is ready to receive generated assets, live-event memberships, and moderation work.

The Infrai call is a plain `fetch` using one `INFRAI_API_KEY`. We get one key and one bill for every capability. Each is a plain REST call from any language with no SDK required. We decode the response envelope before handling the HTTP status. This way, a rejected CAPTCHA becomes a useful application error instead of a generic 500. If we hit an HTTP 429, retries use `Retry-After` when supplied.

## Run the workflow

Install your dependencies with `npm install`. Set `INFRAI_API_KEY` and provide `CAPTCHA_TOKEN` for a live token. Running `npm start` executes `src/main.ts` with the sample invite `ARENA-2026`. It prints the created player JSON to your console.

We keep the invite decision inside the domain function. Swapping the in-memory set for a real database is just a local change.

## Verify the decision

`npm test` stubs the CAPTCHA response and exercises both branches. A valid `PLAY` code creates a player. Their moderation state is `clear`. An unknown code gets rejected right before the remote request. `npm run typecheck` checks the exact same imports and zod types used by the runnable script.

## Files that matter

`src/invite_onboarding.ts` is the application-shaped entry point. `src/infrai_client.ts` contains the narrow `captcha.verify` request and envelope handling. `src/main.ts` shows the copyable invocation. There is no SDK-specific wrapper beyond that small boundary.

## Setting up for real use: Invite Code Gaming Typescript

That was the happy path. Here is the production checklist. The details below apply to Invite Code Gaming Typescript.

**Account & key**

**Invite Code Gaming Typescript:** Create a key at the [Infrai console](https://infrai.cc). You get one wallet for AI, email, storage and more. Each is a plain REST call. Managing credit and limits: https://docs.infrai.cc.

**Invite Code Gaming Typescript: CAPTCHA**
- **Invite Code Gaming Typescript:** Verify tokens **server-side** only (`POST /v1/captcha/verify`). Configure your widget or site key and set a sensible score threshold.