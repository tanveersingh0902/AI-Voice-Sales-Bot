import { useState } from 'react';
import { getConfig, setConfig } from '../services/config';

export default function SetupScreen({ onComplete }) {
  const [publicKey, setPublicKey] = useState(() => getConfig('VAPI_PUBLIC_KEY'));
  const [assistantId, setAssistantId] = useState(() => getConfig('VAPI_ASSISTANT_ID'));
  const [geminiKey, setGeminiKey] = useState(() => getConfig('GEMINI_API_KEY'));
  const [privateKey, setPrivateKey] = useState(() => getConfig('VAPI_PRIVATE_KEY'));
  const [error, setError] = useState('');

  // Visibility toggles for masking keys (hidden by default)
  const [showKey, setShowKey] = useState({
    public: false,
    assistant: false,
    gemini: false,
    private: false,
  });

  const toggleVisibility = (field) => {
    setShowKey((prev) => ({ ...prev, [field]: !prev[field] }));
  };

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

  const handleClearStored = () => {
    setConfig('VAPI_PUBLIC_KEY', '');
    setConfig('VAPI_ASSISTANT_ID', '');
    setConfig('GEMINI_API_KEY', '');
    setConfig('VAPI_PRIVATE_KEY', '');
    setPublicKey('');
    setAssistantId('');
    setGeminiKey('');
    setPrivateKey('');
    setError('Stored browser credentials cleared.');
  };

  const inputClass =
    'w-full bg-slate-900 border border-slate-700 rounded-xl pl-3.5 pr-11 py-2.5 text-sm font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors';

  const renderEyeIcon = (isVisible) =>
    isVisible ? (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
        />
      </svg>
    ) : (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    );

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
              Enter your credentials below. All keys are hidden and masked for privacy by default.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {hasExistingKey && onComplete && (
              <button
                type="button"
                onClick={onComplete}
                className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors"
              >
                Back to App
              </button>
            )}
          </div>
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
          <div className={`border rounded-xl p-3 text-sm flex items-center gap-2 ${
            error.includes('cleared')
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}>
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          {/* VAPI_PUBLIC_KEY */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 font-mono">
                VITE_VAPI_PUBLIC_KEY <span className="text-red-400">*</span>
              </label>
              <span className="text-[11px] text-slate-500">Required</span>
            </div>
            <div className="relative">
              <input
                type={showKey.public ? 'text' : 'password'}
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
              <button
                type="button"
                onClick={() => toggleVisibility('public')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 transition-colors"
                title={showKey.public ? 'Hide Key' : 'Show Key'}
                aria-label={showKey.public ? 'Hide Key' : 'Show Key'}
              >
                {renderEyeIcon(showKey.public)}
              </button>
            </div>
          </div>

          {/* VAPI_ASSISTANT_ID */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 font-mono">
                VITE_VAPI_ASSISTANT_ID
              </label>
              <span className="text-[11px] text-slate-500">Optional (defaults to Alex agent)</span>
            </div>
            <div className="relative">
              <input
                type={showKey.assistant ? 'text' : 'password'}
                value={assistantId}
                onChange={(e) => setAssistantId(e.target.value)}
                placeholder="e.g. 32373e31-5732-4245-..."
                className={inputClass}
                autoComplete="off"
                spellCheck="false"
              />
              <button
                type="button"
                onClick={() => toggleVisibility('assistant')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 transition-colors"
                title={showKey.assistant ? 'Hide ID' : 'Show ID'}
                aria-label={showKey.assistant ? 'Hide ID' : 'Show ID'}
              >
                {renderEyeIcon(showKey.assistant)}
              </button>
            </div>
          </div>

          {/* GEMINI_API_KEY */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 font-mono">
                VITE_GEMINI_API_KEY
              </label>
              <span className="text-[11px] text-slate-500">Required for summaries</span>
            </div>
            <div className="relative">
              <input
                type={showKey.gemini ? 'text' : 'password'}
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="e.g. AIzaSy..."
                className={inputClass}
                autoComplete="off"
                spellCheck="false"
              />
              <button
                type="button"
                onClick={() => toggleVisibility('gemini')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 transition-colors"
                title={showKey.gemini ? 'Hide Key' : 'Show Key'}
                aria-label={showKey.gemini ? 'Hide Key' : 'Show Key'}
              >
                {renderEyeIcon(showKey.gemini)}
              </button>
            </div>
          </div>

          {/* VAPI_PRIVATE_KEY */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 font-mono">
                VITE_VAPI_PRIVATE_KEY
              </label>
              <span className="text-[11px] text-slate-500">Required for audio recording</span>
            </div>
            <div className="relative">
              <input
                type={showKey.private ? 'text' : 'password'}
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                placeholder="e.g. a495046c-bfea-4115-..."
                className={inputClass}
                autoComplete="off"
                spellCheck="false"
              />
              <button
                type="button"
                onClick={() => toggleVisibility('private')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 transition-colors"
                title={showKey.private ? 'Hide Key' : 'Show Key'}
                aria-label={showKey.private ? 'Hide Key' : 'Show Key'}
              >
                {renderEyeIcon(showKey.private)}
              </button>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="btn-primary flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm py-2.5 rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/30"
            >
              Save Credentials &amp; Launch App
            </button>
            <button
              type="button"
              onClick={handleClearStored}
              className="px-4 py-2.5 text-xs text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-500/40 rounded-xl transition-colors"
            >
              Clear Stored Keys
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
