import express from 'express';
import { aiManager } from '../services/aiProviders.js';

const router = express.Router();

/**
 * GET /api/ai/providers
 * List all available AI providers and their models
 */
router.get('/providers', (req, res) => {
  try {
    const providers = aiManager.getAvailableProviders();
    res.json({
      providers,
      activeCount: Object.keys(providers).length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/ai/complete
 * Universal completion endpoint for any provider
 * 
 * Body: {
 *   provider: 'openai' | 'groq' | 'openrouter' | 'together',
 *   model: 'gpt-4' | 'llama-3.1-70b-versatile' | etc,
 *   messages: [{ role: 'user', content: '...' }],
 *   options: { temperature, maxTokens, etc }
 * }
 */
router.post('/complete', async (req, res) => {
  try {
    const { provider = 'openai', model, messages, options = {} } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }
    
    const result = await aiManager.createCompletion(provider, model, messages, options);
    
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/ai/complete-with-fallback
 * Try multiple providers automatically until one succeeds
 */
router.post('/complete-with-fallback', async (req, res) => {
  try {
    const { provider = 'groq', model, messages, options = {} } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }
    
    const result = await aiManager.createCompletionWithFallback(provider, model, messages, options);
    
    res.json({
      success: true,
      data: result,
      message: `Used ${result.provider} provider`,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message,
    });
  }
});

export default router;
