import { createServerFn } from "@tanstack/react-start";
import type { GatewayRequest, GatewayResponse } from "./types";
import { NEBIUS_BASE_URL, costUsd, tierModel, type Usage } from "./nebius";

const MAX_PROMPT = 24_000;
const MAX_MESSAGE = 6_000;

function clip(s: string, max: number) {
  return s.length > max ? s.slice(0, max) : s;
}

export const getGatewayStatus = createServerFn({ method: "POST" }).handler(
  async (): Promise<{ xai: boolean; nebius: boolean; tavily: boolean }> => {
    return {
      xai: Boolean(process.env.XAI_API_KEY),
      nebius: Boolean(process.env.NEBIUS_API_KEY),
      tavily: Boolean(process.env.TAVILY_API_KEY),
    };
  },
);

export const routeCompletion = createServerFn({ method: "POST" })
  .validator((input: GatewayRequest) => input)
  .handler(async ({ data }): Promise<GatewayResponse> => {
    const started = Date.now();
    let apiKey: string | undefined;
    let baseUrl: string;
    let model = data.model;
    let providerId = data.providerId;
    if (data.providerId === "nebius" && !data.apiKey) {
      // Built-in: NVIDIA Nemotron on Nebius Token Factory, key stays server-side.
      apiKey = process.env.NEBIUS_API_KEY;
      baseUrl = (process.env.NEBIUS_BASE_URL || NEBIUS_BASE_URL).replace(/\/+$/, "");
      model = data.model || tierModel("super", process.env);
    } else {
      const useXai = data.providerId === "xai" || !data.apiKey;
      apiKey = useXai ? process.env.XAI_API_KEY : data.apiKey;
      baseUrl = useXai ? "https://api.x.ai/v1" : data.baseUrl.replace(/\/+$/, "");
      model = useXai && !data.apiKey ? "grok-4.5" : data.model;
      providerId = useXai && !data.apiKey ? "xai" : data.providerId;
    }

    if (!apiKey) {
      return {
        ok: false,
        error: "No model is available. Set NEBIUS_API_KEY on the server (Nemotron via Nebius Token Factory) or add a key in Gateway.",
      };
    }

    // PCM: ground Nemotron chat calls with the persisted project DNA (server-side only).
    let grounding = "";
    if (providerId === "nebius" && process.env.PCM_DNA !== "off") {
      const { loadDNA } = await import("../pcm/dna.server");
      const { dnaPrompt } = await import("../pcm/dna");
      const dna = await loadDNA();
      if (dna) grounding = dnaPrompt(dna) + "\n\n";
    }
    const messages = [
      { role: "system" as const, content: grounding + clip(data.system, MAX_PROMPT) },
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

    const maxTokens = Math.min(Math.max(data.maxTokens ?? 1200, 256), 6000);

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
        usage?: Usage;
      };
      const text = body.choices?.[0]?.message?.content ?? "";
      if (!text.trim()) return { ok: false, error: "The model returned an empty reply." };
      const usage = body.usage ?? {};
      return {
        ok: true,
        text,
        model: body.model ?? model,
        providerId,
        costUsd: costUsd(model, usage),
        tokens: (usage.prompt_tokens ?? 0) + (usage.completion_tokens ?? 0),
        ms: Date.now() - started,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Network error";
      return { ok: false, error: message };
    }
  });
