import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

/**
 * Provider Information with Free Tier Details
 */
export const PROVIDER_INFO = {
  groq: {
    name: "Groq",
    description: "Ultra-fast inference with Llama models",
    freeTier: true,
    freeLimit: "14,400 requests/day",
    website: "https://console.groq.com",
    models: {
      "llama-3.3-70b-versatile": {
        context: 128000,
        speed: "fast",
        quality: "high",
        free: true,
      },
      "llama-3.1-8b-instant": {
        context: 128000,
        speed: "ultra-fast",
        quality: "good",
        free: true,
      },
      "meta-llama/llama-4-scout-17b-16e-instruct": {
        context: 128000,
        speed: "fast",
        quality: "high",
        free: true,
      },
      "meta-llama/llama-4-maverick-17b-128e-instruct": {
        context: 128000,
        speed: "fast",
        quality: "high",
        free: true,
      },
      "qwen/qwen3-32b": {
        context: 32768,
        speed: "fast",
        quality: "high",
        free: true,
      },
      "moonshotai/kimi-k2-instruct": {
        context: 128000,
        speed: "fast",
        quality: "high",
        free: true,
      },
      "groq/compound": {
        context: 128000,
        speed: "fast",
        quality: "high",
        free: true,
      },
      "groq/compound-mini": {
        context: 128000,
        speed: "ultra-fast",
        quality: "good",
        free: true,
      },
    },
  },
  openrouter: {
    name: "OpenRouter",
    description: "Access 100+ models through one API",
    freeTier: true,
    freeLimit: "Free credits on signup + pay-per-use",
    website: "https://openrouter.ai",
    models: {
      "google/gemini-2.0-flash-exp:free": {
        context: 1000000,
        speed: "fast",
        quality: "high",
        free: true,
      },
      "meta-llama/llama-3.3-70b-instruct:free": {
        context: 128000,
        speed: "medium",
        quality: "high",
        free: true,
      },
      "qwen/qwen-2.5-72b-instruct:free": {
        context: 32768,
        speed: "medium",
        quality: "high",
        free: true,
      },
      "anthropic/claude-3-5-sonnet": {
        context: 200000,
        speed: "medium",
        quality: "premium",
        free: false,
      },
      "openai/gpt-4o": {
        context: 128000,
        speed: "medium",
        quality: "premium",
        free: false,
      },
    },
  },
  together: {
    name: "Together AI",
    description: "Open-source models at scale",
    freeTier: true,
    freeLimit: "$5 free credits on signup",
    website: "https://together.ai",
    models: {
      "meta-llama/Meta-Llama-3.3-70B-Instruct-Turbo": {
        context: 128000,
        speed: "fast",
        quality: "high",
        free: false,
      },
      "meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo": {
        context: 128000,
        speed: "fast",
        quality: "good",
        free: false,
      },
      "Qwen/Qwen2.5-72B-Instruct-Turbo": {
        context: 32768,
        speed: "fast",
        quality: "high",
        free: false,
      },
    },
  },
  openai: {
    name: "OpenAI",
    description: "GPT-4 and GPT-5 models",
    freeTier: false,
    freeLimit: "Pay-per-use only",
    website: "https://platform.openai.com",
    models: {
      "gpt-5": {
        context: 128000,
        speed: "medium",
        quality: "premium",
        free: false,
      },
      "gpt-5-mini": {
        context: 128000,
        speed: "fast",
        quality: "high",
        free: false,
      },
      "gpt-5-nano": {
        context: 128000,
        speed: "ultra-fast",
        quality: "good",
        free: false,
      },
      "gpt-4.1": {
        context: 128000,
        speed: "medium",
        quality: "premium",
        free: false,
      },
      "gpt-4.1-mini": {
        context: 128000,
        speed: "fast",
        quality: "high",
        free: false,
      },
      "gpt-4.1-nano": {
        context: 128000,
        speed: "ultra-fast",
        quality: "good",
        free: false,
      },
      "gpt-4-turbo": {
        context: 128000,
        speed: "medium",
        quality: "premium",
        free: false,
      },
      "gpt-4": {
        context: 8192,
        speed: "medium",
        quality: "high",
        free: false,
      },
      "gpt-3.5-turbo": {
        context: 16385,
        speed: "fast",
        quality: "good",
        free: false,
      },
    },
  },
  cerebras: {
    name: "Cerebras",
    description: "Fastest AI inference - 2000+ tokens/sec",
    freeTier: true,
    freeLimit: "Free tier with rate limits",
    website: "https://cloud.cerebras.ai",
    models: {
      "llama3.1-70b": {
        context: 8192,
        speed: "ultra-fast",
        quality: "high",
        free: true,
      },
      "llama3.1-8b": {
        context: 8192,
        speed: "ultra-fast",
        quality: "good",
        free: true,
      },
    },
  },
  anthropic: {
    name: "Anthropic",
    description: "Claude models - Advanced reasoning and analysis",
    freeTier: false,
    freeLimit: "Pay-per-use only",
    website: "https://console.anthropic.com",
    models: {
      "claude-opus-4-5-20251101": {
        context: 200000,
        speed: "medium",
        quality: "premium",
        free: false,
      },
      "claude-sonnet-4-5-20250929": {
        context: 200000,
        speed: "fast",
        quality: "premium",
        free: false,
      },
      "claude-haiku-4-5-20251001": {
        context: 200000,
        speed: "ultra-fast",
        quality: "high",
        free: false,
      },
      "claude-opus-4-20250514": {
        context: 200000,
        speed: "medium",
        quality: "premium",
        free: false,
      },
      "claude-sonnet-4-20250514": {
        context: 200000,
        speed: "fast",
        quality: "premium",
        free: false,
      },
      "claude-3-7-sonnet-20250219": {
        context: 200000,
        speed: "fast",
        quality: "high",
        free: false,
      },
      "claude-3-5-haiku-20241022": {
        context: 200000,
        speed: "ultra-fast",
        quality: "high",
        free: false,
      },
      "claude-3-haiku-20240307": {
        context: 200000,
        speed: "ultra-fast",
        quality: "good",
        free: false,
      },
    },
  },
};

