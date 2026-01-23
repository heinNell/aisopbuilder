# 🎯 Quick Start Guide

Get up and running with AI SOP Builder in 5 minutes!

## Prerequisites Checklist

Before starting, make sure you have:

- [ ] Node.js 18+ installed
- [ ] OpenAI API account
- [ ] OpenAI API key ready
- [ ] Terminal/Command prompt access
- [ ] Text editor (VS Code recommended)

## 5-Minute Setup

### Step 1: Get the Code (1 minute)

```bash
git clone https://github.com/heinNell/aisopbuilder.git
cd aisopbuilder
```

### Step 2: Install Dependencies (2 minutes)

```bash
npm install
```

This installs all required packages. Go grab a coffee! ☕

### Step 3: Configure API Key (1 minute)

1. Copy the environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and add your OpenAI API key:
```
OPENAI_API_KEY=sk-your-actual-key-here
```

**Don't have an API key?**
- Go to https://platform.openai.com/api-keys
- Sign in or create account
- Click "Create new secret key"
- Copy and paste into `.env`

### Step 4: Start the Application (1 minute)

Open **two terminal windows**:

**Terminal 1 - Backend:**
```bash
npm run server
```

Wait for: `🚀 AI SOP Builder API running on port 3001`

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Wait for: `Local: http://localhost:3000/`

### Step 5: Use the Application!

Open your browser to: **http://localhost:3000**

## First Steps in the Application

### 1. Try Generating an SOP

1. Click **"Generate SOP"** tab
2. Enter topic: `"Equipment Safety Inspection"`
3. Select department: `"Safety"`
4. Click **"Generate SOP"**
5. Wait 10-20 seconds
6. See your professional SOP! ✨

### 2. Upload an Existing Document

1. Click **"Upload & Process"** tab
2. Drag and drop a PDF/DOC file
3. Click **"Upload & Analyze"**
4. View extracted text and analysis
5. Switch to **"Improve SOP"** to enhance it

### 3. Analyze a Document

1. Click **"Analyze SOP"** tab
2. Paste any SOP text
3. Click **"Analyze SOP"**
4. See quality scores and recommendations

## Common Issues & Quick Fixes

### ❌ "Cannot find module"
**Fix:** Run `npm install` again

### ❌ "OpenAI API key not found"
**Fix:** Check your `.env` file has `OPENAI_API_KEY=sk-...`

### ❌ "Port already in use"
**Fix:** 
```bash
# Kill the process on port 3000
lsof -ti:3000 | xargs kill -9
```

### ❌ "CORS error" in browser
**Fix:** Make sure both backend and frontend are running

## Alternative: Use Quick Start Script

**On Linux/Mac:**
```bash
chmod +x quick-start.sh
./quick-start.sh
```

This script will:
- Create `.env` file if missing
- Install dependencies
- Show you what to do next

## Next Steps

✅ **You're all set!** Now:

1. 📖 Read the [User Guide](docs/USER_GUIDE.md) for detailed features
2. 📋 Check [examples/](examples/) for sample SOPs
3. 🔧 Review [API docs](docs/API.md) if building integrations
4. 🎨 Customize the UI styles in [src/index.css](src/index.css)

## Pro Tips

💡 **Best Results:**
- Be specific in your SOP topics
- Add context in the "Additional Context" field
- Review and customize AI-generated content

💡 **Save Your Work:**
- Use the Download button to save SOPs
- Keep copies of important documents
- Export to your preferred format

💡 **File Uploads:**
- Works best with text-based PDFs
- Word docs (.docx) fully supported
- Max file size: 10MB

## Getting Help

- 📚 [Full Documentation](docs/)
- 💬 Open an issue on GitHub
- 🔍 Check the troubleshooting section in docs

## What's Next?

Try these features:

- **Generate** your first company SOP
- **Upload** an existing document to improve
- **Analyze** your current SOPs for quality
- **Export** multiple formats
- **Customize** for your industry

---

**Congratulations! You're ready to create professional SOPs with AI!** 🎉

*Time to setup: ~5 minutes*  
*Time to first SOP: ~30 seconds*  
*Time saved vs manual writing: Hours!* ⏱️
