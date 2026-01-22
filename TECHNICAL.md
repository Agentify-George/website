# TECHNICAL.md - Agentify Technical Documentation

**Purpose:** This file documents technical decisions, architecture, and implementation details for future developers. George does not need to read this file - it's for developers maintaining or extending the system.

---

## System Architecture Overview

**System Type:** Closed-loop lead intelligence and conversion system  
**Primary Goal:** Automate lead qualification, instant callback, discovery, and proposal generation

**High-Level Flow:**
```
Website Form Submission (Cal.com)
    ↓ (webhook)
n8n Automation Engine
    ↓ (create row)
Google Sheets (CRM/tracking)
    ↓ (trigger)
Retell AI (outbound voice call)
    ↓ (discovery questions)
Call Transcript/Summary
    ↓ (update row)
Google Sheets (enriched data)
    ↓ (trigger)
Proposal Generation (Google Docs/Slides)
    ↓ (email)
Prospect receives proposal + booking link
    ↓
Follow-up sequences (email/SMS)
```

---

## Technology Stack

### Frontend
- **Website:** Static HTML/CSS/JavaScript
- **Hosting:** Netlify (with serverless functions)
- **Forms:** Cal.com embedded booking forms
- **Voice Widget:** Retell AI Web SDK (embedded widget)
- **Framework:** Vanilla (no React/Vue/Angular - intentional for simplicity and speed)

### Backend / Automation
- **Automation Platform:** n8n (self-hosted or cloud)
- **Voice AI:** Retell AI
  - Inbound agents (website widget)
  - Outbound agents (auto-callback after form submission)
- **AI Models:** OpenAI GPT-4/Gemini 2.5 for summarization and dynamic content
- **CRM/Database:** Google Sheets (intentional for simplicity and client visibility)
- **Proposal Generation:** Google Docs API / Google Slides API

### Integrations
- Cal.com → Webhook → n8n
- n8n ↔ Google Sheets (read/write)
- n8n ↔ Retell AI (trigger calls, receive transcripts)
- n8n ↔ OpenAI/Gemini (summarization)
- n8n ↔ Google Workspace (Docs/Slides generation)
- n8n ↔ Email (proposal delivery)

---

## Data Model

### Google Sheets Schema: `Agentify Lead Pipeline`

**Core Identity Fields:**
- `timestamp` - Auto-generated on form submission
- `contact_name` - Full name from form
- `contact_email` - Work email
- `company_name` - Business name
- `role` - Founder/CEO, Sales Leader, Operations Leader, Support/CX, Other

**Volume & Intent Fields:**
- `monthly_volume_range` - Under 50 | 50-200 | 200-500 | 500+ | Not sure
- `timeline` - Immediately | Next 30 days | Exploring options | Not sure yet
- `primary_problems` - Array/comma-separated: Missing inbound calls, Slow lead follow-up, Low booking rates, Old leads not converting, Too much manual communication
- `success_definition` - Free text: "What would success look like for you?"

**System Status Fields:**
- `source` - Website | In-person | Referral
- `status` - New | Called | Qualified | Closed
- `auto_call_completed` - Yes | No
- `call_summary` - AI-generated summary from Retell transcript
- `pain_summary` - Extracted key pain points
- `estimated_missed_opportunities` - Numeric estimate from discovery
- `recommended_system` - Speed-to-Lead | Multi-Channel Hub | Both
- `next_action` - Follow-up | Proposal Sent | Booked | Nurture

**Discovery Call Data (populated post-call):**
- `current_process_summary` - How they handle leads today
- `after_hours_handling` - What happens after hours
- `response_speed_estimate` - How fast they typically respond
- `operational_impact` - How missed calls affect team
- `fit_confirmation` - Yes | Unclear | No
- `objection_type` - If any objection surfaced

---

## Retell AI Configuration

### Inbound Agent (Website Widget)
**Purpose:** Allow website visitors to interact with voice AI for immediate qualification

