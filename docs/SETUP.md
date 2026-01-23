# Setup and Installation Guide

This guide will help you set up the AI SOP Builder on your local machine or server.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** version 18.0.0 or higher
- **npm** (comes with Node.js)
- **Git** (for cloning the repository)
- **OpenAI API Key** (required for AI functionality)

## Step-by-Step Installation

### 1. Clone the Repository

```bash
git clone https://github.com/heinNell/aisopbuilder.git
cd aisopbuilder
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages for both frontend and backend:
- React and related libraries
- Express and server dependencies
- OpenAI SDK
- File processing libraries
- UI component libraries

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your actual values:

```env
# Required: Your OpenAI API Key
OPENAI_API_KEY=sk-your-actual-openai-api-key-here

# Server Configuration
PORT=3001

# Frontend API URL
VITE_API_URL=http://localhost:3001
```

#### Getting an OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Click "Create new secret key"
5. Copy the key and paste it in your `.env` file
6. Note: You'll need billing set up to use the API

### 4. Start the Application

You have two options for running the application:

#### Option A: Using Two Terminals (Recommended for Development)

**Terminal 1 - Backend Server:**
```bash
npm run server
```

You should see:
```
🚀 AI SOP Builder API running on port 3001
📝 Ready to generate professional SOPs
```

**Terminal 2 - Frontend Development Server:**
```bash
npm run dev
```

You should see:
```
VITE v5.1.0  ready in XXX ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

#### Option B: Manual Start

**Terminal 1:**
```bash
node backend/server.js
```

**Terminal 2:**
```bash
npm run dev
```

### 5. Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## Verification Steps

### Test Backend API

Open a new terminal and run:

```bash
curl http://localhost:3001/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-23T..."
}
```

### Test Frontend

1. Open http://localhost:3000 in your browser
2. You should see the AI SOP Builder home page
3. Try clicking through the navigation tabs
4. All UI elements should load without errors

### Test API Integration

1. Go to "Generate SOP" tab
2. Enter a test topic: "Test Procedure"
3. Click "Generate SOP"
4. You should see an AI-generated SOP appear

If this works, your setup is complete! ✅

## Troubleshooting

### Common Issues and Solutions

#### Issue: "Cannot find module 'openai'"
**Solution:**
```bash
npm install
```

#### Issue: "OpenAI API key not found"
**Solution:**
- Verify your `.env` file exists in the root directory
- Ensure the key is formatted correctly: `OPENAI_API_KEY=sk-...`
- Restart the backend server after adding the key

#### Issue: "Port 3000 is already in use"
**Solution:**
- Kill the process using the port:
  ```bash
  # On Linux/Mac
  lsof -ti:3000 | xargs kill -9
  
  # On Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  ```
- Or change the port in `vite.config.js`

#### Issue: "Port 3001 is already in use"
**Solution:**
- Change the PORT in `.env` file
- Update VITE_API_URL accordingly
- Restart both servers

#### Issue: CORS errors in browser console
**Solution:**
- Ensure both frontend and backend are running
- Verify VITE_API_URL in `.env` matches your backend port
- Check that `cors()` is properly configured in `backend/server.js`

#### Issue: File upload not working
**Solution:**
- Check that `uploads/` directory exists
- Verify file size is under 10MB
- Ensure file type is supported (PDF, DOC, DOCX, TXT, MD)

## Directory Structure After Setup

```
aisopbuilder/
├── backend/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── server.js
├── examples/
│   └── example-sop-onboarding.md
├── node_modules/          # Created after npm install
├── src/
│   ├── components/
│   ├── services/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── uploads/               # Created automatically on first run
├── logs/                  # Created automatically on first run
├── .env                   # You create this
├── .env.example
├── .gitignore
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Production Deployment

For production deployment:

1. **Build the frontend:**
   ```bash
   npm run build
   ```

2. **Set production environment variables:**
   ```env
   NODE_ENV=production
   OPENAI_API_KEY=your-production-key
   PORT=3001
   ```

3. **Serve the built files:**
   - Use a process manager like PM2
   - Set up reverse proxy with Nginx
   - Configure SSL certificates

4. **Security considerations:**
   - Never expose `.env` file
   - Use environment variables in production
   - Implement rate limiting
   - Add authentication if needed
   - Keep API keys secure

## Next Steps

Once installation is complete:

1. Read the [README.md](../README.md) for usage guide
2. Explore the example SOPs in `examples/`
3. Try generating your first SOP
4. Upload an existing document to improve it
5. Experiment with different features

## Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Review the console output for error messages
3. Verify all prerequisites are met
4. Check that all environment variables are set correctly
5. Open an issue on GitHub with error details

## Development Tips

- Use `console.log()` in backend for debugging
- Check browser DevTools console for frontend errors
- Monitor network requests in DevTools Network tab
- Backend logs appear in Terminal 1
- Frontend errors appear in Terminal 2 and browser console

---

**Congratulations! You're ready to start building professional SOPs with AI!** 🚀
