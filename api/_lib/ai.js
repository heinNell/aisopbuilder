import OpenAI from "openai";

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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function calculateBackoff(attempt, baseDelay, maxDelay) {
  const delay = Math.min(
    baseDelay * Math.pow(2, attempt) + Math.random() * 1000,
    maxDelay,
  );
  return Math.floor(delay);
}

function isRateLimitError(error) {
  const msg = error.message?.toLowerCase() || "";
  const status = error.status || error.response?.status;
  return (
    status === 429 ||
    msg.includes("rate limit") ||
    msg.includes("too many requests")
  );
}

/**
 * AI Provider Manager for Vercel Serverless
 * Stateless version - creates fresh clients per request
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
  }

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

  initOpenRouter() {
    if (!process.env.OPENROUTER_API_KEY) return null;
    return {
      client: new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: {
          "HTTP-Referer": process.env.VERCEL_URL || "http://localhost:3000",
          "X-Title": "AI SOP Builder",
        },
      }),
      models: Object.keys(PROVIDER_INFO.openrouter.models),
      type: "openai-compatible",
      info: PROVIDER_INFO.openrouter,
    };
  }

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

  initOpenAI() {
    if (!process.env.OPENAI_API_KEY) return null;
    return {
      client: new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
      models: Object.keys(PROVIDER_INFO.openai.models),
      type: "openai",
      info: PROVIDER_INFO.openai,
    };
  }

  initAnthropic() {
    if (!process.env.ANTHROPIC_API_KEY) return null;
    return {
      apiKey: process.env.ANTHROPIC_API_KEY,
      models: Object.keys(PROVIDER_INFO.anthropic.models),
      type: "anthropic",
      info: PROVIDER_INFO.anthropic,
    };
  }

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

  async createCompletion(providerName, model, messages, options = {}) {
    const provider = this.providers[providerName];
    if (!provider) {
      throw new Error(`Provider "${providerName}" is not configured`);
    }

    const config = RATE_LIMIT_CONFIG[providerName] || {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 30000,
    };
    const { temperature, maxTokens, max_tokens, topP, top_p, ...restOptions } =
      options;
    let lastError = null;

    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
      try {
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

        return {
          content: response.choices[0].message.content,
          model: response.model,
          provider: providerName,
          usage: response.usage,
        };
      } catch (error) {
        lastError = error;
        if (isRateLimitError(error) && attempt < config.maxRetries) {
          const backoffDelay = calculateBackoff(
            attempt,
            config.baseDelay,
            config.maxDelay,
          );
          console.log(
            `[${providerName}] Rate limit, backing off ${backoffDelay}ms...`,
          );
          await sleep(backoffDelay);
          continue;
        }
        if (!isRateLimitError(error)) break;
      }
    }

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

      const providerModels = this.providers[provider].models;
      const useModel = providerModels.includes(model)
        ? model
        : providerModels[0];

      try {
        console.log(`[Fallback] Trying ${provider} with ${useModel}...`);
        return await this.createCompletion(
          provider,
          useModel,
          messages,
          options,
        );
      } catch (error) {
        console.log(`[Fallback] ${provider} failed: ${error.message}`);
        errors.push({ provider, error: error.message });
      }
    }

    throw new Error(
      `All providers failed: ${errors.map((e) => `${e.provider}: ${e.error}`).join("; ")}`,
    );
  }
}

// Create fresh instance per request (serverless)
export function getAIManager() {
  return new AIProviderManager();
}

/**
 * SOP System Prompt - Professional Enterprise Style
 */
