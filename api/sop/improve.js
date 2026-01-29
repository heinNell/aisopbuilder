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
      general: "overall quality, clarity, detail, and professionalism",
      clarity: "clarity, readability, and ease of understanding",
      structure: "logical flow, organization, and sequencing",
      compliance: "regulatory compliance, safety standards, and best practices",
      detail: "level of detail, specificity, and completeness",
    };

    const userPrompt = `Improve the following content point by point. Focus on: ${focusGuidance[focus] || focusGuidance.general}.

## Original Content:
${text}

---

## INSTRUCTIONS:

Improve the content directly WITHOUT adding any document structure, headers, metadata, dates, version numbers, or introductory text.

**What to do:**
- Take each point/section/step from the original and enhance it in place
- Add more detail and specificity where needed
- Improve sentence construction for better clarity
- Use clearer, more professional language
- Maintain the same overall structure and order as the original
- Keep all the original information but express it better
- Use active voice and imperative mood where appropriate

**What NOT to do:**
- Do NOT add document headers (Title, ID, Version, Date, Owner, etc.)
- Do NOT add an introduction or preamble
- Do NOT restructure into a formal SOP template
- Do NOT add sections that weren't in the original
- Do NOT embed enhancement suggestions within the improved content
- Do NOT add meta-commentary inside the improved content
- Do NOT wrap content in document formatting blocks

---

## OUTPUT FORMAT (STRICTLY FOLLOW):

**SECTION 1 - IMPROVED CONTENT:**
Output ONLY the improved content here. This must be clean, complete, and ready for direct use. No commentary, no suggestions embedded within it.

Then add this EXACT delimiter on its own line:

<!-- FEEDBACK_SEPARATOR -->

**SECTION 2 - ENHANCEMENT SUGGESTIONS (SEPARATE BLOCK):**
This section is COMPLETELY SEPARATE from the improved content above. Include:

## 📊 Improvement Summary

### 🎯 Key Improvements Made:
- Bullet point each change you made (3-5 items)

### 💡 Suggestions for Further Enhancement:
- List any additional recommendations for future improvements
- These suggestions should NOT be applied in Section 1
- They are ideas for the user to consider separately

CRITICAL: The delimiter <!-- FEEDBACK_SEPARATOR --> MUST appear between the two sections. The enhanced suggestions must NEVER appear within the improved content itself.`;

    const result = await aiManager.createCompletionWithFallback(
      provider,
      useModel,
      [
        { role: "system", content: SOP_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      { temperature: 0.6, max_tokens: 4000 },
    );

    if (!result || !result.content) {
      return res.status(500).json({
        error: "Failed to improve SOP",
        details: "AI provider returned empty response",
      });
    }

    // Parse the response to separate the improved SOP from the feedback
    const fullContent = result.content;
    let improvedSOP = fullContent;
    let improvementFeedback = "";

    // Primary delimiter - HTML comment (most reliable)
    const primaryDelimiter = "<!-- FEEDBACK_SEPARATOR -->";
    let delimiterIndex = fullContent.indexOf(primaryDelimiter);

    if (delimiterIndex !== -1) {
      improvedSOP = fullContent.substring(0, delimiterIndex).trim();
      improvementFeedback = fullContent
        .substring(delimiterIndex + primaryDelimiter.length)
        .trim();
    } else {
      // Fallback markers if primary delimiter not found
      const feedbackMarkers = [
        "## 📊 Improvement Summary",
        "## Improvement Summary",
        "═══════════════════════════════════════════════════════════════════════════════\nPART 2",
        "PART 2: IMPROVEMENT FEEDBACK",
      ];

      for (const marker of feedbackMarkers) {
        const markerIndex = fullContent.indexOf(marker);
        if (markerIndex !== -1) {
          // Find the start of the feedback section (including any preceding separator or delimiter line)
          let feedbackStart = markerIndex;

          // Check for preceding separators (---, ═══, etc.)
          const beforeMarker = fullContent.substring(
            Math.max(0, markerIndex - 100),
            markerIndex,
          );
          const separatorPatterns = ["---", "═══"];

          for (const sep of separatorPatterns) {
            const sepIndex = beforeMarker.lastIndexOf(sep);
            if (sepIndex !== -1) {
              feedbackStart = markerIndex - (beforeMarker.length - sepIndex);
              break;
            }
          }

          improvedSOP = fullContent.substring(0, feedbackStart).trim();
          improvementFeedback = fullContent.substring(markerIndex).trim();
          break;
        }
      }
    }

    // Clean up the improved SOP - remove any remaining commentary headers
    improvedSOP = improvedSOP
      .replace(/^═+\s*\n.*?IMPROVED SOP.*?\n═+\s*\n/gim, "")
      .replace(/^PART 1:.*?\n/gim, "")
      .trim();

    res.status(200).json({
      success: true,
      improvedSOP: improvedSOP,
      improvementFeedback: improvementFeedback,
      originalLength: text.length,
      improvedLength: improvedSOP.length,
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
