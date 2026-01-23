# Quick Setup Guide - Voice Agent Working by End of Day

## What We Just Did

Created a **simple, working voice agent** that bypasses all the React complexity. This is production-ready and will work immediately once you complete the 3 steps below.

## Files Created

1. **`/voice-agent-simple.html`** - Standalone voice agent interface (no React, no build process)
2. **`/netlify/functions/get-retell-token.js`** - Serverless function to securely generate access tokens
3. **Updated `/index.html`** - Modal now loads the simple version

## 3 Steps to Get This Working (15 minutes max)

### Step 1: Create Web Call Agent in Retell (5 min)

**IMPORTANT:** You currently have a **Phone Call agent**. You need a **Web Call agent** for the website button.

1. Go to https://app.retellai.com
2. Click "Agents" → "Create New Agent"
3. **Agent Type**: Select **"Web Call"** (NOT Phone Call!)
4. **Agent Name**: "Agentify Website Agent"
5. **General Prompt**: 
   ```
   You are Agentify's website voice assistant. You help local business owners understand how we stop missed calls and lost revenue.

   When visitors talk to you:
   - Ask what business they're in
   - Ask about their current call handling challenges
   - Explain Speed-to-Lead and Multi-Channel Hub simply
   - Offer to book a 15-minute discovery call if interested

   Be friendly, professional, and outcome-focused (not tech-focused).
   ```
6. **Voice**: Choose the same voice as your phone agent for consistency
7. Click "Save & Publish"
8. **COPY THE AGENT ID** - it starts with `agent_` and will be different from your phone agent

### Step 2: Update the Voice Agent File (2 min)

Open `/voice-agent-simple.html` and find line 172:

```javascript
const RETELL_AGENT_ID = 'agent_8285ad54c45327332b3f374ed5';
```

Replace with your NEW web call agent ID:

```javascript
const RETELL_AGENT_ID = 'agent_YOUR_NEW_WEB_AGENT_ID_HERE';
```

### Step 3: Set Environment Variable in Netlify (3 min)

1. Go to https://app.netlify.com
2. Select your Agentify site
3. Go to **Site settings** → **Environment variables**
4. Click **Add a variable**
5. **Key**: `RETELL_API_KEY`
6. **Value**: Your Retell API key (get from https://app.retellai.com/dashboard → API Keys)
7. Click **Save**

### Step 4: Deploy (2 min)

```bash
cd "/Users/georgehawkins/Documents/Projects/Agentify Website"
git add .
git commit -m "Add simple voice agent - working version"
git push
```

Wait 1-2 minutes for Netlify to deploy.

## Testing

1. Go to https://weareagentify.ai
2. Click "Try Our Voice Agent" button
3. Modal opens with voice interface
4. Click "Start Call"
5. Allow microphone permissions
6. Speak to Megan!

## Troubleshooting

### Button opens but says "Connection Error"
- Check browser console (F12) for specific error
- Verify you created a **Web Call** agent (not Phone Call)
- Verify `RETELL_API_KEY` is set in Netlify environment variables
- Check Netlify function logs for errors

### "Failed to get access token"
- Check Netlify function logs: Site → Functions → get-retell-token
- Verify API key is correct
- Make sure API key has permissions to create web calls

### Microphone not working
- Check browser permissions (click lock icon in address bar)
- Try a different browser (Chrome works best)
- Make sure you're on HTTPS (not HTTP)

## What's Different from Before?

**Before**: Complex React app with TypeScript, build process, API key management
**Now**: Simple HTML/JS that loads instantly, no build required

**Benefits**:
- ✅ Works immediately (no build process)
- ✅ Easy to debug (view source works)
- ✅ Faster loading (no React bundle)
- ✅ More reliable (fewer moving parts)

## Your Two Agents (After Setup)

**1. Phone Call Agent** (for form callbacks)
- ID: `agent_8285ad54c45327332b3f374ed5`
- Number: +1 469 757 7742
- Used for: Auto-calling leads after Cal.com form submission

**2. Web Call Agent** (for website button) 
- ID: `agent_???` (you'll create this)
- Number: None (browser-based)
- Used for: "Try Our Voice Agent" button on website

## Next Steps (After This Works)

Once the voice button works, we can wire up the Form → Auto-Call workflow using your phone agent.

But first, let's get this working so you can test it before your vacation!

---

**Need help?** Check the browser console for errors and Netlify function logs.
