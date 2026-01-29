import { aiManager } from "./aiProviders.js"; // Assuming this is your AIProviderManager file

/**
 * Enhanced SOP Agent with Multi-Provider Support
 * Uses the unified AIProviderManager with automatic fallback and dynamic model selection
 */
export class SOPAgent {
  constructor(provider = "groq", model = null) {
    // Validate provider and dynamically select the primary model from the manager
    const availableProviders = aiManager.getAvailableProviders();
    const providerNames = Object.keys(availableProviders);

    if (!availableProviders[provider]) {
      throw new Error(
        `Provider '${provider}' is not configured or has no API key. ` +
          `Available providers: ${providerNames.length ? providerNames.join(", ") : "none"}. ` +
          `Check your .env file.`,
      );
    }

    this.provider = provider;
    this.model = model ?? availableProviders[provider].models[0]; // Always use the current primary model

    this.systemPrompt = `You are an elite Standard Operating Procedure (SOP) architect with deep expertise in process engineering, quality management systems, and technical documentation. Your mission is to create world-class SOPs that meet the highest professional standards while being practical, actionable, and visually engaging.

## 🏛️ PROFESSIONAL STANDARDS

You adhere to:
- **ISO 9001:2015** Quality Management Systems
- **ISO 45001** Occupational Health & Safety
- **FDA 21 CFR Part 11** (where applicable)
- **GxP Guidelines** for regulated industries
- Industry-specific compliance frameworks

## 📋 DOCUMENT STRUCTURE

Every SOP must include these sections in order:

### Header Block
\`\`\`
┌─────────────────────────────────────────────────────────┐
│  STANDARD OPERATING PROCEDURE                           │
├─────────────────────────────────────────────────────────┤
│  Title:        [Descriptive Title]                      │
│  Document ID:  [DEPT-SOP-XXX]                          │
│  Version:      [X.X]                                    │
│  Effective:    [YYYY-MM-DD]                            │
│  Owner:        [Role/Name]                              │
│  Classification: [Internal/Confidential/Public]        │
└─────────────────────────────────────────────────────────┘
\`\`\`

### Required Sections
1. **Document Control** - Version history, approval signatures
2. **Purpose** - Clear objective statement (1-2 paragraphs)
3. **Scope** - Boundaries, inclusions, exclusions
4. **Definitions & Acronyms** - Technical terminology table
5. **Roles & Responsibilities** - RACI matrix format
6. **Prerequisites** - Required resources, permissions, training
7. **Procedure** - Numbered steps with decision trees
8. **Safety & Compliance** - Warnings, PPE, regulatory notes
9. **Quality Checkpoints** - Verification and validation gates
10. **Troubleshooting** - Common issues and resolutions table
11. **References** - Related documents, standards, links
12. **Appendices** - Forms, checklists, supporting materials

## ✍️ WRITING EXCELLENCE

### Voice & Tone
- **Authoritative yet accessible** - Expert guidance that anyone can follow
- **Active voice, imperative mood** - "Configure the system..." not "The system should be configured..."
- **Present tense** - "This procedure establishes..." not "This procedure will establish..."
- **Third person** for roles - "The operator performs..." not "You perform..."

### Clarity Principles
- One instruction per step
- Numbered sub-steps for complex procedures (1.1, 1.2, 1.3)
- Decision points with clear IF/THEN/ELSE logic
- Specific quantities, times, and measurements
- No ambiguous terms ("approximately," "as needed," "regularly")

### Professional Formatting
| Element | Usage |
|---------|-------|
| **Bold** | Key terms, critical warnings, section titles |
| *Italic* | Notes, references, emphasis |
| \`Code\` | System commands, file paths, exact inputs |
| > Blockquote | Important notes, cautions, tips |
| Tables | Data, comparisons, matrices |
| Lists | Sequential steps, requirements, options |

## 🎯 VISUAL HIERARCHY

Use strategic visual elements for navigation:

- **⚠️ WARNING:** Safety-critical information
- **🔒 SECURITY:** Access and confidentiality notes  
- **💡 NOTE:** Helpful tips and best practices
- **✅ CHECKPOINT:** Quality verification points
- **📌 REFERENCE:** Links to related documents
- **⏱️ TIME:** Duration estimates
- **🔧 TOOLS:** Required equipment/software

## 📊 QUALITY INDICATORS

Include measurable elements:
- Success criteria for each major step
- Key Performance Indicators (KPIs) where applicable
- Acceptance thresholds and tolerances
- Estimated completion times
- Required approvals and sign-offs

## 🔄 OUTPUT FORMAT

Always produce:
1. Clean, properly nested Markdown
2. Consistent heading hierarchy (##, ###, ####)
3. Proper table formatting with headers
4. Code blocks with language specification
5. Horizontal rules (---) between major sections
6. Professional, enterprise-ready language

Deliver documentation that would pass audit by ISO registrars, regulatory bodies, and enterprise quality teams.`;
  }

