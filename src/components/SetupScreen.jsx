import { useState } from 'react';

export default function SetupScreen({ onComplete }) {
  const [keys, setKeys] = useState(() => ({
    VITE_VAPI_PUBLIC_KEY: import.meta.env.VITE_VAPI_PUBLIC_KEY || (typeof window !== 'undefined' ? localStorage.getItem('VITE_VAPI_PUBLIC_KEY') || '' : ''),
    VITE_VAPI_PRIVATE_KEY: import.meta.env.VITE_VAPI_PRIVATE_KEY || (typeof window !== 'undefined' ? localStorage.getItem('VITE_VAPI_PRIVATE_KEY') || '' : ''),
    VITE_VAPI_ASSISTANT_ID: import.meta.env.VITE_VAPI_ASSISTANT_ID || (typeof window !== 'undefined' ? localStorage.getItem('VITE_VAPI_ASSISTANT_ID') || '' : ''),
    VITE_GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || (typeof window !== 'undefined' ? localStorage.getItem('VITE_GEMINI_API_KEY') || '' : ''),
  }));

  const [error, setError] = useState('');
  const [showVercelGuide, setShowVercelGuide] = useState(false);

  const handleChange = (name, value) => {
    setKeys((prev) => ({ ...prev, [name]: value.trim() }));
    setError('');
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!keys.VITE_VAPI_PUBLIC_KEY) {
      setError('VITE_VAPI_PUBLIC_KEY is required to start voice calls.');
      return;
    }

    // Save to localStorage so it works immediately in the browser
    if (typeof window !== 'undefined') {
      Object.entries(keys).forEach(([key, val]) => {
        if (val) {
          localStorage.setItem(key, val);
        } else {
          localStorage.removeItem(key);
        }
      });
    }

    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 sm:p-6">
      <div className="glass-card max-w-2xl w-full p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.27.1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.15.894c-.09.542-.559.94-1.109.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.27-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.11v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <span className="status-badge bg-blue-500/20 text-blue-400 border border-blue-500/30 mb-2">
              Setup Required
            </span>
            <h2 className="text-xl font-bold tracking-tight">Configure API Credentials</h2>
            <p className="text-sm text-slate-400 mt-1">
              Enter your credentials below to launch immediately, or configure them permanently in Vercel.
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 font-mono">
                VITE_VAPI_PUBLIC_KEY <span className="text-red-400">*</span>
              </label>
              <a
                href="https://vapi.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
              >
                Get from Vapi Dashboard
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
            <input
              type="text"
              value={keys.VITE_VAPI_PUBLIC_KEY}
              onChange={(e) => handleChange('VITE_VAPI_PUBLIC_KEY', e.target.value)}
              placeholder="e.g. a179e357-..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 font-mono">
                VITE_VAPI_PRIVATE_KEY
              </label>
              <span className="text-[11px] text-slate-500">For audio recordings (optional)</span>
            </div>
            <input
              type="password"
              value={keys.VITE_VAPI_PRIVATE_KEY}
              onChange={(e) => handleChange('VITE_VAPI_PRIVATE_KEY', e.target.value)}
              placeholder="e.g. a495046c-..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 font-mono">
                VITE_VAPI_ASSISTANT_ID
              </label>
              <span className="text-[11px] text-slate-500">Optional (uses built-in Alex if blank)</span>
            </div>
            <input
              type="text"
              value={keys.VITE_VAPI_ASSISTANT_ID}
              onChange={(e) => handleChange('VITE_VAPI_ASSISTANT_ID', e.target.value)}
              placeholder="e.g. 32373e31-..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 font-mono">
                VITE_GEMINI_API_KEY
              </label>
              <a
                href="https://aistudio.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
              >
                Get from Google AI Studio
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
            <input
              type="password"
              value={keys.VITE_GEMINI_API_KEY}
              onChange={(e) => handleChange('VITE_GEMINI_API_KEY', e.target.value)}
              placeholder="e.g. AIzaSy..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="btn-primary bg-blue-600 hover:bg-blue-500 text-white flex-1 text-center text-sm flex items-center justify-center gap-2"
            >
              <span>Save & Launch App</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setShowVercelGuide(!showVercelGuide)}
              className="btn-primary bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm border border-slate-700 flex items-center justify-center gap-1.5"
            >
              <span>{showVercelGuide ? 'Hide Vercel Guide' : 'Vercel Deployment Guide'}</span>
            </button>
          </div>
        </form>

        {/* Collapsible Vercel Guide */}
        {showVercelGuide && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 space-y-3">
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">How to configure on Vercel:</h4>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-400">
              <li>Open your project settings on <strong className="text-slate-200">vercel.com</strong></li>
              <li>Go to <strong className="text-slate-200">Environment Variables</strong></li>
              <li>Add the 4 variables above (check Production, Preview, Development)</li>
              <li>Go to <strong className="text-slate-200">Deployments</strong> &gt; click &apos;...&apos; on latest deployment &gt; select <strong className="text-slate-200">Redeploy</strong> (uncheck build cache)</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
