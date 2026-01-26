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
    const { text, focus = "general", provider = "groq", model } = req.body;

    if (!text) {
      return res.status(400).json({ error: "SOP text is required" });
    }

    const aiManager = getAIManager();
    const useModel =
      model ||
      aiManager.providers[provider]?.models[0] ||
      "llama-3.3-70b-versatile";

    const focusGuidance = {
      general: "overall quality, structure, clarity, and professionalism",
      clarity: "clarity, readability, and ease of understanding",
      structure: "document structure, organization, and formatting",
      compliance: "regulatory compliance, safety standards, and best practices",
      detail: "level of detail, specificity, and completeness",
    };

    const userPrompt = `Improve the following SOP document. Focus on: ${focusGuidance[focus] || focusGuidance.general}.

## 📄 Original SOP:
${text}

---

## 📋 Your Task:

**PART 1 - IMPROVED SOP:**
Return the COMPLETE improved SOP document in proper Markdown format. This should be ready to use as-is. Include:
- All original essential information (preserved and enhanced)
- Proper document header (Title, ID, Version, Date, Owner)
- Well-structured sections with clear headings
- Professional formatting with tables, lists, and callouts
- ISO 9001 compliant structure

**PART 2 - IMPROVEMENT FEEDBACK:**
After the SOP, add a separator (---) and provide feedback in a table:

---

## 📊 Improvement Summary

| Category | Original Status | Changes Made | Impact |
|----------|-----------------|--------------|--------|
| Structure | ... | ... | ... |
| Clarity | ... | ... | ... |
| Completeness | ... | ... | ... |
| Compliance | ... | ... | ... |
| Formatting | ... | ... | ... |

### 🎯 Key Improvements Made:
- List the main changes

### 💡 Recommendations for Future Updates:
- List any suggestions for further enhancement

---

**IMPORTANT:** The improved SOP above the separator should be a complete, standalone document ready for immediate use.`;

    const result = await aiManager.createCompletionWithFallback(
      provider,
      useModel,
      [
        { role: "system", content: SOP_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      { temperature: 0.6, max_tokens: 4000 },
    );

    res.status(200).json({
      success: true,
      improvedSOP: result.content,
      originalLength: text.length,
      improvedLength: result.content.length,
      provider: result.provider,
      model: result.model,
    });
  } catch (error) {
    console.error("Error improving SOP:", error);
    res.status(500).json({
      error: "Failed to improve SOP",
      details: error.message,
    });
  }
}