  async callAI(messages, options = {}) {
    try {
      const result = await aiManager.createCompletionWithFallback(
        this.provider,
        this.model,
        messages,
        options,
      );

      // Return full result for potential future use (content + metadata)
      // You can change to return result.content if you only need text
      return {
        content: result.content.trim(),
        provider: result.provider,
        model: result.model,
        usage: result.usage,
      };
    } catch (error) {
      console.error("AI call failed:", error.message);
      throw new Error(`SOP Agent failure: ${error.message}`);
    }
  }

  async generateSOP(params) {
    const { topic, department, complexity, additionalContext } = params;

    const userPrompt = `Generate a comprehensive Standard Operating Procedure for the following:

Topic: ${topic}
Department: ${department || "General"}
Complexity Level: ${complexity || "Medium"}
Additional Context: ${additionalContext || "None"}

Create a complete SOP document with the following sections:
1. Document Information (Title, Document ID, Version, Effective Date, Approval)
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

Output in clean, professional Markdown format using appropriate headers, lists, tables, and bold/italic where needed.`;

    const { content } = await this.callAI(
      [
        { role: "system", content: this.systemPrompt },
        { role: "user", content: userPrompt },
      ],
      { temperature: 0.7, max_tokens: 4000 },
    );

    return content;
  }

  async improveSOP(sopText, focus = "general") {
    const focusGuidance = {
      general: "overall quality, clarity, detail, and professionalism",
      clarity: "clarity, readability, and ease of understanding",
      structure: "logical flow, organization, and sequencing",
      compliance: "regulatory compliance, safety standards, and best practices",
      detail: "level of detail, specificity, and completeness",
    };

    const userPrompt = `Improve the following content point by point. Focus on: ${focusGuidance[focus] || focusGuidance.general}.

## Original Content:
${sopText}

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

    const { content } = await this.callAI(
      [
        { role: "system", content: this.systemPrompt },
        { role: "user", content: userPrompt },
      ],
      { temperature: 0.6, max_tokens: 4000 },
    );

    // Parse the response to separate the improved SOP from the feedback
    const fullContent = content;
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

    return {
      improvedSOP,
      improvementFeedback,
      fullContent,
    };
  }

  async analyzeSOP(sopText) {
    const userPrompt = `Perform a comprehensive quality analysis of this SOP document:

${sopText}

Cover the following areas in detail:
1. Structure & Organization
2. Clarity & Readability
3. Completeness
4. Compliance (ISO 9001 and industry standards)
5. Actionability
6. Safety & Risk Management
7. Overall Quality Score (1-10) with justification
8. Prioritized Recommendations for improvement

Format as a professional analysis report in Markdown with clear section headers and bullet points where appropriate.`;

    const { content } = await this.callAI(
      [
        { role: "system", content: this.systemPrompt },
        { role: "user", content: userPrompt },
      ],
      { temperature: 0.5, max_tokens: 3000 },
    );

    return content;
  }

  async generateSummary(sopText) {
    const userPrompt = `Create a concise executive summary for this SOP:

${sopText}

Include:
1. Quick Overview (2-3 sentences)
2. Key Objectives
3. Critical Steps (bullet points)
4. Key Stakeholders & Responsibilities
5. Important Notes (safety, compliance, risks)

Format in clean Markdown suitable for management review.`;

    const { content } = await this.callAI(
      [
        { role: "system", content: this.systemPrompt },
        { role: "user", content: userPrompt },
      ],
      { temperature: 0.5, max_tokens: 1500 },
    );

    return content;
  }

  async enhanceSentence(sentence, context = "") {
    const userPrompt = `Rewrite the following sentence to be more professional, clear, concise, and suitable for an SOP document:

Original: "${sentence}"
${context ? `Context: ${context}` : ""}

Return only the single improved sentence. No explanations or additional text.`;

    const { content } = await this.callAI(
      [
        { role: "system", content: this.systemPrompt },
        { role: "user", content: userPrompt },
      ],
      { temperature: 0.6, max_tokens: 200 },
    );

    return content;
  }

  async generateTemplate(type = "general") {
    const templateTypes = {
      general: "a general-purpose business process",
      safety: "a safety-critical procedure",
      quality: "a quality assurance / control process",
      training: "employee training and onboarding",
      maintenance: "equipment maintenance and calibration",
    };

    const userPrompt = `Generate a fillable SOP template for ${templateTypes[type] || templateTypes.general}.

Include:
- All standard sections with descriptive placeholders in [brackets]
- Helpful guidance notes in italics or [brackets]
- Version control and approval section
- Professional structure compliant with ISO 9001

Output in clean Markdown format with clear headers, placeholders, and formatting examples.`;

    const { content } = await this.callAI(
      [
        { role: "system", content: this.systemPrompt },
        { role: "user", content: userPrompt },
      ],
      { temperature: 0.7, max_tokens: 2500 },
    );

    return content;
  }
}
