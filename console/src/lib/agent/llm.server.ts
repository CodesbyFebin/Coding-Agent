import { NEBIUS_BASE_URL, costUsd, type Usage } from "./nebius";

export type LlmMessage = { role: "system" | "user" | "assistant"; content: string };

export type LlmResult = { text: string; model: string; usage: Usage; costUsd: number; ms: number };

/** One chat completion against Nebius Token Factory (OpenAI-compatible). */
export async function nebiusChat(opts: {
  model: string;
  messages: LlmMessage[];
  maxTokens?: number;
  temperature?: number;
}): Promise<LlmResult> {
  const key = process.env.NEBIUS_API_KEY;
  if (!key) throw new Error("NEBIUS_API_KEY is not set on the server.");
  const base = (process.env.NEBIUS_BASE_URL || NEBIUS_BASE_URL).replace(/\/+$/, "");
  const started = Date.now();
  const res = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: opts.model,
      messages: opts.messages,
      max_tokens: opts.maxTokens ?? 2000,
      temperature: opts.temperature ?? 0.2,
    }),
  });
  if (!res.ok) {
    throw new Error(`nebius ${res.status}: ${(await res.text()).slice(0, 400)}`);
  }
  const body = (await res.json()) as {
    choices?: { message?: { content?: string | null; reasoning_content?: string | null } }[];
    model?: string;
    usage?: Usage;
  };
  const msg = body.choices?.[0]?.message;
  const text = msg?.content ?? "";
  const usage = body.usage ?? {};
  return { text, model: opts.model, usage, costUsd: costUsd(opts.model, usage), ms: Date.now() - started };
}
