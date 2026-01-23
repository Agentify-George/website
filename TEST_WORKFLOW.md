# Voice Agent Test Workflow

**Date**: 2026-01-22 6:47 PM  
**Test URL**: http://localhost:3000/megan/

---

## Test Steps

1. **Open the page**: http://localhost:3000/megan/
2. **Look for**:
   - Purple microphone button
   - "Talk to Megan!" text
   - Agentify logo
3. **Click the microphone button**
4. **Allow microphone permissions** when prompted
5. **Try speaking** - say "Hello Megan"
6. **Listen for response**

---

## Expected Results

✅ **Page loads** with purple gradient background  
✅ **Microphone button** is visible and clickable  
✅ **"Talk to Megan!"** text appears  
✅ **No error messages** on screen  
✅ **Microphone permission** prompt appears  
✅ **Voice connection** establishes  
✅ **Megan responds** to your voice

---

## If You See Errors

### "MISSING API KEY" error
- API key is set in main index.html but not accessible in iframe
- **Solution**: Use standalone page (not iframe)

### Blank page
- Check browser console (F12) for JavaScript errors
- Check if files loaded correctly

### Microphone doesn't work
- Check browser permissions (lock icon in address bar)
- Try Chrome browser
- Make sure you're on http://localhost (not https)

---

## Report Your Findings

**What do you see when you open http://localhost:3000/megan/?**

1. Does the page load? (Yes/No)
2. Do you see the microphone button? (Yes/No)
3. Do you see "Talk to Megan!" text? (Yes/No)
4. Are there any error messages? (What does it say?)
5. When you click the microphone, what happens?

---

## Next Steps Based on Results

### If it works perfectly:
→ Deploy with button linking to /megan/ (new tab or same page)

### If you see "MISSING API KEY":
→ The iframe approach won't work, use standalone page

### If it doesn't load at all:
→ Check browser console for errors and report back

---

**I've opened http://localhost:3000/megan/ in your browser. Test it now and report what you see!**
