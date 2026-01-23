# 🚀 DEPLOY NOW - 10 Minute Checklist

**Current Time**: 6:17 PM  
**Deadline**: End of day  
**Time Needed**: 10 minutes

---

## ✅ What's Done

- Voice agent code is fixed and ready
- No more iframe issues
- Microphone will work
- Direct integration like Sushi on Fire

## 🎯 What You Need To Do

### 1. Create Web Call Agent (5 min)

https://app.retellai.com → Create New Agent

**Settings**:
- Type: **Web Call** ⚠️ (NOT Phone Call!)
- Name: Agentify Website Agent
- Prompt: (copy from your phone agent)
- Voice: (same as phone agent)

**→ COPY THE AGENT ID** (starts with `agent_`)

---

### 2. Update Code (1 min)

Open `/index.html` and find line ~3009:

```javascript
const RETELL_AGENT_ID = 'agent_8285ad54c45327332b3f374ed5';
```

Replace with your NEW Web Call agent ID:

```javascript
const RETELL_AGENT_ID = 'agent_YOUR_NEW_ID_HERE';
```

---

### 3. Set API Key in Netlify (2 min)

1. Go to https://app.netlify.com
2. Select your Agentify site
3. Site settings → Environment variables
4. Add variable:
   - **Key**: `RETELL_API_KEY`
   - **Value**: (your Retell API key from dashboard)
5. Save

---

### 4. Deploy (2 min)

```bash
cd "/Users/georgehawkins/Documents/Projects/Agentify Website"
git add .
git commit -m "Fix voice agent - working version"
git push
```

Wait 1-2 minutes for Netlify to deploy.

---

### 5. Test (1 min)

1. Go to https://weareagentify.ai
2. Click "Try Our Voice Agent"
3. Click "Start Call"
4. Allow microphone
5. Talk to Megan!

---

## ⚠️ Common Mistakes

❌ Using Phone Call agent instead of Web Call agent  
❌ Forgetting to set RETELL_API_KEY in Netlify  
❌ Not waiting for Netlify deployment to finish  

---

## 🆘 If It Doesn't Work

1. Open browser console (F12)
2. Click "Start Call"
3. Look for error message
4. Check:
   - [ ] Created **Web Call** agent (not Phone Call)
   - [ ] Updated agent ID in index.html
   - [ ] Set RETELL_API_KEY in Netlify
   - [ ] Netlify deployment succeeded
   - [ ] Allowed microphone permissions

---

## 📊 Progress Tracker

- [ ] Step 1: Create Web Call agent (5 min)
- [ ] Step 2: Update agent ID in code (1 min)
- [ ] Step 3: Set API key in Netlify (2 min)
- [ ] Step 4: Deploy to Netlify (2 min)
- [ ] Step 5: Test on live site (1 min)

**Total**: 10 minutes

---

## 🎉 Success Looks Like

- Modal opens with voice interface
- "Start Call" button works
- Status shows "Connecting..." then "Listening..."
- You can talk to Megan
- She responds
- "End Call" button works
- No errors in console

---

**START NOW** - You have 5+ hours until end of day. This takes 10 minutes.

See `FIXED_VOICE_AGENT.md` for detailed explanation of what was fixed.
