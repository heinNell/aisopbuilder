import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class SOPAgent {
  constructor() {
    this.systemPrompt = `You are an expert Standard Operating Procedure (SOP) writer with decades of experience in documentation, process engineering, and technical writing. Your role is to create highly professional, structurally enhanced, and comprehensive SOPs that meet industry standards.

Key Responsibilities:
1. Generate formal, clear, and actionable SOPs
2. Use professional business language with proper structure
3. Include all essential sections: Purpose, Scope, Responsibilities, Procedures, References
4. Create detailed, step-by-step instructions with numbering
5. Ensure compliance with ISO 9001 and industry best practices
6. Format content for maximum clarity and usability

Writing Style:
- Use active voice and imperative mood
- Be specific, measurable, and actionable
- Include safety warnings and notes where appropriate
- Maintain consistent formatting and terminology
- Use professional terminology without jargon
- Structure information hierarchically`;
  }

  async generateSOP(params) {
    const { topic, department, complexity, additionalContext } = params;

    const userPrompt = `Generate a comprehensive Standard Operating Procedure for the following:

Topic: ${topic}
Department: ${department || 'General'}
Complexity Level: ${complexity || 'Medium'}
Additional Context: ${additionalContext || 'None'}

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

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: this.systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    return response.choices[0].message.content;
  }

  async improveSOP(existingText, improvementFocus) {
    const userPrompt = `Analyze and improve the following SOP document. Focus on: ${improvementFocus || 'overall quality, clarity, and completeness'}.

Existing SOP:
${existingText}

Please provide:
1. An improved version of the SOP with enhanced structure and clarity
2. A summary of key improvements made
3. Recommendations for further enhancement

Ensure the improved version maintains all original information while enhancing professionalism and usability.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: this.systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    return response.choices[0].message.content;
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

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: this.systemPrompt },
        { role: 'user', content: analysisPrompt }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    return response.choices[0].message.content;
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

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: this.systemPrompt },
        { role: 'user', content: summaryPrompt }
      ],
      temperature: 0.5,
      max_tokens: 1000,
    });

    return response.choices[0].message.content;
  }

  async enhanceSentence(sentence, context) {
    const enhancePrompt = `Rewrite the following sentence to be more professional, clear, and formal for an SOP document:

Original: "${sentence}"
Context: ${context || 'General SOP document'}

Provide 3 enhanced versions with different tones:
1. Formal and detailed
2. Concise and direct
3. Technical and precise`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: this.systemPrompt },
        { role: 'user', content: enhancePrompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0].message.content;
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

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: this.systemPrompt },
        { role: 'user', content: templatePrompt }
      ],
      temperature: 0.6,
      max_tokens: 3000,
    });

    return response.choices[0].message.content;
  }
}

export default new SOPAgent();
