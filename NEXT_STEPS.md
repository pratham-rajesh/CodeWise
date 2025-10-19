# 🎯 Next Steps - Getting Your Gemini API Key & Running the App

## ⚡ Immediate Actions Required

### Step 1: Get Your Google Gemini API Key (5 minutes)

This is **REQUIRED** to use the AI features. Without it, the app will work but only with mock/demo data.

#### How to Get the Key:

1. **Go to Google AI Studio**
   - Visit: https://makersuite.google.com/app/apikey
   - Or: https://aistudio.google.com/app/apikey

2. **Sign In**
   - Use your Google account
   - Accept terms if prompted

3. **Create API Key**
   - Click "Get API Key" or "Create API Key"
   - Choose "Create API key in new project" (recommended)
   - Or select an existing Google Cloud project

4. **Copy the Key**
   - It will look like: `AIzaSyC...` (39 characters)
   - Copy it immediately - you might not see it again!

5. **Add to .env File**
   - Open `/Users/prathamr/Documents/pattern-trainer-agent/.env`
   - Find the line: `GEMINI_API_KEY=`
   - Paste your key: `GEMINI_API_KEY=AIzaSyC...`
   - Save the file

#### Visual Guide:
```
.env file should look like:
━━━━━━━━━━━━━━━━━━━━━━━━━━
GEMINI_API_KEY=AIzaSyCxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PORT=3000
FETCH_AI_ADDRESS=
━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Step 2: Verify Installation (1 minute)

Make sure everything is installed:

```bash
cd /Users/prathamr/Documents/pattern-trainer-agent
npm install
```

Expected output:
```
added 103 packages
found 0 vulnerabilities
```

---

### Step 3: Start the Server (30 seconds)

```bash
npm start
```

Expected output:
```
============================================================
🎯 Pattern-Trainer Agent Server Started!
============================================================
📡 Server running on: http://localhost:3000
🤖 Gemini API configured: true  ← Should be TRUE
📊 Agent marketplace active
============================================================
```

**IMPORTANT**: If you see `Gemini API configured: false`, the API key wasn't loaded correctly. Check Step 1 again.

---

### Step 4: Open in Browser (10 seconds)

```bash
# Open browser to:
http://localhost:3000
```

Or on Mac:
```bash
open http://localhost:3000
```

---

### Step 5: Test the Flow (2 minutes)

1. **Select a Pattern**
   - Choose "Sliding Window" from dropdown
   - Difficulty: "Medium"

2. **Get Challenge**
   - Click "Get Challenge" button
   - Wait 2-5 seconds for AI generation
   - You should see a unique problem appear

3. **Write Solution**
   - Copy this sample code:
   ```python
   def maxSubArray(nums, k):
       window_sum = sum(nums[:k])
       max_sum = window_sum
       for i in range(k, len(nums)):
           window_sum = window_sum - nums[i-k] + nums[i]
           max_sum = max(max_sum, window_sum)
       return max_sum
   ```

4. **Submit**
   - Click "Submit Solution"
   - Wait 2-5 seconds
   - You should see AI-generated feedback!

5. **Check Profile**
   - Scroll down to "Your Profile"
   - You should see patterns being tracked
   - Credits should be 2 (1 for challenge, 1 for evaluation)

---

## 🔍 Troubleshooting

### Problem: "Gemini API configured: false"

**Solutions:**
1. Check `.env` file exists in project root
2. Verify API key has no extra spaces or quotes
3. Make sure line looks like: `GEMINI_API_KEY=AIzaSy...` (no quotes!)
4. Restart the server after editing `.env`

### Problem: "Failed to generate problem"

**Check:**
1. Internet connection is working
2. API key is valid (try creating a new one)
3. Check browser console for errors (F12)
4. Check terminal for error messages

### Problem: Slow responses (>10 seconds)

**Normal:** AI takes 2-5 seconds
**If very slow:**
- Check internet speed
- Try again (sometimes API is busy)
- Use mock data for demo if needed

### Problem: Mock data appears even with API key

**Solutions:**
1. Restart server completely (Ctrl+C, then `npm start`)
2. Clear browser cache (Ctrl+Shift+R)
3. Check terminal shows "Gemini API configured: true"
4. Verify API key is valid at Google AI Studio

### Problem: Port 3000 already in use

**Solution 1:** Change port
```bash
# Edit .env file
PORT=3001
```

**Solution 2:** Kill process on port 3000
```bash
lsof -ti:3000 | xargs kill -9
```

---

## 📋 Pre-Demo Checklist

Before showing this to anyone:

- [ ] API key added to `.env`
- [ ] Server starts successfully
- [ ] Terminal shows "Gemini API configured: true"
- [ ] Browser opens to http://localhost:3000
- [ ] Can select patterns from dropdown
- [ ] Get Challenge generates AI problem (not mock)
- [ ] Can submit code
- [ ] Feedback is AI-generated (not mock)
- [ ] Credits increment correctly
- [ ] Profile shows weak/strong patterns
- [ ] No errors in browser console (F12)
- [ ] No errors in terminal

---

## 🎬 Quick Demo Commands

```bash
# Terminal 1: Start server
cd /Users/prathamr/Documents/pattern-trainer-agent
npm start

