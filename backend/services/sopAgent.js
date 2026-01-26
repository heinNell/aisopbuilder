import dotenv from "dotenv";
import { aiManager } from "./aiProviders.js";

dotenv.config();

export class SOPAgent {
  constructor() {
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

    // Prefer Groq for extremely low latency (great UX) – uses strong models like llama-3.3-70b-versatile by default
    // Change to 'openai' if you prefer GPT quality first (e.g., gpt-4o-mini)
    this.preferredProvider = "groq";
  }

  /**
   * Internal helper to generate completions using the multi-provider manager with fallback
   */
  async _generateCompletion(
    prompt,
    { temperature = 0.7, max_tokens = 4000 } = {},
  ) {
    const messages = [
      { role: "system", content: this.systemPrompt },
      { role: "user", content: prompt },
    ];

    try {
      const result = await aiManager.createCompletionWithFallback(
        this.preferredProvider,
        null, // Use the provider's primary/default model (robust across providers)
        messages,
        { temperature, max_tokens },
      );

      return result.content.trim();
    } catch (error) {
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

Make it professional, detailed, and ready for implementation.`;

    return await this._generateCompletion(userPrompt, {
      temperature: 0.7,
      max_tokens: 4000,
    });
  }

  async improveSOP(existingText, improvementFocus) {
    const focusGuidance = {
      general: "overall quality, structure, clarity, and professionalism",
      clarity: "clarity, readability, and ease of understanding",
      structure: "document structure, organization, and formatting",
      compliance: "regulatory compliance, safety standards, and best practices",
      detail: "level of detail, specificity, and completeness",
    };

    const userPrompt = `Improve the following SOP document. Focus on: ${focusGuidance[improvementFocus] || focusGuidance.general}.

## 📄 Original SOP:
${existingText}

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

    return await this._generateCompletion(userPrompt, {
      temperature: 0.7,
      max_tokens: 4000,
    });
  }

  async analyzeSOP(sopText) {
    const analysisPrompt = `Analyze the following SOP document and provide a comprehensive assessment:

SOP Document:
${sopText}

Please provide:
1. **Completeness Score** (0-100): How complete is this SOP?
2. **Clarity Score** (0-100): How clear and understandable is it?
3. **Structure Score** (0-100): How well-structured is it?
4. **Compliance Score** (0-100): How well does it meet industry standards?

5. **Strengths**: List 3-5 strong points
6. **Weaknesses**: List 3-5 areas needing improvement
7. **Missing Sections**: What essential sections are missing?
8. **Recommendations**: Specific suggestions for improvement

Format your response as structured data that can be parsed.`;

    return await this._generateCompletion(analysisPrompt, {
      temperature: 0.3,
      max_tokens: 2000,
    });
  }

  async generateSummary(sopText) {
    const summaryPrompt = `Create a concise, point-by-point executive summary of the following SOP:

${sopText}

Provide:
1. **Overview**: 2-3 sentence description
2. **Key Steps**: Bullet points of main procedural steps
3. **Critical Points**: Important warnings or considerations
4. **Expected Outcome**: What this SOP achieves

Keep it professional and suitable for management review.`;

    return await this._generateCompletion(summaryPrompt, {
      temperature: 0.5,
      max_tokens: 1000,
    });
  }

  async enhanceSentence(sentence, context) {
    const enhancePrompt = `Rewrite the following sentence to be more professional, clear, and formal for an SOP document:

Original: "${sentence}"
Context: ${context || "General SOP document"}

Provide 3 enhanced versions with different tones:
1. Formal and detailed
2. Concise and direct
3. Technical and precise`;

    return await this._generateCompletion(enhancePrompt, {
      temperature: 0.7,
      max_tokens: 500,
    });
  }

  async generateTemplate(industry, processType) {
    const templatePrompt = `Generate a professional SOP template for:
Industry: ${industry}
Process Type: ${processType}

Create a blank template with:
- All standard sections with instructions
- Proper formatting and structure
- Placeholder text explaining what should go in each section
- Industry-specific considerations

Make it ready to fill in.`;

    return await this._generateCompletion(templatePrompt, {
      temperature: 0.6,
      max_tokens: 3000,
    });
  }
}

export default new SOPAgent();
