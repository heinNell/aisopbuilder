# Deploying to Vercel

This guide explains how to deploy the AI SOP Builder to Vercel without running a separate backend server.

## How It Works

The app has been configured to work in two modes:

1. **Local Development** - Uses Express backend server (`npm run server`)
2. **Vercel Deployment** - Uses serverless functions (no server needed)

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (from project root)
vercel
```

### Option 2: Deploy via GitHub

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel auto-detects Vite and configures the build

## Environment Variables

Add these environment variables in Vercel Dashboard → Settings → Environment Variables:

| Variable             | Required           | Description                        |
| -------------------- | ------------------ | ---------------------------------- |
| `GROQ_API_KEY`       | Yes (at least one) | Groq API key (free tier available) |
| `OPENAI_API_KEY`     | No                 | OpenAI API key                     |
| `OPENROUTER_API_KEY` | No                 | OpenRouter API key                 |
| `TOGETHER_API_KEY`   | No                 | Together AI API key                |

⚠️ **Important**: Do NOT set `VITE_API_URL` in Vercel - the app automatically uses `/api/*` routes.

### Setting Environment Variables

**Via Vercel Dashboard:**

1. Go to your project → Settings → Environment Variables
2. Add each API key
3. Redeploy for changes to take effect

**Via Vercel CLI:**

```bash
vercel env add GROQ_API_KEY
# Enter your key when prompted
```

## Project Structure for Vercel

```
aisopbuilder/
├── api/                    # Serverless functions
│   ├── _lib/
│   │   └── ai.js          # Shared AI provider manager
│   ├── ai/
│   │   ├── health.js      # GET /api/ai/health
│   │   └── providers.js   # GET /api/ai/providers
│   └── sop/
│       ├── generate.js    # POST /api/sop/generate
│       ├── improve.js     # POST /api/sop/improve
│       ├── analyze.js     # POST /api/sop/analyze
│       └── summarize.js   # POST /api/sop/summarize
├── src/                   # React frontend
├── dist/                  # Built frontend (auto-generated)
├── vercel.json           # Vercel configuration
└── package.json
```

## API Routes

All API routes are available at:

| Endpoint             | Method | Description                  |
| -------------------- | ------ | ---------------------------- |
| `/api/ai/providers`  | GET    | List configured AI providers |
| `/api/ai/health`     | GET    | Test provider availability   |
| `/api/sop/generate`  | POST   | Generate new SOP             |
| `/api/sop/improve`   | POST   | Improve existing SOP         |
| `/api/sop/analyze`   | POST   | Analyze SOP quality          |
| `/api/sop/summarize` | POST   | Create executive summary     |

## Testing Your Deployment

After deploying, test the health endpoint:

```bash
curl https://your-app.vercel.app/api/ai/health
```

Expected response:

```json
{
  "status": "healthy",
  "providers": {
    "groq": { "available": true, "configured": true }
  },
  "summary": { "healthy": 1, "configured": 1 }
}
```

## Local Development

For local development, you have two options:

### Option A: Use Express Backend (recommended for full features)

```bash
# Terminal 1: Start backend
npm run server

# Terminal 2: Start frontend
npm run dev
```

Make sure `.env` has:

```
VITE_API_URL=http://localhost:3001
```

### Option B: Use Vercel Dev (simulates production)

```bash
vercel dev
```

This runs the serverless functions locally.

## Troubleshooting

### "Provider not configured" error

- Check that environment variables are set in Vercel dashboard
- Redeploy after adding new environment variables

### Rate limit errors

- The app automatically retries with backoff
- Add multiple providers for fallback redundancy
- Check `/api/ai/health` to see which providers are available

### Build failures

- Ensure `package.json` has correct build command
- Check Vercel build logs for specific errors

### CORS errors

- The API routes include CORS headers automatically
- If issues persist, check `vercel.json` configuration

## Cost Considerations

- **Vercel Free Tier**: 100GB bandwidth, 100 hours serverless execution
- **AI Providers**:
  - Groq: Free tier with rate limits
  - OpenRouter: Pay-per-token, some free models
  - OpenAI: Pay-per-token
  - Together: Pay-per-token with some free credits

## Limitations vs Express Backend

| Feature             | Express Backend | Vercel Serverless   |
| ------------------- | --------------- | ------------------- |
| File uploads        | ✅ Full support | ⚠️ Limited to 4.5MB |
| Rate limit tracking | ✅ Persistent   | ⚠️ Per-request only |
| Connection pooling  | ✅ Yes          | ❌ Cold starts      |
| Execution time      | Unlimited       | 60s max             |

For most SOP generation use cases, these limitations don't matter.
