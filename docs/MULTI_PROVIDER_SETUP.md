# Multi-Provider AI Setup Guide

## Overview

The AI SOP Builder backend server acts as a **secure API gateway** between your frontend and various AI providers. This architecture provides:

✅ **API Key Security** - Keys never exposed in browser  
✅ **Provider Flexibility** - Switch between OpenAI, Groq, OpenRouter, etc.  
✅ **Automatic Fallback** - If one provider fails, try another  
✅ **Cost Management** - Use free tier providers for testing  
✅ **File Processing** - Handle document uploads server-side

---

## Why You Need a Backend Server

### ❌ **Without Backend:**
```javascript
// BAD: API key exposed in browser!
const openai = new OpenAI({ 
  apiKey: 'sk-proj-YOUR-KEY',  // Visible to anyone! 
  dangerouslyAllowBrowser: true 
});
```

### ✅ **With Backend:**
```javascript
// GOOD: API key stays on server
// Frontend just calls: fetch('/api/sop/generate', { ... })
// Backend handles AI provider securely
```

---

## Supported AI Providers

| Provider | Cost | Speed | Models | Best For |
|----------|------|-------|--------|----------|
| **Groq** | 🆓 Free tier | ⚡ Fastest | Llama 3.3, Mixtral | **Recommended** - Fast & free |
| **OpenRouter** | 💰 Pay-per-use | ⚡ Fast | 100+ models | Model variety |
| **OpenAI** | 💰 Paid | 🐢 Medium | GPT-4, GPT-3.5 | Highest quality |
| **Together AI** | 💰 Paid | ⚡ Fast | Llama models | Open source focus |

---

## Quick Setup (3 Steps)

### 1. Get Free API Keys

**Groq (Recommended - Free):**
```bash
# Visit: https://console.groq.com/keys
# 1. Sign up with Google/GitHub
# 2. Create API key
# 3. Copy key
```

**OpenRouter (Optional - Many free models):**
```bash
# Visit: https://openrouter.ai/keys
# 1. Sign in
# 2. Create key (free credits available)
# 3. Copy key
```

### 2. Add Keys to `.env`

```env
# Your existing OpenAI key
OPENAI_API_KEY=sk-proj-...

# Add these new providers (optional)
GROQ_API_KEY=gsk_...              # Get from console.groq.com
OPENROUTER_API_KEY=sk-or-...      # Get from openrouter.ai
TOGETHER_API_KEY=...              # Get from together.ai

APP_URL=http://localhost:3000
PORT=3001
```

### 3. Install Dependencies & Restart

```bash
# Install axios if not already installed
npm install axios

# Restart backend server
npm run server
```

---

## Usage Examples

### Option A: Use Default Provider (Automatic Fallback)

The app will automatically try providers in this order:
1. Groq (fastest & free)
2. OpenRouter (if Groq fails)
3. OpenAI (if others fail)

**No code changes needed** - existing SOP routes will work!

### Option B: Choose Specific Provider

```javascript
// In frontend: src/services/api.js
export const generateSOP = async (formData, provider = 'groq', model = 'llama-3.3-70b-versatile') => {
  const response = await fetch(`${API_URL}/api/sop/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      ...formData, 
      provider,  // 'groq', 'openai', 'openrouter'
      model 
    }),
  });
  return response.json();
};
```

### Option C: Test Different Providers

```bash
# Check which providers are available
curl http://localhost:3001/api/ai/providers

# Response:
{
  "providers": {
    "openai": { "models": ["gpt-4", "gpt-3.5-turbo"], ... },
    "groq": { "models": ["llama-3.3-70b-versatile", ...], ... }
  },
  "activeCount": 2
}
```

---

## Recommended Free Setup

For **maximum cost savings**, use Groq:

```env
# .env - Only need Groq key for free usage
GROQ_API_KEY=gsk_...
PORT=3001
```

Then modify [backend/services/sopAgent.js](backend/services/sopAgent.js):

```javascript
import { SOPAgent } from './sopAgentMultiProvider.js';

// Use Groq by default (free & fast)
export const sopAgent = new SOPAgent('groq', 'llama-3.3-70b-versatile');
```

---

## Testing

```bash
# 1. Start backend
npm run server

# 2. Test provider availability
curl http://localhost:3001/api/ai/providers

# 3. Test completion (replace with your actual API key)
curl -X POST http://localhost:3001/api/ai/complete \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "groq",
    "model": "llama-3.3-70b-versatile",
    "messages": [{"role": "user", "content": "Say hello"}]
  }'
```

---

## Migration Path

### Current (OpenAI only):
```
Frontend → Backend → OpenAI
```

### After Update (Multi-provider):
```
Frontend → Backend → Groq (free) ✅
                  ↘ OpenRouter (fallback)
                  ↘ OpenAI (fallback)
```

---

## Cost Comparison

**Monthly estimates for typical usage:**

| Provider | 100 SOPs | 1,000 SOPs | Notes |
|----------|----------|------------|-------|
| Groq | **$0** | **$0** | Free tier sufficient |
| OpenRouter | $2-5 | $20-50 | Pay per token |
| OpenAI | $5-10 | $50-100 | Most expensive |

---

## Troubleshooting

### "Provider not configured" Error
```bash
# Check if API key is set
echo $GROQ_API_KEY

# Add to .env if missing
echo "GROQ_API_KEY=gsk_..." >> .env

# Restart server
npm run server
```

### "All providers failed" Error
- Check internet connection
- Verify API keys are valid
- Check provider status pages
- Try each provider individually

---

## Next Steps

1. ✅ Get free Groq API key → [console.groq.com](https://console.groq.com)
2. ✅ Add `GROQ_API_KEY` to `.env`
3. ✅ Restart backend: `npm run server`
4. ✅ Test endpoint: `curl http://localhost:3001/api/ai/providers`
5. 🎉 Enjoy fast, free AI-powered SOPs!
