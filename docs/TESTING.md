# AI Provider Testing & Rate Limit Handling

This guide covers how to test AI providers, handle rate limits, and ensure reliable operation of the AI SOP Builder.

## Quick Start

```bash
# Test all configured providers
npm run test:providers

# Detailed output with verbose flag
npm run test:providers:verbose

# Test a specific provider
npm run test:provider=groq
npm run test:provider=openai
```

## API Endpoints for Monitoring

### Health Check - All Providers

```bash
GET /api/ai/health
```

Response:

```json
{
  "status": "healthy",
  "timestamp": "2024-01-26T10:00:00.000Z",
  "providers": {
    "groq": {
      "available": true,
      "configured": true,
      "responseTime": 523,
      "rateLimited": false
    },
    "openai": {
      "available": true,
      "configured": true,
      "responseTime": 890,
      "rateLimited": false
    }
  },
  "summary": {
    "healthy": 2,
    "configured": 3,
    "rateLimited": 0
  }
}
```

### Health Check - Single Provider

```bash
GET /api/ai/health/groq
GET /api/ai/health/openai?model=gpt-4-turbo
```

### Rate Limit Status

```bash
GET /api/ai/rate-limits
```

Response:

```json
{
  "timestamp": "2024-01-26T10:00:00.000Z",
  "providers": {
    "groq": {
      "configured": true,
      "rateLimited": true,
      "retryIn": 45,
      "lastError": "Rate limit exceeded"
    },
    "openai": {
      "configured": true,
      "rateLimited": false
    }
  },
  "anyRateLimited": true
}
```

## Rate Limit Configuration

Each provider has specific rate limit handling configured in `backend/services/aiProviders.js`:

| Provider   | Max Retries | Base Delay | Max Delay |
| ---------- | ----------- | ---------- | --------- |
| OpenAI     | 3           | 1000ms     | 60000ms   |
| OpenRouter | 3           | 1000ms     | 30000ms   |
| Groq       | 5           | 2000ms     | 60000ms   |
| Together   | 3           | 1000ms     | 30000ms   |

### How Rate Limiting Works

1. **Automatic Retry** - When a rate limit is hit, the system automatically retries with exponential backoff
2. **Provider Fallback** - If one provider is rate-limited, the system automatically tries the next available provider
3. **State Tracking** - Rate limit state is tracked per-provider to avoid unnecessary retries
4. **Retry-After Header** - If the API returns a `retry-after` header, it's respected

### Exponential Backoff Formula

```
delay = min(baseDelay × 2^attempt + random(0-1000ms), maxDelay)
```

## Provider Configuration

### Required Environment Variables

```env
# At least one of these is required:
OPENAI_API_KEY=sk-...
GROQ_API_KEY=gsk_...
OPENROUTER_API_KEY=sk-or-v1-...
TOGETHER_API_KEY=...
```

### Provider-Specific Notes

#### OpenAI

- Requires billing account for most models
- Project must have model access enabled
- Rate limits vary by account tier

#### Groq (Recommended for Testing)

- Generous free tier available
- Fast inference times
- Good Llama model support

#### OpenRouter

- Access to 100+ models
- Pay-per-token pricing
- Good for Claude/Gemini access

#### Together AI

- Good for Llama models
- Competitive pricing
- Fast inference

## Troubleshooting

### Test Suite Shows All Failures

**Symptoms:**

```
✗ gpt-4o - openai API error: 403 Project does not have access to model
✗ llama-3.3-70b - groq API error: 401 Invalid API Key
```

**Solutions:**

1. Verify API keys are correctly set in `.env`
2. Check that billing is enabled on your accounts
3. Verify model access for your API tier
4. Try the free-tier models first

### Rate Limit Errors

**Symptoms:**

```
Rate limited, waiting 2000ms...
```

**Solutions:**

1. The system handles this automatically via retries
2. Use the fallback endpoint (`/api/ai/complete-with-fallback`)
3. Add additional providers for redundancy
4. Consider upgrading to higher API tiers

### Common Error Types

| Error                 | Cause              | Solution                       |
| --------------------- | ------------------ | ------------------------------ |
| `401 Unauthorized`    | Invalid API key    | Check `.env` file              |
| `403 Forbidden`       | No model access    | Check account tier/permissions |
| `429 Rate Limited`    | Too many requests  | Wait or use fallback           |
| `404 Model Not Found` | Invalid model name | Check model availability       |

## Best Practices

1. **Always configure multiple providers** - Ensures reliability through fallback
2. **Use health checks in production** - Monitor provider availability
3. **Prefer Groq for development** - Free tier with good rate limits
4. **Test before deploying** - Run `npm run test:providers` to verify
5. **Monitor rate limit status** - Use `/api/ai/rate-limits` endpoint

## Integration Example

```javascript
// Using the health check before making requests
async function checkProvidersAndGenerate(topic) {
  // Check provider health first
  const health = await fetch("/api/ai/health").then((r) => r.json());

  if (health.status === "degraded") {
    console.warn("Some providers unavailable:", health.summary);
  }

  // Use fallback endpoint for reliability
  const response = await fetch("/api/ai/complete-with-fallback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      provider: "groq", // Preferred provider
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: `Generate SOP for: ${topic}` }],
    }),
  });

  const result = await response.json();
  console.log(`Used provider: ${result.data.provider}`); // May differ if fallback used
  return result;
}
```