**Configuration:**
- **Voice:** Professional, friendly (OpenAI voices or ElevenLabs)
- **Primary Function:** Answer FAQs, qualify interest, book discovery calls
- **Escalation:** Route to human if complex questions arise
- **Integration:** Embedded via Retell Web SDK script tag

**System Prompt Structure:**
```
You are Agentify's voice assistant, helping local business owners understand how we can help them stop missing calls and bookings.

Key capabilities to mention:
- Speed-to-Lead (instant callback system)
- Multi-Channel Hub (unified communications)
- Closed-loop revenue tracking

If they want to learn more, book a 15-minute discovery call.
Be friendly, professional, and outcome-focused (not tech-focused).
```

### Outbound Agent (Auto-Callback)
**Purpose:** Call new leads within seconds of form submission to run discovery

**Configuration:**
- **Voice:** Same as inbound for consistency
- **Call Trigger:** New row in Google Sheet with `status=New`
- **Primary Function:** Run 30-minute discovery call script
- **Data Access:** Receives form data (name, company, problems, etc.) via API call parameters
- **Output:** Full transcript + AI-generated summary returned to n8n

**System Prompt:** (See discovery script in CLAUDE.md - translated into agent instructions)

Key sections:
1. Opening/framing
2. Context & baseline questions
3. Surface the pain
4. Quantify the leak (ROI math)
5. Position the solution
6. Validate fit
7. Set next steps (proposal + follow-up)

---

## n8n Workflow Architecture

### Workflow 1: Form Submission → Auto-Call
**Trigger:** Webhook from Cal.com
**Steps:**
1. Receive webhook payload (form data)
2. Normalize/map fields to Sheet schema
3. Append new row to Google Sheets
4. Trigger Retell outbound call
   - Pass `contact_name`, `company_name`, `primary_problems`, etc. as call context
5. Wait for call completion webhook from Retell
6. Update same Sheet row with:
   - `auto_call_completed = Yes`
   - `call_summary` (from Retell transcript)
   - `status = Called`

### Workflow 2: Call Summary → Proposal Generation
**Trigger:** Google Sheet row updated with `call_summary` populated
**Steps:**
1. Extract data from Sheet row
2. Pass to OpenAI/Gemini for structured extraction:
   - Pain summary
   - Missed opportunity estimate
   - Recommended system
3. Update Sheet with extracted insights
4. Generate proposal:
   - Google Doc template with dynamic fields
   - OR Google Slides deck
5. Email proposal to `contact_email`
6. Update Sheet: `next_action = Proposal Sent`

### Workflow 3: Follow-Up Sequences (Future)
**Trigger:** TBD (time-based or status-based)
**Purpose:** Nurture leads, re-engage cold prospects, cross-sell
**Status:** Not yet implemented (post-vacation priority)

---

## Cal.com Form Configuration

**Form Fields (Required):**
- Full Name (text)
- Work Email (email)
- Company Name (text)
- Your Role (dropdown)
- Monthly Inbound Leads/Calls (dropdown)
- Timeline (dropdown)
- Primary Problems to Solve (multi-select, max 2)
- What would success look like for you? (textarea)

**Webhook Configuration:**
- Enable webhook on booking confirmation
- Webhook URL: `[n8n instance]/webhook/agentify-lead-capture`
- Payload format: JSON with all form field values

---

## Retell Web SDK Integration

**Implementation:**
```html
<!-- In index.html or global script -->
<script src="https://cdn.jsdelivr.net/npm/retell-client-js-sdk@latest/dist/retell-client.min.js"></script>

<script>
  const retellClient = new RetellClient();
  
  // Initialize with your Retell agent ID
  function startVoiceAgent() {
    retellClient.startCall({
      agentId: "your-retell-agent-id-here",
      // Optional: pass user context
      metadata: {
        source: "website",
        page: window.location.pathname
      }
    });
  }
  
  // Attach to button click
  document.getElementById('voice-agent-btn').addEventListener('click', startVoiceAgent);
</script>
```

