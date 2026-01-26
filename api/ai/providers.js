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

    res.status(200).json({
      providers,
      activeCount: Object.keys(providers).length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
