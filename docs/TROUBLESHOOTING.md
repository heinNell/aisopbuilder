# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: "Failed to improve SOP" - 403 Error

**Error Message:**
```
Failed to load resource: the server responded with a status of 500 (Internal Server Error)
Details: "403 Project does not have access to model `gpt-4-xxx`"
```

**Cause:** Your OpenAI API key doesn't have access to the GPT-4 models.

**Solution:** ✅ **FIXED** - The application now uses `gpt-3.5-turbo` which is available to all OpenAI accounts.

**What was changed:**
- Updated `backend/services/sopAgent.js` to use `gpt-3.5-turbo` instead of `gpt-4-turbo-preview`
- This model is included in all OpenAI API plans
- Still provides excellent quality SOP generation

---

### Issue 2: Backend Server Errors

**Symptoms:**
- 500 Internal Server Error
- API endpoints not responding
- "Connection refused" errors

**Solutions:**

1. **Check if backend is running:**
   ```bash
   curl http://localhost:3001/api/health
   ```
   Should return: `{"status":"healthy","timestamp":"..."}`

2. **Restart the backend:**
   ```bash
   # Kill existing process
   pkill -f "node backend/server.js"
   
   # Start fresh
   cd /workspaces/aisopbuilder
   node backend/server.js
   ```

3. **Check for port conflicts:**
   ```bash
   lsof -ti:3001
   # If a process is using port 3001, kill it:
   lsof -ti:3001 | xargs kill -9
   ```

---

### Issue 3: OpenAI API Key Issues

**Symptoms:**
- "OpenAI API key not found"
- "Invalid API key"
- 401 Unauthorized errors

**Solutions:**

1. **Verify .env file exists:**
   ```bash
   ls -la .env
   ```

2. **Check API key format:**
   ```bash
   cat .env | grep OPENAI_API_KEY
   ```
   Should show: `OPENAI_API_KEY=sk-...`

3. **Ensure key is valid:**
   - Go to https://platform.openai.com/api-keys
   - Verify your API key is active
   - Check your OpenAI account has credits

4. **Fix .env file:**
   ```bash
   # Edit .env
   nano .env
   
   # Ensure it looks like this:
   OPENAI_API_KEY=sk-your-actual-key-here
   PORT=3001
   VITE_API_URL=http://localhost:3001
   ```

5. **Restart backend after changing .env:**
   ```bash
   pkill -f "node backend/server.js"
   node backend/server.js
   ```

---

### Issue 4: Frontend Not Loading

**Symptoms:**
- Blank page
- "Cannot GET /" error
- Assets not loading

**Solutions:**

1. **Check if frontend is running:**
   ```bash
   curl http://localhost:3000
   ```

2. **Restart frontend:**
   ```bash
   # Stop (Ctrl+C in the terminal)
   # Then restart
   npm run dev
   ```

3. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
   - Or clear browser cache completely

4. **Check console for errors:**
   - Open DevTools (F12)
   - Look at Console tab
   - Check Network tab for failed requests

---

### Issue 5: CORS Errors