**Notes:**
- Agent ID stored in Retell dashboard
- Consider environment variables for production vs. staging
- Monitor call quality and latency in Retell analytics

---

## Proposal Generation

### Google Docs Template
**Template Structure:**
- Header with Agentify branding
- Dynamic fields:
  - `{{contact_name}}`
  - `{{company_name}}`
  - `{{pain_summary}}`
  - `{{estimated_missed_opportunities}}`
  - `{{recommended_system}}`
  - `{{monthly_investment_range}}`
- Clear CTA: Book follow-up call

**Dynamic Field Population:**
- Use Google Docs API to copy template
- Find/replace placeholders with actual data
- Generate shareable link (view or comment access)

### Google Slides Alternative
- Similar template approach
- More visual for some verticals
- Same dynamic field logic

---

## Discovery Call Script (Agent Implementation)

**See CLAUDE.md Section 8 for full script**

**Key Implementation Notes:**
- Agent should pause after open-ended questions (allow 5-10 sec for response)
- Use conditional logic based on `primary_problems` from form
- Reference form data naturally: "You mentioned missing inbound calls..."
- Math should be conversational, not robotic
- Soft close: validate fit, don't hard sell

**Transcript Processing:**
- Full transcript stored for compliance/review
- AI summary focuses on:
  - Core pain points
  - Quantified opportunity (calls, revenue)
  - Objections or hesitations
  - Next step intent

---

## API Keys & Secrets Management

**Required API Keys:**
- Retell AI API key
- OpenAI API key (or Gemini API key)
- Google Sheets API credentials (service account)
- Google Docs/Slides API credentials
- Cal.com webhook secret (for verification)

**Storage:**
- Use environment variables (`.env` file locally, never commit)
- Netlify: Store in environment variables section
- n8n: Use credentials manager for all integrations

**Security:**
- Rotate keys periodically
- Use least-privilege access for Google service accounts
- Validate webhook signatures from Cal.com

---

## Deployment & Hosting

### Website (Static Files)
- **Host:** Netlify
- **Repo:** [TBD - likely GitHub]
- **Build:** None (static HTML/CSS/JS)
- **Edge Functions:** Netlify Functions if needed for backend logic
- **SSL:** Automatic via Netlify
- **Custom Domain:** weareagentify.ai

### n8n Instance
- **Option 1:** n8n Cloud (easiest, paid)
- **Option 2:** Self-hosted on VPS (DigitalOcean/AWS/GCP)
- **Recommendation:** Start with n8n Cloud, migrate to self-hosted if cost becomes issue

### Data Storage
- **Google Sheets:** Cloud-based, no hosting needed
- **Consideration:** If scale exceeds Sheet limits (10M cells), migrate to Airtable or PostgreSQL

---

## Testing Strategy

### Manual Testing (Current)
- Submit test form with sample data
- Verify Sheet row creation
- Verify outbound call triggers
- Answer call, complete discovery flow
- Verify call summary populates Sheet
- Verify proposal generates and sends

### Automated Testing (Future)
- n8n workflow testing (built-in test mode)
- Integration tests for critical paths
- Monitoring/alerting for failed workflows

### Quality Checks
- Call quality reviews (listen to sample calls weekly)
- Proposal accuracy (ensure dynamic fields populate correctly)
- Response time monitoring (form → call should be <30 seconds)

---

## Performance & Monitoring

### Key Metrics to Track
- **Speed-to-Lead:** Time from form submit to call initiation (target: <30 sec)
- **Call Completion Rate:** % of triggered calls that complete successfully
- **Sheet Update Success:** % of calls that successfully update Sheet
- **Proposal Send Rate:** % of completed calls that trigger proposals

### Monitoring Tools
- Retell AI analytics dashboard (call quality, duration, transcripts)
- n8n execution logs (workflow success/failure)
- Google Sheets audit log (data integrity)
- Email delivery tracking (proposal opens/clicks)

