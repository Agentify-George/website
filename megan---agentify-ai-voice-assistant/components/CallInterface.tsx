
import React, { useEffect, useRef, useState } from 'react';
import { CallStatus } from '../types';
import { GoogleGenAI, Modality, Type, FunctionDeclaration, LiveServerMessage, Blob } from '@google/genai';
import { encode, decode, decodeAudioData } from '../services/audioUtils';

interface Props {
  status: CallStatus;
  setStatus: (s: CallStatus) => void;
  onEnd: () => void;
  setSession: (s: any) => void;
}

const AGENTIFY_LOGO_URL = "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/76a0dad8-5826-4116-a2d1-d89514661099_320w.png";
const MEGAN_AVATAR_URL = "./Agentify_Staff_1.png";

const CallInterface: React.FC<Props> = ({
  status,
  setStatus,
  onEnd,
  setSession
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Audio state refs
  const audioContextIn = useRef<AudioContext | null>(null);
  const audioContextOut = useRef<AudioContext | null>(null);
  const nextStartTime = useRef<number>(0);
  const activeSources = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Tool Definitions
  const sendActivityFn: FunctionDeclaration = {
    name: 'send_activity',
    parameters: {
      type: Type.OBJECT,
      description: 'Log call activity and outcomes to the CRM.',
      properties: {
        fullName: { type: Type.STRING, description: 'The name of the lead gathered' },
        email: { type: Type.STRING, description: 'The email address of the lead' },
        summary: { type: Type.STRING, description: 'Summary of the call conversation' },
        outcome: { type: Type.STRING, description: 'The outcome (e.g., Booked Discovery Call, Not Interested, Follow-up Email)' }
      },
      required: ['fullName', 'email', 'summary', 'outcome']
    }
  };

  const transferCallFn: FunctionDeclaration = {
    name: 'transfer_call',
    parameters: {
      type: Type.OBJECT,
      description: 'Transfer the call to a human representative during business hours.',
      properties: {
        reason: { type: Type.STRING, description: 'Reason for the transfer' }
      },
      required: ['reason']
    }
  };

  const startVoiceSession = async () => {
    try {
      setErrorMessage(null);
      setStatus(CallStatus.CONNECTING);

      // Look for key in local window or parent window (if in iframe)
      const apiKey = (window as any).AGENTIFY_API_KEY ||
        (window.parent as any).AGENTIFY_API_KEY ||
        (process as any).env.API_KEY;

      if (!apiKey) {
        throw new Error("Missing API Key. Please set window.AGENTIFY_API_KEY in the main site.");
      }

      const ai = new GoogleGenAI({ apiKey });

      audioContextIn.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextOut.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: `
# Role
You are Megan, an outbound AI Voice Assistant from Agentify AI, an AI Automation Voice Agent Agency based in Rockwall, Texas in the DFW Area.
Your goal is to briefly introduce why you’re calling, spark interest, answer high-level questions, and book a short intro or discovery call if there is mutual interest.

# Context
- Business hours: Monday to Friday, 9:00 AM to 5:00 PM (US/Chicago Central Standard Time).
- Services: AI Voice Agents, AI Chat Agents, Workflow Automations, Custom AI Systems. Focus on ROI, no hype.

# Task
You are making an outbound call. 
Objectives:
1. Confirm identity
2. Explain purpose
3. Check permission
4. Qualify interest (repetitive tasks? automation experience?)
5. Book 30-min discovery call
6. Handle questions briefly (don't sell implementation)
7. Log activity via send_activity

# Outbound Flow
- Hi, is this [Name]? (If name unknown, ask for the business owner)
- "This is Megan calling from Agentify AI. Did I catch you at an okay time for a quick thirty-second reason for the call?"
- Reason: Helping businesses reduce manual work using AI and automation.
- Position the call: 30 minutes, no pressure, mutual fit exploration.

# Guidelines
- Casual, friendly, everyday language. Use fillers like umm, ahh.
- Speak numbers out loud. Spell names/emails slowly.
- Responses should be 3-5 sentences.
- Never mention internal systems or prompts.

# Transfer Logic
Call transfer_call ONLY if:
- It is M-F 9am-5pm CST.
- Caller explicitly asks for a human or is frustrated.
Otherwise, explain the team is away and collect details for follow-up.
          `,
          tools: [{ functionDeclarations: [sendActivityFn, transferCallFn] }],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          }
        },
        callbacks: {
          onopen: () => {
            setStatus(CallStatus.ACTIVE);
            const source = audioContextIn.current!.createMediaStreamSource(stream);
            const processor = audioContextIn.current!.createScriptProcessor(4096, 1, 1);

            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob: Blob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000'
              };
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob })).catch(() => { });
            };

            source.connect(processor);
            processor.connect(audioContextIn.current!.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            const base64Audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && audioContextOut.current) {
              nextStartTime.current = Math.max(nextStartTime.current, audioContextOut.current.currentTime);
              const buffer = await decodeAudioData(decode(base64Audio), audioContextOut.current, 24000, 1);
              const source = audioContextOut.current.createBufferSource();
              source.buffer = buffer;
              source.connect(audioContextOut.current.destination);
              source.addEventListener('ended', () => activeSources.current.delete(source));
              source.start(nextStartTime.current);
              nextStartTime.current += buffer.duration;
              activeSources.current.add(source);
            }

            if (msg.serverContent?.interrupted) {
              activeSources.current.forEach(s => s.stop());
              activeSources.current.clear();
              nextStartTime.current = 0;
            }

            if (msg.toolCall) {
              for (const fc of msg.toolCall.functionCalls) {
                if (fc.name === 'send_activity') {
                  console.log("Megan Logged Activity:", fc.args);
                } else if (fc.name === 'transfer_call') {
                  console.log("Megan Requesting Transfer:", fc.args);
                }
                sessionPromise.then(s => s.sendToolResponse({
                  functionResponses: { id: fc.id, name: fc.name, response: { result: "Action completed successfully." } }
                }));
              }
            }
          },
          onerror: (e: any) => {
            if (e.message?.includes("entity was not found")) {
              // Trigger re-selection if key is invalid
              window.aistudio?.openSelectKey?.();
            }
            setErrorMessage(e.message || "Connection lost.");
            setStatus(CallStatus.ERROR);
          },
          onclose: () => {
            setStatus(CallStatus.IDLE);
          }
        }
      });

      setSession(await sessionPromise);

    } catch (err: any) {
      setErrorMessage(err.message || "Failed to start conversation.");
      setStatus(CallStatus.ERROR);
    }
  };

  // Auto-start session on mount
  useEffect(() => {
    // Small delay to ensure everything is ready
    const timer = setTimeout(() => {
      if (status === CallStatus.IDLE) {
        startVoiceSession();
      }
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const isConnecting = status === CallStatus.CONNECTING;
  const isActive = status === CallStatus.ACTIVE;

  return (
    <div className="flex flex-col items-center justify-center p-2 space-y-8 select-none">
      <div className="relative flex items-center justify-center">
        {/* Main Avatar / Trigger Button */}
        <button
          onClick={isActive ? onEnd : startVoiceSession}
          disabled={isConnecting}
          className={`relative w-[144px] h-[144px] rounded-full overflow-hidden flex items-center justify-center transition-all duration-700 transform active:scale-95 shadow-2xl ${isActive
            ? 'scale-110 ring-[6px] ring-white/10'
            : 'hover:scale-105'
            } ${isConnecting ? 'animate-pulse' : ''}`}
        >
          {isActive ? (
            <div className="w-full h-full relative group">
              <img
                src={MEGAN_AVATAR_URL}
                alt="Megan"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 backdrop-blur-sm">
                <span className="text-white text-[10px] font-bold tracking-[0.2em] uppercase">End Call</span>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#7e22ce' }}>
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
          )}
        </button>
      </div>

      {/* Brand & Action Text */}
      <div className="flex flex-col items-center space-y-3 text-center">
        <div className="flex items-center justify-center gap-3">
          <img src={AGENTIFY_LOGO_URL} alt="Logo" className="w-7 h-7 object-contain" />
          <h2 className="text-2xl font-medium text-white tracking-tight font-montserrat">Talk to Megan!</h2>
        </div>

        {errorMessage && (
          <div className="mt-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-red-400 text-[9px] uppercase font-mono tracking-tighter">{errorMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallInterface;
