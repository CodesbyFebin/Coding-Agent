import type { AgentRole, ProviderDef, RoleRoute, RouteStrategy, SettingsState } from "./types";

export const AGENTS: {
  id: AgentRole;
  name: string;
  brief: string;
}[] = [
  { id: "orchestrator", name: "Orchestrator", brief: "Splits work and merges results" },
  { id: "planner", name: "Planner", brief: "Scopes the job and sequence" },
  { id: "architect", name: "Architect", brief: "Shapes modules and contracts" },
  { id: "researcher", name: "Researcher", brief: "Pulls prior memory and APIs" },
  { id: "implementer", name: "Implementer", brief: "Writes and patches files" },
  { id: "reviewer", name: "Reviewer", brief: "Checks correctness and style" },
  { id: "tester", name: "Tester", brief: "Adds coverage and edge cases" },
];

export const PROVIDERS: ProviderDef[] = [
  {
    id: "xai",
    name: "xAI Grok",
    baseUrl: "https://api.x.ai/v1",
    builtIn: true,
    docs: "https://docs.x.ai",
    keyHint: "Built into CodingAgent",
    models: [
      {
        id: "grok-4.5",
        label: "Grok 4.5",
        free: true,
        speed: "quality",
        roles: ["orchestrator", "planner", "architect", "reviewer", "researcher"],
      },
    ],
  },
  {
    id: "groq",
    name: "Groq",
    baseUrl: "https://api.groq.com/openai/v1",
    docs: "https://console.groq.com/keys",
    keyHint: "gsk_…",
    models: [
      {
        id: "llama-3.3-70b-versatile",
        label: "Llama 3.3 70B",
        free: true,
        speed: "fast",
        roles: ["implementer", "planner", "reviewer"],
      },
      {
        id: "llama-3.1-8b-instant",
        label: "Llama 3.1 8B Instant",
        free: true,
        speed: "fast",
        roles: ["tester", "implementer"],
      },
      {
        id: "moonshotai/kimi-k2-instruct",
        label: "Kimi K2 Instruct",
        free: true,
        speed: "quality",
        roles: ["orchestrator", "implementer", "planner"],
      },
      {
        id: "qwen/qwen3-32b",
        label: "Qwen3 32B",
        free: true,
        speed: "medium",
        roles: ["implementer", "architect"],
      },
    ],
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    baseUrl: "https://openrouter.ai/api/v1",
    docs: "https://openrouter.ai/keys",
    keyHint: "sk-or-…",
    models: [
      {
        id: "moonshotai/kimi-k2:free",
        label: "Kimi K2 Free",
        free: true,
        speed: "quality",
        roles: ["orchestrator", "implementer", "planner"],
      },
      {
        id: "qwen/qwen3-coder:free",
        label: "Qwen3 Coder Free",
        free: true,
        speed: "medium",
        roles: ["implementer", "tester"],
      },
      {
        id: "meta-llama/llama-3.3-70b-instruct:free",
        label: "Llama 3.3 70B Free",
        free: true,
        speed: "medium",
        roles: ["planner", "reviewer"],
      },
      {
        id: "google/gemini-2.0-flash-exp:free",
        label: "Gemini Flash Free",
        free: true,
        speed: "fast",
        roles: ["researcher", "tester"],
      },
    ],
  },
  {
    id: "google",
    name: "Google AI Studio",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
    docs: "https://aistudio.google.com/apikey",
    keyHint: "AIza…",
    models: [
      {
        id: "gemini-2.0-flash",
        label: "Gemini 2.0 Flash",
        free: true,
        speed: "fast",
        roles: ["researcher", "implementer", "tester"],
      },
      {
        id: "gemini-2.5-flash",
        label: "Gemini 2.5 Flash",
        free: true,
        speed: "fast",
        roles: ["planner", "reviewer", "researcher"],
      },
    ],
  },
  {
    id: "cerebras",
    name: "Cerebras",
    baseUrl: "https://api.cerebras.ai/v1",
    docs: "https://cloud.cerebras.ai",
    keyHint: "csk-…",
    models: [
      {
        id: "llama-3.3-70b",
        label: "Llama 3.3 70B",
        free: true,
        speed: "fast",
        roles: ["implementer", "planner"],
      },
    ],
  },
  {
    id: "sambanova",
    name: "SambaNova",
    baseUrl: "https://api.sambanova.ai/v1",
    docs: "https://cloud.sambanova.ai",
    keyHint: "API key",
    models: [
      {
        id: "Meta-Llama-3.3-70B-Instruct",
        label: "Llama 3.3 70B",
        free: true,
        speed: "fast",
        roles: ["implementer", "reviewer"],
      },
    ],
  },
  {
    id: "together",
    name: "Together AI",
    baseUrl: "https://api.together.xyz/v1",
    docs: "https://api.together.xyz/settings/api-keys",
    keyHint: "API key",
    models: [
      {
        id: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
        label: "Llama 3.3 Turbo",
        free: true,
        speed: "fast",
        roles: ["implementer", "planner"],
      },
    ],
  },
  {
    id: "mistral",
    name: "Mistral",
    baseUrl: "https://api.mistral.ai/v1",
    docs: "https://console.mistral.ai/api-keys",
    keyHint: "API key",
    models: [
      {
        id: "mistral-small-latest",
        label: "Mistral Small",
        free: true,
        speed: "fast",
        roles: ["implementer", "tester"],
      },
    ],
  },
];

