
import React, { useState, useEffect } from 'react';
import { CallStatus } from './types';
import CallInterface from './components/CallInterface';

const App: React.FC = () => {
  const [status, setStatus] = useState<CallStatus>(CallStatus.IDLE);
  const [session, setSession] = useState<any>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);

  useEffect(() => {
    const checkApiKey = async () => {
      // @ts-ignore
      if (window.aistudio?.hasSelectedApiKey) {
        // @ts-ignore
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(selected);
      } else {
        // Fallback for direct deployment if needed
        setHasApiKey(true);
      }
    };
    checkApiKey();
  }, []);

  const handleSelectKey = async () => {
    // @ts-ignore
    if (window.aistudio?.openSelectKey) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      // Assume success as per instructions to avoid race condition
      setHasApiKey(true);
    }
  };

  const handleEndCall = () => {
    if (session) {
      try {
        session.close();
      } catch (e) {
        console.warn("Session already closed");
      }
    }
    setStatus(CallStatus.IDLE);
    setSession(null);
  };

  if (hasApiKey === false) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="glass-card p-12 rounded-[3rem] border border-white/5 max-w-md w-full shadow-[0_0_80px_rgba(0,0,0,0.5)]">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-lg transform -rotate-6">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-4">Launch Megan</h2>
          <p className="text-white/40 mb-10 text-sm leading-relaxed font-medium">
            To try our AI Voice Agent, please connect your Gemini API Key. Use a key from a paid project to enable video and voice features.
          </p>
          <div className="space-y-4">
            <button
              onClick={handleSelectKey}
              className="w-full bg-white text-indigo-950 font-bold py-5 rounded-2xl transition-all shadow-xl active:scale-95 hover:bg-white/90"
            >
              Select Paid API Key
            </button>
            <a
              href="https://ai.google.dev/gemini-api/docs/billing"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-[10px] text-white/20 uppercase tracking-[0.2em] hover:text-white/40 transition-colors"
            >
              Billing Documentation &rarr;
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center bg-transparent">
      <CallInterface
        status={status}
        setStatus={setStatus}
        onEnd={handleEndCall}
        setSession={setSession}
      />
    </div>
  );
};

export default App;