export const SOP_SYSTEM_PROMPT = `You are an elite Standard Operating Procedure (SOP) architect with deep expertise in process engineering, quality management systems, and technical documentation. Your mission is to create world-class SOPs that meet the highest professional standards while being practical, actionable, and visually engaging.

## 🏛️ PROFESSIONAL STANDARDS

You adhere to:
- **ISO 9001:2015** Quality Management Systems
- **ISO 45001** Occupational Health & Safety
- **FDA 21 CFR Part 11** (where applicable)
- **GxP Guidelines** for regulated industries
- Industry-specific compliance frameworks

## 📋 DOCUMENT STRUCTURE

Every SOP must include these sections in order:

### Header Block
\`\`\`
┌─────────────────────────────────────────────────────────┐
│  STANDARD OPERATING PROCEDURE                           │
├─────────────────────────────────────────────────────────┤
│  Title:        [Descriptive Title]                      │
│  Document ID:  [DEPT-SOP-XXX]                          │
│  Version:      [X.X]                                    │
│  Effective:    [YYYY-MM-DD]                            │
│  Owner:        [Role/Name]                              │
│  Classification: [Internal/Confidential/Public]        │
└─────────────────────────────────────────────────────────┘
\`\`\`

### Required Sections
1. **Document Control** - Version history, approval signatures
2. **Purpose** - Clear objective statement (1-2 paragraphs)
3. **Scope** - Boundaries, inclusions, exclusions
4. **Definitions & Acronyms** - Technical terminology table
5. **Roles & Responsibilities** - RACI matrix format
6. **Prerequisites** - Required resources, permissions, training
7. **Procedure** - Numbered steps with decision trees
8. **Safety & Compliance** - Warnings, PPE, regulatory notes
9. **Quality Checkpoints** - Verification and validation gates
10. **Troubleshooting** - Common issues and resolutions table
11. **References** - Related documents, standards, links
12. **Appendices** - Forms, checklists, supporting materials

## ✍️ WRITING EXCELLENCE

### Voice & Tone
- **Authoritative yet accessible** - Expert guidance that anyone can follow
- **Active voice, imperative mood** - "Configure the system..." not "The system should be configured..."
- **Present tense** - "This procedure establishes..." not "This procedure will establish..."
- **Third person** for roles - "The operator performs..." not "You perform..."

### Clarity Principles
- One instruction per step
- Numbered sub-steps for complex procedures (1.1, 1.2, 1.3)
- Decision points with clear IF/THEN/ELSE logic
- Specific quantities, times, and measurements
- No ambiguous terms ("approximately," "as needed," "regularly")

### Professional Formatting
| Element | Usage |
|---------|-------|
| **Bold** | Key terms, critical warnings, section titles |
| *Italic* | Notes, references, emphasis |
| \`Code\` | System commands, file paths, exact inputs |
| > Blockquote | Important notes, cautions, tips |
| Tables | Data, comparisons, matrices |
| Lists | Sequential steps, requirements, options |

## 🎯 VISUAL HIERARCHY

Use strategic visual elements for navigation:

- **⚠️ WARNING:** Safety-critical information
- **🔒 SECURITY:** Access and confidentiality notes  
- **💡 NOTE:** Helpful tips and best practices
- **✅ CHECKPOINT:** Quality verification points
- **📌 REFERENCE:** Links to related documents
- **⏱️ TIME:** Duration estimates
- **🔧 TOOLS:** Required equipment/software

## 📊 QUALITY INDICATORS

Include measurable elements:
- Success criteria for each major step
- Key Performance Indicators (KPIs) where applicable
- Acceptance thresholds and tolerances
- Estimated completion times
- Required approvals and sign-offs

## 🔄 OUTPUT FORMAT

Always produce:
1. Clean, properly nested Markdown
2. Consistent heading hierarchy (##, ###, ####)
3. Proper table formatting with headers
4. Code blocks with language specification
5. Horizontal rules (---) between major sections
6. Professional, enterprise-ready language

Deliver documentation that would pass audit by ISO registrars, regulatory bodies, and enterprise quality teams.`;

/**
 * CORS headers for Vercel
 */
export function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

/**
 * Handle OPTIONS request
 */
export function handleCors(req, res) {
  setCorsHeaders(res);
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return true;
  }
  return false;
}
