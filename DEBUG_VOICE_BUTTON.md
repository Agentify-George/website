# DEBUGGING CHECKLIST - Voice Button Not Working

**Status:** Button deployed but not responding  
**Time:** Thursday 10:35 AM CST

---

## IMMEDIATE DEBUG STEPS (Do These Now)

### Step 1: Open Browser Console
1. Go to https://weareagentify.ai
2. Press **F12** (or right-click → Inspect)
3. Click **"Console"** tab
4. Look for any **RED errors**

**Screenshot or copy/paste ANY errors you see**

---

### Step 2: Check If Script Loaded
In the console, type this and press Enter:
```javascript
window.retellAgent
```

**Expected results:**
- ✅ **Good:** Shows `RetellVoiceAgent {agentId: "agent_01629b287dbd3ece145e2244d8", ...}`
- ❌ **Bad:** Shows `undefined`

---

### Step 3: Check If SDK Loaded
In the console, type:
```javascript
typeof RetellWebClient
```

**Expected results:**
- ✅ **Good:** Shows `"function"`
- ❌ **Bad:** Shows `"undefined"`

---

### Step 4: Click The Button
Click "Try Our Voice Agent" button and watch console for errors.

**Common errors to look for:**
- `RetellWebClient is not defined`
- `Failed to fetch` (Netlify function error)
- `RETELL_API_KEY not set`
- `404` errors

---

## COMMON ISSUES & FIXES

### Issue 1: "RetellWebClient is not defined"
**Fix:** SDK script not loading correctly
- Check if Retell SDK script tag is present in `<head>`
- Check line 317 in index.html

### Issue 2: "Failed to generate access token" 
**Fix:** Netlify environment variable not set
- Go to Netlify dashboard
- Site Settings → Environment Variables
- Add: `RETELL_API_KEY` = your API key from Retell

### Issue 3: Button doesn't respond at all
**Fix:** JavaScript not initializing
- Check console for errors on page load
- Verify `retell-integration.js` loaded (Network tab)

### Issue 4: "Agent ID not configured"
**Fix:** Code didn't deploy properly
- Check deployed file on Netlify shows correct agent ID
- Visit: `https://weareagentify.ai/js/retell-integration.js`
- Search for `agent_01629b287dbd3ece145e2244d8`

---

## REPORT BACK TO ME

**Tell me:**
1. What `window.retellAgent` shows
2. What `typeof RetellWebClient` shows  
3. Any RED errors in console
4. What happens when you click the button (nothing? error? modal?)

**STOP EVERYTHING ELSE AND DO THIS NOW** ☝️
