import { aiManager } from './aiProviders.js';

/**
 * Enhanced SOP Agent with Multi-Provider Support
 * Can use any configured AI provider (OpenAI, Groq, OpenRouter, Together)
 */
export class SOPAgent {
  constructor(provider = 'groq', model = null) {
    this.provider = provider;
    this.model = model || this.getDefaultModel(provider);
    
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

  getDefaultModel(provider) {
    const defaults = {
      openai: 'gpt-3.5-turbo',
      groq: 'llama-3.3-70b-versatile',
      openrouter: 'meta-llama/llama-3.1-70b-instruct',
      together: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
    };
    return defaults[provider] || 'gpt-3.5-turbo';
  }

  async callAI(messages, options = {}) {
    try {
      // Try with fallback to ensure we get a response
      const result = await aiManager.createCompletionWithFallback(
        this.provider,
        this.model,
        messages,
        options
      );
      return result.content;
    } catch (error) {
      console.error('AI call failed:', error);
      throw error;
    }
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

Format the output in clear, professional Markdown format.`;

    const response = await this.callAI([
      { role: 'system', content: this.systemPrompt },
      { role: 'user', content: userPrompt }
    ], { temperature: 0.7, maxTokens: 4000 });

    return response;
  }

  async improveSOP(sopText, focus = 'general') {
    const focusGuidance = {
      'general': 'overall quality, structure, clarity, and professionalism',
      'clarity': 'clarity, readability, and ease of understanding',
      'structure': 'document structure, organization, and formatting',
      'compliance': 'regulatory compliance, safety standards, and best practices',
      'detail': 'level of detail, specificity, and completeness'
    };

    const userPrompt = `Improve this SOP with focus on ${focusGuidance[focus] || focusGuidance.general}:

${sopText}

Provide:
1. Improved version of the complete SOP
2. Maintain all important information
3. Enhance structure and formatting
4. Add missing essential sections
5. Improve clarity and professionalism
6. Ensure ISO 9001 compliance

Return only the improved SOP document in Markdown format.`;

    const response = await this.callAI([
      { role: 'system', content: this.systemPrompt },
      { role: 'user', content: userPrompt }
    ], { temperature: 0.6, maxTokens: 4000 });

    return response;
  }

  async analyzeSOP(sopText) {
    const userPrompt = `Analyze this SOP document and provide a comprehensive quality assessment:

${sopText}

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

    const response = await this.callAI([
      { role: 'system', content: this.systemPrompt },
      { role: 'user', content: userPrompt }
    ], { temperature: 0.5, maxTokens: 3000 });

    return response;
  }

  async generateSummary(sopText) {
    const userPrompt = `Create an executive summary for this SOP:

${sopText}

Provide:
1. **Quick Overview** - 2-3 sentence summary
2. **Key Objectives** - Main goals and purposes
3. **Critical Steps** - Most important procedures (bullet points)
4. **Key Stakeholders** - Primary roles and responsibilities
5. **Important Notes** - Critical safety or compliance points

Keep it concise and executive-friendly. Format in Markdown.`;

    const response = await this.callAI([
      { role: 'system', content: this.systemPrompt },
      { role: 'user', content: userPrompt }
    ], { temperature: 0.5, maxTokens: 1500 });

    return response;
  }

  async enhanceSentence(sentence, context = '') {
    const userPrompt = `Enhance this sentence for an SOP document to be more professional and clear:

Original: "${sentence}"
${context ? `Context: ${context}` : ''}

Return only the improved sentence, nothing else.`;

    const response = await this.callAI([
      { role: 'system', content: 'You are a professional technical writer specializing in SOPs.' },
      { role: 'user', content: userPrompt }
    ], { temperature: 0.6, maxTokens: 200 });

    return response;
  }

  async generateTemplate(type = 'general') {
    const templateTypes = {
      'general': 'a general-purpose SOP template',
      'safety': 'a safety procedure SOP template',
      'quality': 'a quality control SOP template',
      'training': 'a training procedure SOP template',
      'maintenance': 'an equipment maintenance SOP template'
    };

    const userPrompt = `Generate ${templateTypes[type] || templateTypes.general} that can be filled in with specific details.

Include:
1. All standard sections with placeholder text
2. Helpful instructions in [brackets] for what to include
3. Professional formatting and structure
4. ISO 9001 compliant layout
5. Version control section

Format in Markdown with clear section headers.`;

    const response = await this.callAI([
      { role: 'system', content: this.systemPrompt },
      { role: 'user', content: userPrompt }
    ], { temperature: 0.7, maxTokens: 2500 });

    return response;
  }
}
