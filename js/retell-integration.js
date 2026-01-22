/**
 * Retell AI Voice Agent Integration
 * 
 * This script handles the Retell AI voice widget integration for the website.
 * It manages call initialization, status updates, and UI interactions.
 */

class RetellVoiceAgent {
    constructor(agentId, clientClass) {
        this.agentId = agentId;
        this.clientClass = clientClass;
        this.client = null;
        this.isCallActive = false;
        this.callId = null;

        this.init();
    }

    init() {
        // Initialize Retell Client with the provided class
        this.client = new this.clientClass();
        this.setupEventListeners();
        this.setupCallHandlers();
    }

    setupEventListeners() {
        // Handle both possible event names (SDK version variance)
        const startedEvents = ['conversationStarted', 'call_started'];
        const endedEvents = ['conversationEnded', 'call_ended'];

        startedEvents.forEach(event => {
            this.client.on(event, () => {
                console.log('✅ Call started');
                this.isCallActive = true;
                this.updateUI('active');
                this.showCallStatus('Connected! Speak now...');
            });
        });

        endedEvents.forEach(event => {
            this.client.on(event, (data) => {
                const code = data?.code || 'unknown';
                const reason = data?.reason || 'unknown';
                console.log('📞 Call ended:', code, reason);
                this.isCallActive = false;
                this.updateUI('ended');
                this.showCallStatus('Call ended');

                // Send call data to tracking/backend
                this.logCallData({ code, reason, callId: this.callId });
            });
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
            this.updateAudioVisualizer(audio);
        });

        // Agent speaking state
        this.client.on('agent_start_talking', () => {
            console.log('🤖 Agent speaking...');
            this.toggleAgentSpeakingUI(true);
        });

        this.client.on('agent_stop_talking', () => {
            console.log('🤖 Agent stopped');
            this.toggleAgentSpeakingUI(false);
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
            this.endCall();
        } else {
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

            // Start the call - try both method names for compatibility
            const startMethod = this.client.startCall || this.client.startConversation;
            if (!startMethod) {
                throw new Error('Retell SDK start method not found. Ensure SDK is loaded correctly.');
            }

            await startMethod.call(this.client, {
                accessToken: accessToken,
                callId: callId,
                sampleRate: 24000,
                enableUpdate: true,
                emitRawAudioSamples: true // Enables the 'audio' event
            });

        } catch (error) {
            console.error('Error starting call:', error);
            this.updateUI('error');
            this.showCallStatus('Unable to start call. Please try again.');
            alert('Unable to connect to voice agent. Please check your microphone permissions and try again.');
        }
    }

    endCall() {
        if (this.client && this.isCallActive) {
            const stopMethod = this.client.stopCall || this.client.stopConversation;
            if (stopMethod) {
                stopMethod.call(this.client);
            }
            this.isCallActive = false;
            this.updateUI('idle');
        }
    }

    updateUI(state) {
        const button = document.getElementById('retell-voice-agent-btn');
        if (!button) return;

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
                button.className = "sm:w-auto transition-all duration-300 flex text-sm font-medium w-full border rounded-full pt-3.5 pr-8 pb-3.5 pl-8 gap-x-2 gap-y-2 items-center justify-center hover:border-white/20 text-white bg-purple-700/5 border-white/10 font-manrope";
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
                button.className = "sm:w-auto transition-all duration-300 flex text-sm font-medium w-full border rounded-full pt-3.5 pr-8 pb-3.5 pl-8 gap-x-2 gap-y-2 items-center justify-center bg-red-600 border-red-500 text-white font-manrope animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.5)]";
                break;
        }
    }

    toggleAgentSpeakingUI(isTalking) {
        const btn = document.getElementById('retell-voice-agent-btn');
        if (btn && this.isCallActive) {
            if (isTalking) {
                btn.classList.add('ring-4', 'ring-purple-500/30');
            } else {
                btn.classList.remove('ring-4', 'ring-purple-500/30');
            }
        }
    }

    updateAudioVisualizer(audio) {
        // Placeholder for future visualization logic
        // This receives raw audio data from the SDK
    }

    showCallStatus(message) {
        console.log('Voice Agent Status:', message);
    }

    async logCallData(data) {
        try {
            await fetch('/.netlify/functions/log-call-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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

/**
 * Initialization Logic
 */
function initializeRetellAgent() {
    const ClientClass = window.RetellWebClient || window.RetellClient;

    if (!ClientClass) {
        if (window.retellInitAttempts === undefined) window.retellInitAttempts = 0;
        window.retellInitAttempts++;

        if (window.retellInitAttempts < 20) { // Try for 5 seconds
            setTimeout(initializeRetellAgent, 250);
        } else {
            console.error('❌ Retell SDK failed to load after multiple attempts.');
        }
        return;
    }

    console.log('✅ Retell SDK found. Initializing...');

    // Agent ID from Retell Dashboard
    const RETELL_AGENT_ID = 'agent_01629b287dbd3ece145e2244d8';

    if (RETELL_AGENT_ID && !RETELL_AGENT_ID.includes('REPLACE')) {
        window.retellAgent = new RetellVoiceAgent(RETELL_AGENT_ID, ClientClass);
        console.log('🚀 Retell Voice Agent Ready');
    }
}

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeRetellAgent);
} else {
    initializeRetellAgent();
}
