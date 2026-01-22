# WEB CALL AGENT SETUP - Quick Start

**Created:** 2026-01-22  
**Status:** Action Required Before Button Works

---

## WHY THE BUTTON ISN'T WORKING

You're using an **OUTBOUND PHONE agent ID** for a **WEB CALL widget**.

These are two different things in Retell:

| Agent Type | Purpose | How It Works | Your Current ID |
|------------|---------|--------------|-----------------|
| **Phone Call Agent** | Automated phone callbacks | Uses Twilio phone number | `agent_8285ad54c45327332b3f374ed5` ✅ |
| **Web Call Agent** | Browser voice widget | WebRTC (no phone needed) | ❌ **NEED TO CREATE** |

---

## WHAT TO DO RIGHT NOW (10 Minutes)

### Step 1: Create Web Call Agent in Retell

1. **Go to**: https://app.retellai.com

2. **Click**: "Agents" → "Create New Agent"

3. **Configure**:
   - **Agent Type**: Choose **"Web Call"** (this is critical!)
   - **Agent Name**: "Agentify Website Agent"
   - **General Prompt**: Copy from your outbound agent OR use this:
   
   ```
   You are Agentify's website voice assistant. You help local business owners understand how we stop missed calls and lost revenue.

   When visitors talk to you:
   - Ask what business they're in
   - Ask about their current call handling challenges
   - Explain Speed-to-Lead and Multi-Channel Hub simply
   - Offer to book a 15-minute discovery call if interested

   Be friendly, professional, and outcome-focused (not tech-focused).
   ```

   - **Voice**: Use same voice as your outbound agent for consistency
   - **Language Model**: GPT-4 or whatever you're using for outbound

4. **Click "Save & Publish"**

5. **Copy the Agent ID** from the agent detail page
   - It starts with `agent_` 
   - It will be DIFFERENT from your phone agent ID

---

### Step 2: Update retell-integration.js

Open `/js/retell-integration.js` and find this section (around line 229):

```javascript
const RETELL_AGENT_ID = 'agent_REPLACE_WITH_WEB_CALL_AGENT_ID';
```

Replace with your NEW web call agent ID:

```javascript
const RETELL_AGENT_ID = 'agent_YOUR_NEW_WEB_AGENT_ID_HERE';
```

---

### Step 3: Deploy & Test

```bash
# In your project directory
git add .
git commit -m "Add web call agent ID"
git push
```

Wait 1-2 minutes for Netlify to deploy.

Then:
1. Visit https://weareagentify.ai
2. Click "Try Our Voice Agent" button
3. Allow microphone permissions
4. Speak to the agent

---

## VERIFICATION CHECKLIST

- [ ] Created NEW agent in Retell dashboard
- [ ] Agent type is "Web Call" (not "Phone Call")
- [ ] Copied the NEW agent ID
- [ ] Updated `retell-integration.js` with NEW ID
- [ ] Committed and pushed to Git
- [ ] Netlify deployed successfully
- [ ] Button opens voice interface
- [ ] Can speak to agent and get responses

---

## TROUBLESHOOTING

### Button still doesn't work
- Open browser console (F12)
- Click the button
- Look for errors
- Common issues:
  - Microphone permissions blocked
  - Wrong agent ID (phone vs web)
  - Environment variable not set in Netlify

### Agent connects but doesn't respond
- Check agent is "Published" in Retell dashboard
- Verify prompt is configured
- Test agent directly in Retell dashboard first

### "Unable to generate access token"
- Check Netlify environment variables
- Make sure `RETELL_API_KEY` is set
- Check Netlify function logs for errors

---

## YOUR TWO AGENTS (Reference)

After setup, you'll have:

**1. Outbound Phone Agent** _(for form callbacks)_
- **ID**: `agent_8285ad54c45327332b3f374ed5`  
- **Number**: +1 469 757 7742 (Twilio)  
- **Used for**: Auto-calling leads after Cal.com form submission
- **Trigger**: n8n workflow

**2. Web Call Agent** _(for website button)_
- **ID**: `agent_???` _(you'll create this)_
- **Number**: None (browser-based)
- **Used for**: "Try Our Voice Agent" button on website
- **Trigger**: Visitor clicks button

Both agents can use similar prompts but serve different purposes!

---

## NEXT STEP AFTER THIS WORKS

Once the web call button works, come back and we'll wire up the **Form → Auto-Call** workflow.

That's when your outbound phone agent (`agent_8285ad54c45327332b3f374ed5`) gets used.

---

**Need Help?**
- Check RETELL_SETUP.md for detailed debugging
- Review browser console for specific errors
- Check Netlify function logs if token generation fails
