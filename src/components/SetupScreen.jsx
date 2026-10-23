import { useState } from 'react';
import { getConfig, setConfig } from '../services/config';

export default function SetupScreen({ onComplete }) {
  const [publicKey, setPublicKey] = useState(() => getConfig('VAPI_PUBLIC_KEY'));
  const [assistantId, setAssistantId] = useState(() => getConfig('VAPI_ASSISTANT_ID'));
  const [geminiKey, setGeminiKey] = useState(() => getConfig('GEMINI_API_KEY'));
  const [privateKey, setPrivateKey] = useState(() => getConfig('VAPI_PRIVATE_KEY'));
  const [error, setError] = useState('');

  const hasExistingKey = Boolean(getConfig('VAPI_PUBLIC_KEY'));

  const handleSave = (e) => {
    e.preventDefault();
    if (!publicKey.trim()) {
      setError('VAPI_PUBLIC_KEY is required to start voice calls.');
      return;
    }

    setConfig('VAPI_PUBLIC_KEY', publicKey);
    setConfig('VAPI_ASSISTANT_ID', assistantId);
    setConfig('GEMINI_API_KEY', geminiKey);
    setConfig('VAPI_PRIVATE_KEY', privateKey);

    if (onComplete) {
      onComplete();
    }
  };

  const inputClass =
    'w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors';

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 sm:p-6">
      <div className="glass-card max-w-2xl w-full p-6 sm:p-8 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <span className="status-badge bg-blue-500/20 text-blue-400 border border-blue-500/30 mb-2">
              Setup &amp; Settings
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
              Configure Voice Agent
            </h2>
            <p className="text-sm text-slate-400 mt-1.5">
              Enter your credentials below to enable real-time voice calls, AI sales insights, and call audio recordings.
            </p>
          </div>
          {hasExistingKey && onComplete && (
            <button
              onClick={onComplete}
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors"
            >
              Back to App
            </button>
          )}
        </div>

        {/* Documentation / Guidance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
            <div className="font-semibold text-slate-200 flex items-center justify-between">
              <span>Vapi Credentials</span>
              <a
                href="https://vapi.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 font-sans underline"
              >
                vapi.ai &rarr;
              </a>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Retrieve your <strong>Public Key</strong> and <strong>Private API Key</strong> in the Vapi Dashboard under <em>Org &gt; API Keys</em>.
              Find your <strong>Assistant ID</strong> in <em>Assistants</em>.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
            <div className="font-semibold text-slate-200 flex items-center justify-between">
              <span>Gemini AI Studio</span>
              <a
                href="https://aistudio.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 font-sans underline"
              >
                aistudio.google.com &rarr;
              </a>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Create a free API key at Google AI Studio to power automatic post-call CRM summaries, sentiment analysis, and action items.
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm text-red-300 flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 font-mono">
                VITE_VAPI_PUBLIC_KEY <span className="text-red-400">*</span>
              </label>
              <span className="text-[11px] text-slate-500">Required</span>
            </div>
            <input
              type="text"
              value={publicKey}
              onChange={(e) => {
                setPublicKey(e.target.value);
                setError('');
              }}
              placeholder="e.g. a179e357-2fe6-44c1-..."
              className={inputClass}
              autoComplete="off"
              spellCheck="false"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 font-mono">
                VITE_VAPI_ASSISTANT_ID
              </label>
              <span className="text-[11px] text-slate-500">Optional (defaults to Alex agent)</span>
            </div>
            <input
              type="text"
              value={assistantId}
              onChange={(e) => setAssistantId(e.target.value)}
              placeholder="e.g. 32373e31-5732-4245-..."
              className={inputClass}
              autoComplete="off"
              spellCheck="false"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 font-mono">
                VITE_GEMINI_API_KEY
              </label>
              <span className="text-[11px] text-slate-500">Required for summaries</span>
            </div>
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="e.g. AIzaSy..."
              className={inputClass}
              autoComplete="off"
              spellCheck="false"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 font-mono">
                VITE_VAPI_PRIVATE_KEY
              </label>
              <span className="text-[11px] text-slate-500">Required for audio recording</span>
            </div>
            <input
              type="password"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              placeholder="e.g. a495046c-bfea-4115-..."
              className={inputClass}
              autoComplete="off"
              spellCheck="false"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="btn-primary bg-blue-600 hover:bg-blue-500 text-white w-full text-sm py-2.5 rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/30"
            >
              Save Credentials &amp; Launch App
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
