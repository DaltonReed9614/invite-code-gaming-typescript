import { z } from "zod";
import { verifyCaptcha } from "./infrai_client.js";

const requestSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  inviteCode: z.string().min(1),
  captchaToken: z.string().min(1)
});

export type OnboardingRequest = z.infer<typeof requestSchema>;
export type Player = { id: string; email: string; name: string; assets: string[]; liveEvents: string[]; moderation: "clear" };

export async function onboardPlayer(input: unknown, validCodes: Set<string>): Promise<Player> {
  const request = requestSchema.parse(input);
  if (!validCodes.has(request.inviteCode)) throw new Error("INVITE_CODE_INVALID");
  await verifyCaptcha(request.captchaToken, "invite_signup");
  return {id: `player_${request.email.toLowerCase()}`, email: request.email, name: request.name, assets: [], liveEvents: [], moderation: "clear"};
}