### Alerts
- n8n workflow failures → email/Slack
- Retell API errors → email
- Form submissions with no call → investigate

---

## Future Technical Improvements

**Post-Vacation Priorities:**
1. SMS follow-up integration (Twilio or similar)
2. Better CRM (migrate from Sheets to Airtable or HubSpot)
3. Proposal template versioning (A/B test layouts)
4. Multi-language support (if expanding beyond English-speaking markets)
5. Call recording storage (S3 or similar for compliance)

**Nice-to-Haves:**
- Dashboard for George to view pipeline (Retool or Streamlit)
- Automated reporting (weekly pipeline summary email)
- Call coaching (AI analysis of call quality + suggestions)

---

## Known Issues & Limitations

**Current Limitations:**
- Google Sheets has cell limits (10M cells) - will need migration at scale
- Retell AI latency can vary by region/time of day
- No SMS follow-up yet (email only)
- Proposal generation is single-template (no variation testing)

**Workarounds:**
- Monitor Sheet cell count, archive old leads quarterly
- Test Retell call quality during peak hours
- Manual SMS for hot leads if needed
- Create multiple proposal templates manually until A/B testing needed

---

## Troubleshooting Guide

### Issue: Form submitted but no call triggered
**Check:**
1. Cal.com webhook logs - did webhook fire?
2. n8n workflow execution log - did workflow run?
3. Google Sheets - did row appear?
4. Retell API logs - was call API called successfully?

### Issue: Call completed but Sheet not updated
**Check:**
1. Retell webhook configuration - is callback URL correct?
2. n8n webhook listener - is it receiving Retell callbacks?
3. Call summary generation - did AI summarization fail?

### Issue: Proposal not generating
**Check:**
1. Google API credentials - still valid?
2. Template document - still accessible?
3. Dynamic field mapping - all placeholders matching?

---

## Code Standards

**File Organization:**
- `/index.html` - Main landing page
- `/css/` - Stylesheets
- `/js/` - JavaScript files
  - `/js/retell-integration.js` - Retell SDK logic
- `/images/` - Image assets
- `/netlify/functions/` - Serverless functions (if needed)

**Naming Conventions:**
- CSS classes: kebab-case (`primary-cta-button`)
- JavaScript: camelCase (`startVoiceAgent()`)
- Files: lowercase with hyphens (`retell-integration.js`)

**Comments:**
- Comment non-obvious logic
- Document API integrations clearly
- Include links to external documentation where helpful

---

## Security Considerations

**Data Privacy:**
- GDPR compliance TBD (if expanding to EU)
- Record consent before calls (legal requirement in some states)
- Store call recordings securely
- Allow users to request data deletion

**API Security:**
- Validate all webhook signatures
- Rate limit public-facing forms
- Use HTTPS everywhere
- Sanitize user inputs before Sheet storage

**Access Control:**
- Limit Google Sheet access (share-by-invite only)
- Use service accounts with minimal permissions
- Rotate API keys quarterly

---

## Documentation Maintenance

**This file should be updated when:**
- New integrations added
- Architecture changes materially
- New workflows deployed
- Performance issues identified and resolved
- Security incidents occur

**Owned by:** Technical lead (currently Claude/AI assistant in consultation with George)

**Last Updated:** 2026-01-22  
**Next Review:** After vacation, before scaling outreach

---

## For Future Developers

**Read These First:**
1. CLAUDE.md - How to work with George
2. This file (TECHNICAL.md) - System architecture
3. PROJECT_STATUS.md - Current state and priorities

**Then:**
- Review n8n workflows in detail
- Listen to sample Retell calls
- Test full flow end-to-end yourself
- Ask George for context on business priorities before changing core logic

**Philosophy:**
- Boring tech is better than cutting-edge
- Simple solutions beat clever ones
- Optimize for maintainability, not cleverness
- If it works, don't fix it (yet)
