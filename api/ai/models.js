import {
    getAIManager,
    handleCors,
    PROVIDER_INFO,
    setCorsHeaders,
} from "../_lib/ai.js";

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  setCorsHeaders(res);

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const aiManager = getAIManager();
    const configuredProviders = aiManager.getAvailableProviders();

    // Build comprehensive model list
    const allModels = [];
    const providerSummary = {};

    for (const [providerName, info] of Object.entries(PROVIDER_INFO)) {
      const isConfigured = !!configuredProviders[providerName];

      providerSummary[providerName] = {
        name: info.name,
        description: info.description,
        freeTier: info.freeTier,
        freeLimit: info.freeLimit,
        website: info.website,
        configured: isConfigured,
        modelCount: Object.keys(info.models).length,
      };

      for (const [modelName, modelInfo] of Object.entries(info.models)) {
        allModels.push({
          provider: providerName,
          providerName: info.name,
          model: modelName,
          context: modelInfo.context,
          speed: modelInfo.speed,
          quality: modelInfo.quality,
          free: modelInfo.free,
          available: isConfigured,
        });
      }
    }

    // Separate free and paid models
    const freeModels = allModels.filter((m) => m.free && m.available);
    const paidModels = allModels.filter((m) => !m.free && m.available);
    const unavailableModels = allModels.filter((m) => !m.available);

    res.status(200).json({
      success: true,
      summary: {
        totalProviders: Object.keys(PROVIDER_INFO).length,
        configuredProviders: Object.keys(configuredProviders).length,
        totalModels: allModels.length,
        availableFreeModels: freeModels.length,
        availablePaidModels: paidModels.length,
      },
      providers: providerSummary,
      models: {
        free: freeModels,
        paid: paidModels,
        unavailable: unavailableModels,
      },
      // Quick reference for UI dropdowns
      quickSelect: {
        recommendedFree: freeModels.length > 0 ? freeModels[0] : null,
        fastest:
          freeModels.find((m) => m.speed === "ultra-fast") || freeModels[0],
        highestQuality:
          freeModels.find((m) => m.quality === "high") || freeModels[0],
      },
    });
  } catch (error) {
    console.error("Error fetching models:", error);
    res.status(500).json({
      error: "Failed to fetch models",
      details: error.message,
    });
  }
}
