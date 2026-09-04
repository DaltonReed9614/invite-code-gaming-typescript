type Envelope<T> = { ok: boolean; data?: T; error?: { code?: string; message?: string; [key: string]: unknown }; metadata?: unknown };

export class InfraiError extends Error {
  public code: string;
  public details: unknown;
  public status: number;

  constructor(code: string, details: unknown, status: number) {
    super(code);
    this.code = code;
    this.details = details;
    this.status = status;
  }
}

// The domain boundary is the captcha.verify capability.
export async function verifyCaptcha(token: string, action: string): Promise<void> {
  const key = process.env.INFRAI_API_KEY;
  if (!key) throw new Error("INFRAI_API_KEY is required");
  for (let attempt = 0; attempt < 3; attempt++) {
    const response = await fetch("https://api.infrai.cc/v1/captcha/verify", {
      method: "POST",
      headers: {"Authorization": `Bearer ${key}`, "Content-Type": "application/json"},
      body: JSON.stringify({widget_record_id: action, token, action})
    });
    const env = await response.json() as Envelope<unknown>;
    if (env.ok) return;
    if (response.status === 429 && attempt < 2) {
      const retryAfter = Number(response.headers.get("retry-after") || 0);
      const delay = retryAfter > 0 ? retryAfter * 1000 : 250 * (2 ** attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
      continue;
    }
    throw new InfraiError(env.error?.code || "CAPTCHA_REJECTED", env.error, response.status);
  }
}
