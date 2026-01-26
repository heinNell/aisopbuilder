import { getAIManager, handleCors, setCorsHeaders } from "../_lib/ai.js";

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  setCorsHeaders(res);

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const aiManager = getAIManager();
    const providers = aiManager.getAvailableProviders();
    const results = {};

    // Test each provider with a simple request
    for (const [name, config] of Object.entries(providers)) {
      const startTime = Date.now();

      try {
        await aiManager.createCompletion(
          name,
          config.models[0],
          [{ role: "user", content: 'Say "ok"' }],
          { max_tokens: 5, temperature: 0 },
        );

        results[name] = {
          available: true,
          configured: true,
          responseTime: Date.now() - startTime,
          model: config.models[0],
        };
      } catch (error) {
        results[name] = {
          available: false,
          configured: true,
          responseTime: Date.now() - startTime,
          error: error.message,
          rateLimited:
            error.message.includes("rate") || error.message.includes("429"),
        };
      }
    }

    // Add unconfigured providers
    for (const name of ["openai", "groq", "openrouter", "together"]) {
      if (!results[name]) {
        results[name] = { available: false, configured: false };
      }
    }

    const healthyCount = Object.values(results).filter(
      (p) => p.available,
    ).length;
    const configuredCount = Object.values(results).filter(
      (p) => p.configured,
    ).length;

    res.status(200).json({
      status: healthyCount > 0 ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      providers: results,
      summary: {
        healthy: healthyCount,
        configured: configuredCount,
        rateLimited: Object.values(results).filter((p) => p.rateLimited).length,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