**Error in Browser Console:**
```
Access to fetch at 'http://localhost:3001/api/...' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

**Solution:**

1. **Ensure both servers are running:**
   - Backend on port 3001
   - Frontend on port 3000

2. **Check CORS configuration:**
   The backend already has CORS enabled in `backend/server.js`:
   ```javascript
   app.use(cors());
   ```

3. **Verify API URL:**
   Check `.env` file:
   ```
   VITE_API_URL=http://localhost:3001
   ```

4. **Restart both servers:**
   ```bash
   # Terminal 1
   pkill -f "node backend/server.js"
   node backend/server.js
   
   # Terminal 2
   # Stop frontend (Ctrl+C)
   npm run dev
   ```

---

### Issue 6: File Upload Not Working

**Symptoms:**
- "Failed to process file"
- Files don't upload
- Extraction errors

**Solutions:**

1. **Check file size:**
   - Maximum: 10MB
   - Compress large PDFs if needed

2. **Verify file format:**
   - Supported: PDF, DOC, DOCX, TXT, MD
   - Not supported: Scanned PDFs without OCR

3. **Check uploads directory:**
   ```bash
   ls -la uploads/
   # If it doesn't exist:
   mkdir uploads
   ```

4. **Test with a simple text file:**
   - Create a test.txt file
   - Try uploading that first

---

### Issue 7: Generated SOPs Are Too Short/Generic

**Symptoms:**
- SOP lacks detail
- Missing important sections
- Too generic

**Solutions:**

1. **Provide more context:**
   - Fill in "Additional Context" field
   - Mention specific requirements
   - Include industry standards

2. **Use appropriate complexity:**
   - Simple: Basic procedures
   - Medium: Standard operations
   - Complex: Detailed processes

3. **Be specific in topic:**
   - ❌ Bad: "Process"
   - ✅ Good: "Customer Complaint Escalation Process"

4. **Add department info:**
   - Helps tailor the SOP
   - Includes relevant terminology

---

### Issue 8: Model Timeout or Slow Response

**Symptoms:**
- Request takes too long
- Timeout errors
- Loading forever

**Solutions:**

1. **Check OpenAI API status:**
   - Visit https://status.openai.com
   - Verify no outages

2. **Reduce text size:**
   - For improvement: Paste shorter sections
   - For analysis: Break into smaller parts

3. **Check internet connection:**
   ```bash
   ping api.openai.com
   ```

4. **Try again:**
   - Sometimes API is just busy
   - Wait 30 seconds and retry

---

### Issue 9: "Cannot find module" Errors

**Error:**
```
Error: Cannot find module 'openai'
Error: Cannot find module 'express'
```

**Solution:**

1. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check Node version:**
   ```bash
   node --version
   # Should be 18.0.0 or higher
   ```

3. **Update npm:**
   ```bash
   npm install -g npm@latest
   ```

---

### Issue 10: Browser Extension Conflicts

**Error in Console:**
```
Uncaught TypeError: undefined is not iterable
content.js errors
```

**Cause:** Browser extensions interfering with the app

**Solutions:**

1. **Test in incognito/private mode:**
   - Opens without extensions
   - If it works, an extension is the issue

2. **Disable extensions temporarily:**
   - Especially ad blockers
   - Privacy extensions
   - Script blockers

3. **Whitelist localhost:**
   - Add localhost:3000 and localhost:3001 to allowed sites
   - In extension settings

---

## Quick Diagnostic Commands

Run these to check system status:

```bash
# Check if backend is running
curl http://localhost:3001/api/health

# Check if frontend is accessible
curl http://localhost:3000

# View backend logs
tail -f backend.log

# Check Node processes
ps aux | grep node

# Verify environment variables
cat .env

# Test OpenAI connection
curl -X POST http://localhost:3001/api/sop/generate \
  -H "Content-Type: application/json" \
  -d '{"topic":"Test","department":"Test","complexity":"Simple"}'
```

---

## Getting Help

If you're still having issues:

1. **Check the logs:**
   - Backend: Look at terminal output
   - Frontend: Check browser console (F12)

2. **Review documentation:**
   - [Setup Guide](SETUP.md)
   - [User Guide](USER_GUIDE.md)
   - [API Documentation](API.md)

3. **Common fixes that solve 90% of issues:**
   - Restart both frontend and backend
   - Clear browser cache
   - Verify .env file
   - Reinstall dependencies

4. **Still stuck?**
   - Open an issue on GitHub
   - Include error messages
   - Describe steps to reproduce
   - Mention your OS and Node version

---

## Prevention Tips

**To avoid issues:**

✅ Always run both backend and frontend  
✅ Keep dependencies updated  
✅ Never commit .env file  
✅ Test with simple examples first  
✅ Check logs when something fails  
✅ Use supported file formats  
✅ Ensure API key has credits  

---

**Most issues can be resolved by restarting the servers and verifying the .env configuration!** 🔄
