import OpenAI from 'openai';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Unified AI Provider Manager
 * Supports: OpenAI, OpenRouter, Groq, and Together AI (Llama models)
 */
export class AIProviderManager {
  constructor() {
    this.providers = {
      openai: this.initOpenAI(),
      openrouter: this.initOpenRouter(),
      groq: this.initGroq(),
      together: this.initTogether(),
    };
  }

  // OpenAI Configuration
  initOpenAI() {
    if (!process.env.OPENAI_API_KEY) return null;
    
    return {
      client: new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
      models: ['gpt-4o', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo'],
      type: 'openai',
    };
  }

  // OpenRouter Configuration (Access to 100+ models)
  initOpenRouter() {
    if (!process.env.OPENROUTER_API_KEY) return null;
    
    return {
      client: new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: 'https://openrouter.ai/api/v1',
        defaultHeaders: {
          'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
          'X-Title': 'AI SOP Builder',
        },
      }),
      models: [
        'anthropic/claude-3.5-sonnet',
        'google/gemini-pro-1.5',
        'meta-llama/llama-3.1-70b-instruct',
        'mistralai/mistral-7b-instruct',
        'openai/gpt-4-turbo',
      ],
      type: 'openai-compatible',
    };
  }

  // Groq Configuration (Fast and free tier available)
  initGroq() {
    if (!process.env.GROQ_API_KEY) return null;
    
    return {
      client: new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: 'https://api.groq.com/openai/v1',
      }),
      models: [
        'llama-3.3-70b-versatile',
        'llama-3.1-70b-versatile',
        'mixtral-8x7b-32768',
        'gemma2-9b-it',
      ],
      type: 'openai-compatible',
    };
  }

  // Together AI Configuration (Llama models)
  initTogether() {
    if (!process.env.TOGETHER_API_KEY) return null;
    
    return {
      client: new OpenAI({
        apiKey: process.env.TOGETHER_API_KEY,
        baseURL: 'https://api.together.xyz/v1',
      }),
      models: [
        'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
        'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
        'mistralai/Mixtral-8x7B-Instruct-v0.1',
      ],
      type: 'openai-compatible',
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
        };
      }
    }
    
    return available;
  }

  /**
   * Universal completion method that works with all providers
   */
  async createCompletion(providerName, model, messages, options = {}) {
    const provider = this.providers[providerName];
    
    if (!provider) {
      throw new Error(`Provider "${providerName}" is not configured. Add API key to .env`);
    }
    
    try {
      const response = await provider.client.chat.completions.create({
        model,
        messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 4000,
        top_p: options.topP || 1,
        ...options,
      });
      
      return {
        content: response.choices[0].message.content,
        model: response.model,
        provider: providerName,
        usage: response.usage,
      };
    } catch (error) {
      console.error(`Error with ${providerName}:`, error.message);
      throw new Error(`${providerName} API error: ${error.message}`);
    }
  }

  /**
   * Smart fallback: Try providers in order until one succeeds
   */
  async createCompletionWithFallback(preferredProvider, model, messages, options = {}) {
    const providers = [preferredProvider, 'groq', 'openrouter', 'openai', 'together'];
    const tried = new Set();
    
    for (const provider of providers) {
      if (tried.has(provider) || !this.providers[provider]) continue;
      
      tried.add(provider);
      
      try {
        console.log(`Attempting ${provider} with model ${model}...`);
        return await this.createCompletion(provider, model, messages, options);
      } catch (error) {
        console.log(`${provider} failed, trying next...`);
        continue;
      }
    }
    
    throw new Error('All AI providers failed. Please check your API keys.');
  }
}

// Export singleton instance
export const aiManager = new AIProviderManager();
