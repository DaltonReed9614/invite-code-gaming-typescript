import assert from "node:assert/strict";
import { onboardPlayer } from "../src/invite_onboarding.js";

const originalFetch = globalThis.fetch;
process.env.INFRAI_API_KEY = "test-key";
globalThis.fetch = async () => new Response(JSON.stringify({ok: true, data: {verified: true}}), {status: 200});

const player = await onboardPlayer({email: "a@game.test", name: "A", inviteCode: "PLAY", captchaToken: "token"}, new Set(["PLAY"]));
assert.equal(player.moderation, "clear");
await assert.rejects(() => onboardPlayer({email: "a@game.test", name: "A", inviteCode: "NOPE", captchaToken: "token"}, new Set(["PLAY"])), /INVITE_CODE_INVALID/);
globalThis.fetch = originalFetch;
console.log("invite onboarding decisions passed");
