# Retell AI Integration Setup Guide

This guide will help you complete the Retell AI voice agent integration on your website.

## 📋 Prerequisites

- [ ] Retell AI account ([sign up here](https://www.retellai.com))
- [ ] Netlify account for hosting (already using)
- [ ] Your website already has the Retell SDK loaded ✅

## 🔑 Step 1: Get Your Retell Credentials

### 1.1 Login to Retell Dashboard
Visit: https://app.retellai.com

### 1.2 Get Your API Key
1. Go to **Settings** → **API Keys**
2. Click **Create New API Key**
3. Copy the API key (starts with `key_...`)
4. **Save it securely** - you'll need it for Netlify

### 1.3 Get Your Agent ID
1. Go to **Agents** section
2. Find or create your voice agent
3. Click on the agent
4. Copy the **Agent ID** (starts with `agent_...`)

## 🚀 Step 2: Configure Netlify Environment Variables

### 2.1 Add Environment Variable
1. Go to your Netlify dashboard
2. Navigate to **Site Settings** → **Environment Variables**
3. Click **Add a variable**
4. Add:
   - **Key**: `RETELL_API_KEY`
   - **Value**: `your-retell-api-key-here`
5. Click **Save**

## 📝 Step 3: Update Your Code

### 3.1 Update Agent ID in JavaScript
Edit `js/retell-integration.js` line 209:

```javascript
// Replace this line:
const RETELL_AGENT_ID = 'agent_xxxxxxxxxxxxxxxxxxxxxxxx';

// With your actual agent ID:
const RETELL_AGENT_ID = 'agent_YOUR_ACTUAL_ID_HERE';
```

### 3.2 Add Script to HTML Files
Add this line before the closing `</body>` tag in your HTML files:

```html
<script src="/js/retell-integration.js"></script>
```

**Files to update:**
- `index.html`
- `about.html`
- `blog.html`
- `case-studies.html`
- `howitworks.html`
- `pricing.html`
- `privacy.html`
- `terms.html`

## 🧪 Step 4: Test the Integration

### 4.1 Deploy to Netlify
```bash
git add .
git commit -m "Add Retell AI voice agent integration"
git push
```

Netlify will automatically deploy your changes.

### 4.2 Test on Your Site
1. Visit your website
2. Click the **"Try Our Voice Agent"** button
3. Allow microphone permissions when prompted
4. Speak to test the voice agent

### 4.3 Check Console
Open browser DevTools (F12) → Console and verify:
- ✅ No errors
- ✅ See "Call started" when button clicked
- ✅ Voice agent responds

## 🎨 Step 5: Customize (Optional)

### Button Styling
The button styling is already configured in your HTML. To customize:

Location: `index.html` line 423-427

### Call Status Notifications
Add toast notifications by modifying `showCallStatus()` method in `retell-integration.js`

### Audio Visualizer
Uncomment the audio visualizer code in `retell-integration.js` line 56

## 🔍 Troubleshooting

### Issue: "Unable to connect to voice agent"
**Solution:**
- Check Netlify environment variable is set
- Verify Agent ID is correct
- Check browser console for specific errors

### Issue: Button doesn't work
**Solution:**
- Ensure `retell-integration.js` is loaded
- Check browser console for errors
- Verify button ID is `retell-voice-agent-btn`

### Issue: No audio
**Solution:**
- Check microphone permissions in browser
- Try in Chrome/Edge (best compatibility)
- Check Retell agent is published in dashboard

### Issue: Call connects but agent doesn't speak
**Solution:**
- Verify agent is configured in Retell dashboard
- Check agent has a valid LLM configuration
- Test agent in Retell dashboard first

## 📊 Step 6: Monitor Call Analytics

### Retell Dashboard
1. Go to **Calls** section
2. View all call logs, transcripts, and recordings
3. Check call duration, success rate, etc.

### Export Call Data
Calls are automatically logged. To export:
1. Configure webhook in Retell dashboard
2. Point to `/.netlify/functions/log-call-data`
3. Store in your Google Sheets (Phase 3)

## ✅ Verification Checklist

- [ ] Retell API key added to Netlify
- [ ] Agent ID updated in `retell-integration.js`
- [ ] Script tag added to all HTML files
- [ ] Code deployed to Netlify
- [ ] Button triggers call successfully
- [ ] Voice agent responds to speech
- [ ] Call ends properly
- [ ] No console errors

## 🎯 Next Steps

Once voice agent is working:

1. **Phase 2**: Set up Cal.com webhook integration
2. **Phase 3**: Create Google Sheets lead database
3. **Phase 4**: Enable automated outbound calling

See `implementation_plan.md` for full roadmap.

## 📞 Support

- **Retell Documentation**: https://docs.retellai.com
- **Retell Discord**: Check Retell website for community
- **Issue with this integration**: Check browser console and Netlify function logs

---

## Quick Reference

### Important Files Created
```
netlify/functions/get-retell-token.js  - Token generation
js/retell-integration.js               - Client-side logic
RETELL_SETUP.md                        - This guide
```

### Important IDs
- **Agent ID**: `agent_...` (from Retell dashboard)
- **API Key**: `key_...` (keep secret!)

### Netlify Function Endpoint
```
/.netlify/functions/get-retell-token
```

### Button ID
```html
<button id=\"retell-voice-agent-btn\">...</button>
```
