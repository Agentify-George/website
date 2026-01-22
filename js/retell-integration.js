/**
 * Retell AI Voice Agent Integration
 * 
 * This script handles the Retell AI voice widget integration for the website.
 * It manages call initialization, status updates, and UI interactions.
 * 
 * Requirements:
 * - Retell SDK must be loaded (already in index.html line 317)
 * - Agent ID from Retell dashboard
 * - Backend function for token generation
 */

class RetellVoiceAgent {
    constructor(agentId) {
        this.agentId = agentId;
        this.client = null;
        this.isCallActive = false;
        this.callId = null;

        this.init();
    }

    init() {
        // Initialize Retell Web Client
        if (typeof RetellClient === 'undefined') {
            console.error('Retell SDK not loaded');
            return;
        }

        this.client = new RetellClient();
        this.setupEventListeners();
        this.setupCallHandlers();
    }

    setupEventListeners() {
        // Call started
        this.client.on('conversationStarted', () => {
            console.log('✅ Call started');
            this.isCallActive = true;
            this.updateUI('active');
            this.showCallStatus('Connected! Speak now...');
        });

        // Call ended
        this.client.on('conversationEnded', ({ code, reason }) => {
            console.log('📞 Call ended:', code, reason);
            this.isCallActive = false;
            this.updateUI('ended');
            this.showCallStatus('Call ended');

            // Send call data to analytics/backend
            this.logCallData({ code, reason, callId: this.callId });
        });

        // Error handling
        this.client.on('error', (error) => {
            console.error('❌ Call error:', error);
            this.isCallActive = false;
            this.updateUI('error');
            this.showCallStatus('Call failed. Please try again.');
        });

        // Audio level (for visualizations)
        this.client.on('audio', (audio) => {
            // Optional: Add audio visualizer here
            // this.updateAudioVisualizer(audio);
        });

        // Agent speaking
        this.client.on('agent_start_talking', () => {
            console.log('🤖 Agent speaking...');
        });

        // Agent stopped speaking
        this.client.on('agent_stop_talking', () => {
            console.log('🤖 Agent stopped');
        });
    }

    setupCallHandlers() {
        // Button click handler
        const button = document.getElementById('retell-voice-agent-btn');
        if (button) {
            button.addEventListener('click', () => this.handleCallButtonClick());
        }
    }

    async handleCallButtonClick() {
        if (this.isCallActive) {
            // End call if already active
            this.endCall();
        } else {
            // Start new call
            await this.startCall();
        }
    }

    async startCall() {
        try {
            this.updateUI('connecting');
            this.showCallStatus('Connecting...');

            // Get access token from backend
            const response = await fetch('/.netlify/functions/get-retell-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    agentId: this.agentId
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const { accessToken, callId } = await response.json();
            this.callId = callId;

            // Start the call
            await this.client.startConversation({
                accessToken: accessToken,
                callId: callId,
                sampleRate: 24000,
                enableUpdate: true,
            });

        } catch (error) {
            console.error('Error starting call:', error);
            this.updateUI('error');
            this.showCallStatus('Unable to start call. Please try again.');

            // Show user-friendly error
            alert('Unable to connect to voice agent. Please check your microphone permissions and try again.');
        }
    }

    endCall() {
        if (this.client && this.isCallActive) {
            this.client.stopConversation();
            this.isCallActive = false;
            this.updateUI('idle');
        }
    }

    updateUI(state) {
        const button = document.getElementById('retell-voice-agent-btn');
        if (!button) return;

        // Update button text and styling based on state
        switch (state) {
            case 'idle':
                button.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            <line x1="12" x2="12" y1="19" y2="22"></line>
          </svg>
          Try Our Voice Agent
        `;
                button.disabled = false;
                button.classList.remove('bg-red-600', 'animate-pulse');
                break;

            case 'connecting':
                button.innerHTML = `
          <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Connecting...
        `;
                button.disabled = true;
                break;

            case 'active':
                button.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="2"></rect>
            <rect x="14" y="4" width="4" height="16" rx="2"></rect>
          </svg>
          End Call
        `;
                button.disabled = false;
                button.classList.add('bg-red-600', 'animate-pulse');
                break;

            case 'ended':
            case 'error':
                this.updateUI('idle');
                break;
        }
    }

    showCallStatus(message) {
        // Optional: Show toast notification or status message
        console.log('Status:', message);

        // You can add a toast notification here
        // For example, using a toast library or custom implementation
    }

    async logCallData(data) {
        // Send call data to your backend for analytics/logging
        try {
            await fetch('/.netlify/functions/log-call-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    timestamp: new Date().toISOString(),
                    page: window.location.pathname,
                })
            });
        } catch (error) {
            console.error('Error logging call data:', error);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // ⚠️ Web Call Agent for website voice widget
    // This is different from your outbound phone agent (agent_8285ad54c45327332b3f374ed5)
    const RETELL_AGENT_ID = 'agent_01629b287dbd3ece145e2244d8';

    // Only initialize if we have an agent ID
    if (RETELL_AGENT_ID && RETELL_AGENT_ID !== 'agent_REPLACE_WITH_WEB_CALL_AGENT_ID') {
        window.retellAgent = new RetellVoiceAgent(RETELL_AGENT_ID);
    } else {
        console.warn('⚠️ Retell Web Call Agent ID not configured. Create a Web Call agent in Retell dashboard and update this ID.');
    }
});