# Terminal 2 (optional): Monitor logs
tail -f /Users/prathamr/Documents/pattern-trainer-agent/*.log

# Browser
open http://localhost:3000
```

---

## 📚 Documentation Reference

| Document | Purpose | When to Read |
|----------|---------|--------------|
| `QUICK_START.md` | Fast setup | **Read first** |
| `README.md` | Overview | Before demo |
| `SETUP.md` | Detailed setup | If issues |
| `TESTING.md` | Test cases | Before demo |
| `DEMO_SCRIPT.md` | Presentation guide | **Before presenting** |
| `PROJECT_OVERVIEW.md` | Architecture | For judges |
| `FILE_STRUCTURE.txt` | File reference | If lost |

---

## 🎯 When You're Ready to Demo

1. **Read:** `DEMO_SCRIPT.md` (5 minutes)
2. **Practice:** Run through the demo flow 2-3 times
3. **Prepare:** Have sample solutions ready to paste
4. **Test:** Make sure everything works end-to-end
5. **Present:** Follow the demo script!

---

## 🚀 Performance Tips

### For Faster Demos:
1. Pre-generate 2-3 challenges before demo
2. Have solutions ready to paste (see QUICK_START.md)
3. Keep browser dev tools closed during demo
4. Use Medium difficulty (faster than Hard)

### For Best Impression:
1. Show the agent logs in terminal
2. Point out credit tracking
3. Demonstrate adaptive learning
4. Show multiple patterns
5. Highlight AI-generated feedback quality

---

## 🔐 Security Notes

**NEVER commit your API key to Git!**

The `.gitignore` file already excludes `.env`, but double-check:

```bash
# Should NOT show .env
git status
```

If `.env` appears in git status:
```bash
git rm --cached .env
```

---

## 💡 Tips for Success

1. **Always have terminal visible during demo** - shows agent logs
2. **Prepare 3-4 sample solutions** - for quick demonstrations
3. **Test both correct and incorrect solutions** - shows feedback variety
4. **Try multiple patterns** - demonstrates versatility
5. **Show the profile updating** - proves adaptive learning works

---

## 📞 Getting Help

### If Something Breaks:

1. **Check terminal** - error messages appear here
2. **Check browser console** (F12) - frontend errors here
3. **Visit** http://localhost:3000/api/health - shows status
4. **Restart server** - fixes most issues
5. **Check documentation** - answers are in the files

### API Key Issues:

Visit: https://aistudio.google.com/app/apikey
- Check key is valid
- Try creating new key
- Verify no usage limits hit

### Still Stuck?

1. Try without API key (uses mock data)
2. Check all files exist (see FILE_STRUCTURE.txt)
3. Reinstall dependencies: `rm -rf node_modules && npm install`
4. Check Node.js version: `node --version` (should be v14+)

---

## 🎊 You're Ready!

Once you've completed Steps 1-5 above, you have a **fully functional** Pattern-Trainer Agent with:

✅ AI-powered problem generation
✅ AI-powered code evaluation
✅ Agent-based architecture
✅ Adaptive learning system
✅ Credit tracking
✅ Beautiful UI
✅ Complete documentation

**Now go build something amazing!** 🚀

---

## 📝 Optional Enhancements

If you have extra time:

### Easy (15 min each):
- [ ] Add more sample solutions to QUICK_START.md
- [ ] Customize the UI colors in styles.css
- [ ] Add your team name to the header

### Medium (30 min each):
- [ ] Add more algorithmic patterns
- [ ] Improve the mock data quality
- [ ] Add localStorage for session persistence

### Hard (1 hour+):
- [ ] Add syntax highlighting to code editor
- [ ] Implement actual code execution
- [ ] Connect to real Fetch.ai network

---

**Good luck with your hackathon!** 🎯

**Questions?** Check the documentation files - everything is explained!

**Ready to present?** Read `DEMO_SCRIPT.md` next!
