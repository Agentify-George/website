
# How to Embed Megan on Your WordPress Site

Follow these steps to integrate the Megan Voice Agent into your website.

### 1. Deploy the Application
First, deploy this code to a hosting provider (like Vercel or Netlify). You will get a URL (e.g., `https://agentify-megan.vercel.app`).

### 2. WordPress Implementation
Use a **Custom HTML** block in WordPress or edit your theme's HTML to add the following code where you want the link to appear.

#### Option A: Modal (Pop-up) Implementation (Recommended)
This will open Megan in a clean overlay when users click your "Try Our Voice Agent" link.

```html
<!-- Trigger Link -->
<a href="#" id="open-megan-btn" style="text-decoration: none; font-weight: bold; color: #a855f7;">Try Our Voice Agent</a>

<!-- Modal Overlay -->
<div id="megan-modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 99999; backdrop-filter: blur(10px);">
    <div style="position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
        <button id="close-megan-btn" style="position: absolute; top: 30px; right: 30px; background: transparent; border: 1px solid rgba(255,255,255,0.2); color: white; padding: 10px 20px; cursor: pointer; border-radius: 50px; font-family: Montserrat, sans-serif;">CLOSE CALL</button>
        <iframe 
            src="YOUR_DEPLOYED_URL_HERE" 
            style="width: 100%; max-width: 800px; height: 90vh; border: none; border-radius: 20px; box-shadow: 0 0 100px rgba(168, 85, 247, 0.2);"
            allow="microphone"
        ></iframe>
    </div>
</div>

<script>
    const modal = document.getElementById('megan-modal');
    const openBtn = document.getElementById('open-megan-btn');
    const closeBtn = document.getElementById('close-megan-btn');

    openBtn.onclick = (e) => {
        e.preventDefault();
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    };

    closeBtn.onclick = () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };
</script>
```

#### Option B: Inline Embed
If you want Megan to sit directly on the page:

```html
<div style="width: 100%; height: 600px; border-radius: 30px; overflow: hidden; background: #04010a;">
  <iframe 
    src="YOUR_DEPLOYED_URL_HERE" 
    style="width: 100%; height: 100%; border: none;" 
    allow="microphone"
  ></iframe>
</div>
```

**Note:** Replace `YOUR_DEPLOYED_URL_HERE` with the actual URL of your hosted Megan app. Ensure your site uses HTTPS, as the microphone API requires a secure connection.