export function providerById(id: string) {
  return PROVIDERS.find((p) => p.id === id);
}

export function modelLabel(providerId: string, model: string) {
  const p = providerById(providerId);
  const m = p?.models.find((x) => x.id === model);
  return m?.label ?? model;
}

export function availableRoutes(settings: SettingsState) {
  return PROVIDERS.filter((p) => p.builtIn || Boolean(settings.keys[p.id]?.trim()));
}

export function resolveRoute(
  role: AgentRole,
  settings: SettingsState,
): RoleRoute {
  const override = settings.roleRouting[role];
  if (override) {
    const p = providerById(override.providerId);
    if (p && (p.builtIn || settings.keys[p.id])) return override;
  }

  const live = availableRoutes(settings);
  const models = live.flatMap((p) =>
    p.models.map((m) => ({ providerId: p.id, model: m.id, meta: m })),
  );

  const prefer = (pred: (m: (typeof models)[number]) => boolean) =>
    models.find(pred);

  if (settings.strategy === "quality") {
    return (
      prefer((m) => m.meta.speed === "quality" && m.meta.roles.includes(role)) ??
      prefer((m) => m.meta.speed === "quality") ??
      fallbackRoute(settings)
    );
  }

  if (settings.strategy === "fast") {
    return (
      prefer((m) => m.meta.speed === "fast" && m.meta.roles.includes(role)) ??
      prefer((m) => m.meta.speed === "fast") ??
      fallbackRoute(settings)
    );
  }

  if (settings.strategy === "free") {
    return (
      prefer((m) => m.meta.free && m.meta.roles.includes(role) && m.providerId !== "xai") ??
      prefer((m) => m.meta.free && m.providerId !== "xai") ??
      fallbackRoute(settings)
    );
  }

  return (
    prefer((m) => m.meta.roles.includes(role) && m.meta.speed !== "quality") ??
    prefer((m) => m.meta.roles.includes(role)) ??
    fallbackRoute(settings)
  );
}

export function fallbackRoute(settings: SettingsState): RoleRoute {
  const live = availableRoutes(settings);
  const first = live[0];
  if (!first) {
    return { providerId: "xai", model: "grok-4.5" };
  }
  if (settings.defaultProviderId && live.some((p) => p.id === settings.defaultProviderId)) {
    const p = providerById(settings.defaultProviderId)!;
    const model =
      p.models.find((m) => m.id === settings.defaultModel)?.id ?? p.models[0]?.id ?? "grok-4.5";
    return { providerId: p.id, model };
  }
  return { providerId: first.id, model: first.models[0]?.id ?? "grok-4.5" };
}

export const DEFAULT_SETTINGS: SettingsState = {
  strategy: "auto",
  mode: "swarm",
  keys: {},
  roleRouting: {},
  defaultProviderId: "xai",
  defaultModel: "grok-4.5",
  permission: "default",
};
