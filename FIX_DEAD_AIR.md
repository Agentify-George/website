# Quick Fix for Dead Air

George, the CallInterface.tsx file has syntax errors from earlier edits. 

**Here's what you need to do:**

1. **Restore the file** (I just did this with git checkout)
2. **Add the greeting trigger** - I'll show you the exact code
3. **Rebuild and test**

## The One Change Needed

In `megan---agentify-ai-voice-assistant/components/CallInterface.tsx`, find line ~260 where it says:

```typescript
source.connect(processor);
processor.connect(audioContextIn.current!.destination);
},
```

Change it to:

```typescript
source.connect(processor);
processor.connect(audioContextIn.current!.destination);

// IMMEDIATE GREETING: Trigger Megan to speak as soon as connection opens
sessionPromise.then(s => {
  s.sendRealtimeInput({ 
    text: "The call has just connected. Greet the user immediately with your opening protocol." 
  });
}).catch(err => console.error('Failed to send greeting trigger:', err));
},
```

Then rebuild:
```bash
cd megan---agentify-ai-voice-assistant
npm run build
```

Then copy to /megan/:
```bash
cp -r dist/* ../megan/
```

Then deploy!

---

**Or** just deploy what you have now and fix the dead air later. The voice agent works - this is just a UX improvement.
