import { createServerFn } from "@tanstack/react-start";
import type { GatewayRequest, GatewayResponse } from "./types";

const MAX_PROMPT = 24_000;
const MAX_MESSAGE = 6_000;

function clip(s: string, max: number) {
  return s.length > max ? s.slice(0, max) : s;
}

export const getGatewayStatus = createServerFn({ method: "POST" }).handler(
  async (): Promise<{ xai: boolean }> => {
    return { xai: Boolean(process.env.XAI_API_KEY) };
  },
);

export const routeCompletion = createServerFn({ method: "POST" })
  .validator((input: GatewayRequest) => input)
  .handler(async ({ data }): Promise<GatewayResponse> => {
    const useXai = data.providerId === "xai" || !data.apiKey;
    const apiKey = useXai ? process.env.XAI_API_KEY : data.apiKey;
    const baseUrl = useXai ? "https://api.x.ai/v1" : data.baseUrl.replace(/\/+$/, "");
    const model = useXai && !data.apiKey ? "grok-4.5" : data.model;
    const providerId = useXai && !data.apiKey ? "xai" : data.providerId;

    if (!apiKey) {
      return {
        ok: false,
        error: "No model is available. Add a free-tier key in Gateway, or wait for built-in Grok.",
      };
    }

    const messages = [
      { role: "system" as const, content: clip(data.system, MAX_PROMPT) },
      ...data.messages.map((m) => ({
        role: m.role,
        content: clip(m.content, MAX_MESSAGE),
      })),
    ];

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    };
    if (providerId === "openrouter") {
      headers["HTTP-Referer"] = "https://codingagent.in";
      headers["X-Title"] = "CodingAgent";
    }

    const maxTokens = Math.min(Math.max(data.maxTokens ?? 1200, 256), 2500);

    try {
      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model,
          temperature: data.mode === "chat" ? 0.5 : 0.25,
          max_tokens: maxTokens,
          messages,
        }),
      });
      if (!res.ok) {
        const errText = clip(await res.text(), 400);
        return { ok: false, error: `${providerId} ${res.status}: ${errText || res.statusText}` };
      }
      const body = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
        model?: string;
      };
      const text = body.choices?.[0]?.message?.content ?? "";
      if (!text.trim()) return { ok: false, error: "The model returned an empty reply." };
      return { ok: true, text, model: body.model ?? model, providerId };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Network error";
      return { ok: false, error: message };
    }
  });
