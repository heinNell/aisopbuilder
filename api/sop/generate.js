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
    const {
      topic,
      department,
      complexity,
      additionalContext,
      provider = "groq",
      model,
    } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const aiManager = getAIManager();
    const useModel =
      model ||
      aiManager.providers[provider]?.models[0] ||
      "llama-3.3-70b-versatile";

    const userPrompt = `Generate a comprehensive Standard Operating Procedure for the following:

Topic: ${topic}
Department: ${department || "General"}
Complexity Level: ${complexity || "Medium"}
Additional Context: ${additionalContext || "None"}

Please create a complete SOP document with:
1. Document Information (Title, Document ID, Version, Date, Approval)
2. Purpose and Objective
3. Scope and Applicability
4. Definitions and Acronyms (if needed)
5. Responsibilities
6. Required Materials/Equipment
7. Detailed Procedure (numbered steps with sub-steps)
8. Safety and Compliance Considerations
9. Quality Control Checkpoints
10. References and Related Documents
11. Revision History

Format the output in clear, professional Markdown format.`;

    const result = await aiManager.createCompletionWithFallback(
      provider,
      useModel,
      [
        { role: "system", content: SOP_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      { temperature: 0.7, max_tokens: 4000 },
    );

    res.status(200).json({
      success: true,
      sop: result.content,
      metadata: {
        topic,
        department,
        complexity,
        generatedAt: new Date().toISOString(),
        provider: result.provider,
        model: result.model,
      },
    });
  } catch (error) {
    console.error("Error generating SOP:", error);
    res.status(500).json({
      error: "Failed to generate SOP",
      details: error.message,
    });
  }
}
