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

    const userPrompt = `Analyze this SOP document and provide a comprehensive quality assessment:

${text}

Provide detailed analysis covering:
1. **Structure & Organization** - Evaluate document structure and logical flow
2. **Clarity & Readability** - Assess language clarity and ease of understanding
3. **Completeness** - Check for missing essential sections or information
4. **Compliance** - Verify alignment with ISO 9001 and industry standards
5. **Actionability** - Evaluate how well procedures can be followed
6. **Safety & Risk** - Identify safety considerations and risk management
7. **Quality Score** - Overall rating (1-10) with justification
8. **Specific Recommendations** - Prioritized list of improvements

Format as a detailed professional analysis report in Markdown.`;

    const result = await aiManager.createCompletionWithFallback(
      provider,
      useModel,
      [
        { role: "system", content: SOP_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      { temperature: 0.5, max_tokens: 3000 },
    );

    res.status(200).json({
      success: true,
      analysis: result.content,
      provider: result.provider,
      model: result.model,
    });
  } catch (error) {
    console.error("Error analyzing SOP:", error);
    res.status(500).json({
      error: "Failed to analyze SOP",
      details: error.message,
    });
  }
}
