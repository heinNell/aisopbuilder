import {
    getAIManager,
    handleCors,
    setCorsHeaders,
    SOP_SYSTEM_PROMPT,
} from "../_lib/ai.js";

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  setCorsHeaders(res);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text, provider = "groq", model } = req.body;

    if (!text) {
      return res.status(400).json({ error: "SOP text is required" });
    }

    const aiManager = getAIManager();
    const useModel =
      model ||
      aiManager.providers[provider]?.models[0] ||
      "llama-3.3-70b-versatile";

    const userPrompt = `Create an executive summary for this SOP:

${text}

Provide a concise executive summary that includes:
1. Document title and purpose
2. Key objectives (2-3 bullet points)
3. Primary responsibilities
4. Critical steps overview
5. Compliance requirements

Keep the summary under 300 words and format in professional Markdown.`;

    const result = await aiManager.createCompletionWithFallback(
      provider,
      useModel,
      [
        { role: "system", content: SOP_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      { temperature: 0.5, max_tokens: 1000 },
    );

    res.status(200).json({
      success: true,
      summary: result.content,
      provider: result.provider,
      model: result.model,
    });
  } catch (error) {
    console.error("Error summarizing SOP:", error);
    res.status(500).json({
      error: "Failed to summarize SOP",
      details: error.message,
    });
  }
}
