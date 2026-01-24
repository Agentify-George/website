# n8n Lead Intake Setup Instructions

This folder contains the `lead-intake.json` workflow template for n8n.

## How to Import
1. Open your n8n instance.
2. Click on **Workflows** > **Add Workflow** (or use an existing one).
3. Click on the **three dots** in the top-right corner and select **Import from File**.
4. Select the `n8n/lead-intake.json` file from this project.

## Configuration Needed
Once imported, you must update the following placeholders in the nodes:

### 1. Google Sheets Nodes
*   **Nodes**: `Google Sheets - Lookup Lead`, `Google Sheets - Append Lead`, `Google Sheets - Update Status`, `Google Sheets - Mark Calling`.
*   **Action**: 
    - Set your **Credential for Google Sheets**.
    - Replace `GOOGLE_SHEET_ID` with the actual ID of your tracking sheet.
    - Ensure your sheet has a tab named `Leads` with the following headers:
        - `lead_id`
        - `name`
        - `email`
        - `phone`
        - `role`
        - `volume`
        - `problems`
        - `success_definition`
        - `company`
        - `timeline`
        - `source`
        - `workflow_status`
        - `created_at`

### 2. Retell - Trigger Call Node
*   **Credential**: Set your **Header Auth** or **API Key** for Retell AI.
*   **Body Content**:
    - Replace `RETELL_AGENT_ID` with your actual Retell Agent ID.
    - Replace `YOUR-SUBDOMAIN.n8n.cloud` in the `webhook_url` with your actual n8n webhook domain.

### 3. Webhooks
*   The workflow provides two entry points:
    - `/agentify-intake`: Used by the website forms (Discovery Form & Waiting List).
    - `/calcom-intake`: Used for Cal.com webhooks.

## Data Mapping Improvements
The normalization logic in this template has been improved to:
1. Capture `company` and `timeline` fields from the website discovery form.
2. Handle the `waiting-list` source correctly (only email is required).
3. Distinguish between `website-discovery`, `howitworks-discovery`, and `website-waiting-list` sources.
