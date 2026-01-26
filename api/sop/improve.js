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

## 📋 CRITICAL OUTPUT FORMAT INSTRUCTIONS:

You MUST structure your response in EXACTLY two separate parts with a clear delimiter between them.

═══════════════════════════════════════════════════════════════════════════════
PART 1: IMPROVED SOP (This part will be copied and used as-is)
═══════════════════════════════════════════════════════════════════════════════

Output the COMPLETE improved SOP document. This section must:
- Contain ONLY the SOP content itself - NO explanatory text, NO comments about changes
- Be 100% ready for copy-paste into a real document
- Include proper document header (Title, ID, Version, Date, Owner)
- Have well-structured sections with clear headings
- Use professional formatting with tables, lists, and callouts
- Follow ISO 9001 compliant structure
- Preserve all essential information from the original

❌ DO NOT include in the SOP section:
- "I improved this by..."
- "This section was enhanced..."
- "Changes made here include..."
- Any meta-commentary about the improvements
- Any explanations of what was changed

✅ Include ONLY the actual SOP content as if it were the final production document.

After the complete SOP, add this EXACT delimiter:

<!-- FEEDBACK_SEPARATOR -->

═══════════════════════════════════════════════════════════════════════════════
PART 2: IMPROVEMENT FEEDBACK (Separate section - not for copy-paste)
═══════════════════════════════════════════════════════════════════════════════

After the delimiter, provide your feedback about the improvements:

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
- List any suggestions for further enhancement`;

    const result = await aiManager.createCompletionWithFallback(
      provider,
      useModel,
      [
        { role: "system", content: SOP_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      { temperature: 0.6, max_tokens: 4000 },
    );

    // Parse the response to separate the improved SOP from the feedback
    const fullContent = result.content;
    let improvedSOP = fullContent;
    let improvementFeedback = '';

    // Primary delimiter - HTML comment (most reliable)
    const primaryDelimiter = '<!-- FEEDBACK_SEPARATOR -->';
    let delimiterIndex = fullContent.indexOf(primaryDelimiter);
    
    if (delimiterIndex !== -1) {
      improvedSOP = fullContent.substring(0, delimiterIndex).trim();
      improvementFeedback = fullContent.substring(delimiterIndex + primaryDelimiter.length).trim();
    } else {
      // Fallback markers if primary delimiter not found
      const feedbackMarkers = [
        '## 📊 Improvement Summary',
        '## Improvement Summary',
        '═══════════════════════════════════════════════════════════════════════════════\nPART 2',
        'PART 2: IMPROVEMENT FEEDBACK',
      ];

      for (const marker of feedbackMarkers) {
        const markerIndex = fullContent.indexOf(marker);
        if (markerIndex !== -1) {
          // Find the start of the feedback section (including any preceding separator or delimiter line)
          let feedbackStart = markerIndex;
          
          // Check for preceding separators (---, ═══, etc.)
          const beforeMarker = fullContent.substring(Math.max(0, markerIndex - 100), markerIndex);
          const separatorPatterns = ['---', '═══'];
          
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
      .replace(/^═+\s*\n.*?IMPROVED SOP.*?\n═+\s*\n/gim, '')
      .replace(/^PART 1:.*?\n/gim, '')
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
