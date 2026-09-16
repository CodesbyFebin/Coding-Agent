/**
 * Model Gateway - Provider abstraction and routing
 *
 * Provider adapters other than Ollama are intentionally left as abstract
 * extension points (`invoke`/`getModels`/`getUsage` throw 'Not implemented')
 * -- wiring up additional hosted LLM providers is out of scope for this
 * change. Ollama is a real, working adapter because this project positions
 * itself as local-LLM-first.
 */
'use strict';

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';

const modelRegistry = {};
const providerAdapters = {};

const registerProvider = async (name, config) => {
  modelRegistry[name] = {
    ...config,
    registeredAt: new Date(),
    status: 'active',
  };

  // Initialize provider adapter if not exists
  if (!providerAdapters[name]) {
    providerAdapters[name] = createAdapter(name, config);
  }

  return { success: true, name };
};

/**
 * Real, working adapter for a local Ollama server's native /api/generate
 * endpoint. Every other provider name falls back to the abstract stub.
 */
const createOllamaAdapter = (config) => ({
  name: 'ollama',
  config,
  async invoke(modelName, messages, options = {}) {
    const prompt = Array.isArray(messages)
      ? messages.map((m) => `${m.role || 'user'}: ${m.content}`).join('\n')
      : String(messages);

    const res = await fetch(`${config.baseUrl || OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: modelName,
        prompt,
        stream: false,
        options: {
          temperature: options.temperature,
          num_predict: options.maxTokens,
        },
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Ollama request failed (${res.status}): ${text}`);
    }

    const data = await res.json();
    return {
      text: data.response,
      model: data.model,
      done: data.done,
      raw: data,
    };
  },
  async getModels() {
    const res = await fetch(`${config.baseUrl || OLLAMA_BASE_URL}/api/tags`);
    if (!res.ok) throw new Error(`Ollama /api/tags failed (${res.status})`);
    const data = await res.json();
    return (data.models || []).map((m) => m.name);
  },
  async getUsage() {
    // Ollama's native API does not expose token usage/billing metrics.
    return { supported: false };
  },
});

const createAdapter = (name, config) => {
  if (name === 'ollama') {
    return createOllamaAdapter(config);
  }

  return {
    name,
    config,
    async invoke(modelName, messages, options = {}) {
      // Abstract method - extension point for a future concrete provider.
      throw new Error('Not implemented');
    },
    async getModels() {
      // Abstract method
      throw new Error('Not implemented');
    },
    async getUsage() {
      // Abstract method
      throw new Error('Not implemented');
    },
  };
};

const routeRequest = async (provider, modelName, messages, options = {}) => {
  const registryEntry = modelRegistry[provider];
  if (!registryEntry) {
    throw new Error(`Provider ${provider} not registered`);
  }

  const adapter = providerAdapters[provider];
  if (!adapter) {
    throw new Error(`Adapter ${provider} not initialized`);
  }

  // Execute with fallback
  try {
    const result = await adapter.invoke(modelName, messages, options);
    return { success: true, result };
  } catch (error) {
    // Fallback logic
    const fallback = options.fallbackProvider;
    if (fallback) {
      return await routeRequest(fallback, modelName, messages, {
        ...options,
        fallback: false,
      });
    }
    throw error;
  }
};

const getProviderStatus = () => {
  return Object.keys(modelRegistry).map((name) => ({
    name,
    status: modelRegistry[name].status,
    registeredAt: modelRegistry[name].registeredAt,
  }));
};

const computeRoutingDecision = (providers, policy = 'BALANCED') => {
  switch (policy) {
    case 'COST':
      return providers
        .filter((p) => p.config.costPerToken > 0)
        .sort((a, b) => a.config.costPerToken - b.config.costPerToken)[0];

    case 'QUALITY':
      return providers
        .filter((p) => p.config.qualityScore > 0)
        .sort((a, b) => b.config.qualityScore - a.config.qualityScore)[0];

    case 'SPEED':
      return providers
        .filter((p) => p.config.maxTokens > 0)
        .sort((a, b) => a.config.maxTokens - b.config.maxTokens)[0];

    case 'BALANCED':
    default:
      // Balance cost, quality, and speed
      return providers.sort((a, b) => {
        const aScore = (a.config.qualityScore / Math.max(a.config.costPerToken, 1)) *
                       (a.config.maxTokens / 10000);
        const bScore = (b.config.qualityScore / Math.max(b.config.costPerToken, 1)) *
                       (b.config.maxTokens / 10000);
        return bScore - aScore;
      })[0];
  }
};

module.exports = {
  registerProvider,
  routeRequest,
  getProviderStatus,
  computeRoutingDecision,
};
