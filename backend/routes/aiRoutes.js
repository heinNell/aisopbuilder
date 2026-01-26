import express from "express";
import { aiManager } from "../services/aiProviders.js";

const router = express.Router();

/**
 * GET /api/ai/providers
 * List all available AI providers and their models
 */
router.get("/providers", (req, res) => {
  try {
    const providers = aiManager.getAvailableProviders();
    res.json({
      providers,
      activeCount: Object.keys(providers).length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/ai/health
 * Test all configured AI providers and return their status
 * Useful for monitoring and debugging rate limits
 */
router.get("/health", async (req, res) => {
  try {
    const providerStatus = await aiManager.testAllProviders();
    const rateLimitStatus = aiManager.getRateLimitStatus();

    // Combine the status info
    const combined = {};
    for (const [name, status] of Object.entries(providerStatus)) {
      combined[name] = {
        ...status,
        ...rateLimitStatus[name],
      };
    }

    const healthyCount = Object.values(combined).filter(
      (p) => p.available,
    ).length;
    const configuredCount = Object.values(combined).filter(
      (p) => p.configured,
    ).length;

    res.json({
      status: healthyCount > 0 ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      providers: combined,
      summary: {
        healthy: healthyCount,
        configured: configuredCount,
        rateLimited: Object.values(combined).filter((p) => p.rateLimited)
          .length,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/ai/health/:provider
 * Test a specific AI provider
 */
router.get("/health/:provider", async (req, res) => {
  try {
    const { provider } = req.params;
    const { model } = req.query;

    const status = await aiManager.testProvider(provider, model);
    const rateLimitStatus = aiManager.getRateLimitStatus()[provider] || {};

    res.json({
      provider,
      timestamp: new Date().toISOString(),
      ...status,
      ...rateLimitStatus,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/ai/rate-limits
 * Get current rate limit status for all providers
 */
router.get("/rate-limits", (req, res) => {
  try {
    const status = aiManager.getRateLimitStatus();

    res.json({
      timestamp: new Date().toISOString(),
      providers: status,
      anyRateLimited: Object.values(status).some((p) => p.rateLimited),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/ai/complete
 * Universal completion endpoint for any provider
 *
 * Body: {
 *   provider: 'openai' | 'groq' | 'openrouter' | 'together',
 *   model: 'gpt-4' | 'llama-3.1-70b-versatile' | etc,
 *   messages: [{ role: 'user', content: '...' }],
 *   options: { temperature, maxTokens, etc }
 * }
 */
router.post("/complete", async (req, res) => {
  try {
    const { provider = "openai", model, messages, options = {} } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    const result = await aiManager.createCompletion(
      provider,
      model,
      messages,
      options,
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/ai/complete-with-fallback
 * Try multiple providers automatically until one succeeds
 */
router.post("/complete-with-fallback", async (req, res) => {
  try {
    const { provider = "groq", model, messages, options = {} } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    const result = await aiManager.createCompletionWithFallback(
      provider,
      model,
      messages,
      options,
    );

    res.json({
      success: true,
      data: result,
      message: `Used ${result.provider} provider`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