/**
 * Rate Limit Configuration per provider
 */
const RATE_LIMIT_CONFIG = {
  openai: { maxRetries: 3, baseDelay: 1000, maxDelay: 60000 },
  openrouter: { maxRetries: 3, baseDelay: 1000, maxDelay: 30000 },
  groq: { maxRetries: 5, baseDelay: 2000, maxDelay: 60000 },
  together: { maxRetries: 3, baseDelay: 1000, maxDelay: 30000 },
  cerebras: { maxRetries: 3, baseDelay: 1000, maxDelay: 30000 },
  anthropic: { maxRetries: 3, baseDelay: 1000, maxDelay: 60000 },
};

/**
 * Sleep helper for rate limiting
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Exponential backoff calculator
 */
function calculateBackoff(attempt, baseDelay, maxDelay) {
  const delay = Math.min(
    baseDelay * Math.pow(2, attempt) + Math.random() * 1000,
    maxDelay,
  );
  return Math.floor(delay);
}

/**
 * Check if error is a rate limit error
 */
function isRateLimitError(error) {
  const msg = error.message?.toLowerCase() || "";
  const status = error.status || error.response?.status;

  return (
    status === 429 ||
    msg.includes("rate limit") ||
    msg.includes("too many requests") ||
    msg.includes("quota exceeded") ||
    msg.includes("rate_limit_exceeded")
  );
}

/**
 * Unified AI Provider Manager
 * Supports: OpenAI, OpenRouter, Groq, Together AI, and Cerebras
 * Includes rate limit handling with exponential backoff
 */
export class AIProviderManager {
  constructor() {
    this.providers = {
      groq: this.initGroq(),
      openrouter: this.initOpenRouter(),
      cerebras: this.initCerebras(),
      together: this.initTogether(),
      openai: this.initOpenAI(),
      anthropic: this.initAnthropic(),
    };

    // Track rate limit state per provider
    this.rateLimitState = {};
  }

