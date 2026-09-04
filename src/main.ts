import { onboardPlayer } from "./invite_onboarding.js";

const input = {email: "player@example.com", name: "Mina", inviteCode: "ARENA-2026", captchaToken: process.env.CAPTCHA_TOKEN || "local-token"};
const player = await onboardPlayer(input, new Set(["ARENA-2026"]));
console.log(JSON.stringify(player, null, 2));