  // Groq Configuration (Fast and free tier available)
  initGroq() {
    if (!process.env.GROQ_API_KEY) return null;
    return {
      client: new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: "https://api.groq.com/openai/v1",
      }),
      models: Object.keys(PROVIDER_INFO.groq.models),
      type: "openai-compatible",
      info: PROVIDER_INFO.groq,
    };
  }

  // OpenRouter Configuration (Access to 100+ models)
  initOpenRouter() {
    if (!process.env.OPENROUTER_API_KEY) return null;
    return {
      client: new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: {
          "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
          "X-Title": "AI SOP Builder",
        },
      }),
      models: Object.keys(PROVIDER_INFO.openrouter.models),
      type: "openai-compatible",
      info: PROVIDER_INFO.openrouter,
    };
  }

  // Cerebras Configuration (Ultra-fast inference)
  initCerebras() {
    if (!process.env.CEREBRAS_API_KEY) return null;
    return {
      client: new OpenAI({
        apiKey: process.env.CEREBRAS_API_KEY,
        baseURL: "https://api.cerebras.ai/v1",
      }),
      models: Object.keys(PROVIDER_INFO.cerebras.models),
      type: "openai-compatible",
      info: PROVIDER_INFO.cerebras,
    };
  }

  // Together AI Configuration
  initTogether() {
    if (!process.env.TOGETHER_API_KEY) return null;
    return {
      client: new OpenAI({
        apiKey: process.env.TOGETHER_API_KEY,
        baseURL: "https://api.together.xyz/v1",
      }),
      models: Object.keys(PROVIDER_INFO.together.models),
      type: "openai-compatible",
      info: PROVIDER_INFO.together,
    };
  }

  // OpenAI Configuration
  initOpenAI() {
    if (!process.env.OPENAI_API_KEY) return null;
    return {
      client: new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
      models: Object.keys(PROVIDER_INFO.openai.models),
      type: "openai",
      info: PROVIDER_INFO.openai,
    };
  }

  // Anthropic Configuration (Claude models)
  initAnthropic() {
    if (!process.env.ANTHROPIC_API_KEY) return null;
    return {
      apiKey: process.env.ANTHROPIC_API_KEY,
      models: Object.keys(PROVIDER_INFO.anthropic.models),
      type: "anthropic",
      info: PROVIDER_INFO.anthropic,
    };
  }

  /**
   * Get available providers and their models
   */
  getAvailableProviders() {
    const available = {};

    for (const [name, provider] of Object.entries(this.providers)) {
      if (provider) {
        available[name] = {
          models: provider.models,
          type: provider.type,
          info: provider.info,
        };
      }
    }

    return available;
  }

  /**
   * Get detailed info about all providers (configured and unconfigured)
   */
  getAllProvidersInfo() {
    const result = {};
    for (const [name, info] of Object.entries(PROVIDER_INFO)) {
      const isConfigured = !!this.providers[name];
      result[name] = {
        ...info,
        configured: isConfigured,
        available: isConfigured,
      };
    }
    return result;
  }

  /**
   * Get only free-tier models across all configured providers
   */
  getFreeModels() {
    const freeModels = [];
    for (const [providerName, provider] of Object.entries(this.providers)) {
      if (!provider) continue;
      const providerInfo = PROVIDER_INFO[providerName];
      if (!providerInfo) continue;

      for (const [modelName, modelInfo] of Object.entries(
        providerInfo.models,
      )) {
        if (modelInfo.free) {
          freeModels.push({
            provider: providerName,
            model: modelName,
            ...modelInfo,
          });
        }
      }
    }
    return freeModels;
  }

  /**
   * Check if a specific provider is currently rate limited
   */
  isProviderRateLimited(providerName) {
    const state = this.rateLimitState[providerName];
    if (!state) return false;
    return Date.now() < state.retryAfter;
  }

  /**
   * Test provider connectivity (lightweight health check)
   */
  async testProvider(providerName, model = null) {
    const provider = this.providers[providerName];

    if (!provider) {
      return {
        available: false,
        error: "Provider not configured",
        configured: false,
      };
    }

    const testModel = model || provider.models[0];
    const startTime = Date.now();

    try {
      // Handle Anthropic separately
      if (provider.type === "anthropic") {
        const response = await this.callAnthropicAPI(
          provider.apiKey,
          testModel,
          [{ role: "user", content: 'Say "ok"' }],
          { max_tokens: 5, temperature: 0 },
        );

        return {
          available: true,
          configured: true,
          model: testModel,
          responseTime: Date.now() - startTime,
          rateLimited: false,
        };
      }

      // Build test options based on model type
      const testOptions = {
        model: testModel,
        messages: [{ role: "user", content: 'Say "ok"' }],
      };

      // GPT-5 and newer models use max_completion_tokens instead of max_tokens
      // and don't support custom temperature
      if (
        testModel.startsWith("gpt-5") ||
        testModel.startsWith("o1") ||
        testModel.startsWith("o3")
      ) {
        testOptions.max_completion_tokens = 5;
        // GPT-5 only supports temperature=1, so we don't set it
      } else {
        testOptions.max_tokens = 5;
        testOptions.temperature = 0;
      }

      // OpenAI-compatible providers
      const response =
        await provider.client.chat.completions.create(testOptions);

      return {
        available: true,
        configured: true,
        model: testModel,
        responseTime: Date.now() - startTime,
        rateLimited: false,
      };
    } catch (error) {
      const isRateLimit = isRateLimitError(error);

      return {
        available: false,
        configured: true,
        model: testModel,
        responseTime: Date.now() - startTime,
        rateLimited: isRateLimit,
        error: error.message,
      };
    }
  }

  /**
   * Test all configured providers
   */
  async testAllProviders() {
    const results = {};

    for (const [name, provider] of Object.entries(this.providers)) {
      if (provider) {
        results[name] = await this.testProvider(name);
        // Small delay to avoid rate limits during testing
        await sleep(500);
      } else {
        results[name] = { available: false, configured: false };
      }
    }

    return results;
  }

  /**
   * Universal completion method with rate limit handling
   */
  async createCompletion(providerName, model, messages, options = {}) {
    const provider = this.providers[providerName];

    if (!provider) {
      throw new Error(
        `Provider "${providerName}" is not configured. Add API key to .env`,
      );
    }

    const config = RATE_LIMIT_CONFIG[providerName] || {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 30000,
    };
    let lastError = null;

    // Extract known options to avoid passing invalid params to the API
    const { temperature, maxTokens, max_tokens, topP, top_p, ...restOptions } =
      options;

    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
      try {
        // Check if we're in a backoff period
        if (this.isProviderRateLimited(providerName)) {
          const waitTime =
            this.rateLimitState[providerName].retryAfter - Date.now();
          console.log(
            `[${providerName}] Rate limited, waiting ${waitTime}ms...`,
          );
          await sleep(waitTime);
        }

        // Handle Anthropic separately (different API format)
        if (provider.type === "anthropic") {
          const response = await this.callAnthropicAPI(
            provider.apiKey,
            model,
            messages,
            {
              temperature: temperature ?? 0.7,
              max_tokens: max_tokens ?? maxTokens ?? 4000,
            },
          );
          delete this.rateLimitState[providerName];
          return response;
        }

        // Build completion options based on model type
        const completionOptions = {
          model,
          messages,
          top_p: top_p ?? topP ?? 1,
          ...restOptions,
        };

        // GPT-5 and newer models don't support custom temperature (only 1)
        if (
          !model.startsWith("gpt-5") &&
          !model.startsWith("o1") &&
          !model.startsWith("o3")
        ) {
          completionOptions.temperature = temperature ?? 0.7;
        }

        // GPT-5 and newer models use max_completion_tokens instead of max_tokens
        const tokenLimit = max_tokens ?? maxTokens ?? 4000;
        if (
          model.startsWith("gpt-5") ||
          model.startsWith("o1") ||
          model.startsWith("o3")
        ) {
          completionOptions.max_completion_tokens = tokenLimit;
        } else {
          completionOptions.max_tokens = tokenLimit;
        }

        // OpenAI-compatible providers
        const response =
          await provider.client.chat.completions.create(completionOptions);

        // Clear rate limit state on success
        delete this.rateLimitState[providerName];

        return {
          content: response.choices[0].message.content,
          model: response.model,
          provider: providerName,
          usage: response.usage,
        };
      } catch (error) {
        lastError = error;

        if (isRateLimitError(error)) {
          const backoffDelay = calculateBackoff(
            attempt,
            config.baseDelay,
            config.maxDelay,
          );

          // Extract retry-after header if available
          const retryAfterHeader = error.headers?.["retry-after"];
          const retryAfterMs = retryAfterHeader
            ? parseInt(retryAfterHeader) * 1000
            : backoffDelay;

          console.log(
            `[${providerName}] Rate limit hit (attempt ${attempt + 1}/${config.maxRetries + 1}), backing off ${retryAfterMs}ms...`,
          );

          // Store rate limit state
          this.rateLimitState[providerName] = {
            retryAfter: Date.now() + retryAfterMs,
            lastError: error.message,
          };

          if (attempt < config.maxRetries) {
            await sleep(retryAfterMs);
            continue;
          }
        }

        // Non-rate-limit error, don't retry
        if (!isRateLimitError(error)) {
          break;
        }
      }
    }

    console.error(
      `[${providerName}] Error after ${config.maxRetries + 1} attempts:`,
      lastError?.message,
    );
    throw new Error(`${providerName} API error: ${lastError?.message}`);
  }

  /**
   * Call Anthropic API directly (different format from OpenAI)
   */
  async callAnthropicAPI(apiKey, model, messages, options) {
    // Convert OpenAI message format to Anthropic format
    let systemPrompt = "";
    const anthropicMessages = [];

    for (const msg of messages) {
      if (msg.role === "system") {
        systemPrompt = msg.content;
      } else {
        anthropicMessages.push({
          role: msg.role === "assistant" ? "assistant" : "user",
          content: msg.content,
        });
      }
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: options.max_tokens || 4000,
        temperature: options.temperature || 0.7,
        system: systemPrompt || undefined,
        messages: anthropicMessages,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.error?.message || `Anthropic API error: ${response.status}`,
      );
    }

    const data = await response.json();

    return {
      content: data.content[0]?.text || "",
      model: data.model,
      provider: "anthropic",
      usage: {
        prompt_tokens: data.usage?.input_tokens,
        completion_tokens: data.usage?.output_tokens,
        total_tokens:
          (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
      },
    };
  }

  /**
   * Smart fallback: Try providers in order, skipping rate-limited ones
   * Prioritizes free-tier providers
   */
  async createCompletionWithFallback(
    preferredProvider,
    model,
    messages,
    options = {},
  ) {
    // Prioritize free-tier providers in fallback order
    const providers = [
      preferredProvider,
      "groq", // Free: 14,400 req/day
      "cerebras", // Free tier
      "openrouter", // Free models available
      "together", // $5 free credits
      "openai", // Paid only
      "anthropic", // Paid only - Claude models
    ];
    const tried = new Set();
    const errors = [];

    for (const provider of providers) {
      if (tried.has(provider) || !this.providers[provider]) continue;

      tried.add(provider);

      // Skip providers that are currently rate limited (unless it's our last option)
      if (
        this.isProviderRateLimited(provider) &&
        tried.size < providers.filter((p) => this.providers[p]).length
      ) {
        console.log(`[Fallback] Skipping ${provider} (rate limited)`);
        continue;
      }

      // Use provider's default model if the specified model isn't available
      const providerModels = this.providers[provider].models;
      const useModel = providerModels.includes(model)
        ? model
        : providerModels[0];

      try {
        console.log(
          `[Fallback] Attempting ${provider} with model ${useModel}...`,
        );
        return await this.createCompletion(
          provider,
          useModel,
          messages,
          options,
        );
      } catch (error) {
        console.log(`[Fallback] ${provider} failed: ${error.message}`);
        errors.push({ provider, error: error.message });
        continue;
      }
    }

    const errorSummary = errors
      .map((e) => `${e.provider}: ${e.error}`)
      .join("; ");
    throw new Error(`All AI providers failed. Errors: ${errorSummary}`);
  }

  /**
   * Get current rate limit status for all providers
   */
  getRateLimitStatus() {
    const status = {};
    const now = Date.now();

    for (const [name, provider] of Object.entries(this.providers)) {
      if (!provider) {
        status[name] = { configured: false };
        continue;
      }

      const state = this.rateLimitState[name];
      if (state && now < state.retryAfter) {
        status[name] = {
          configured: true,
          rateLimited: true,
          retryIn: Math.ceil((state.retryAfter - now) / 1000),
          lastError: state.lastError,
        };
      } else {
        status[name] = {
          configured: true,
          rateLimited: false,
        };
      }
    }

    return status;
  }
}

// Export singleton instance
export const aiManager = new AIProviderManager();
