import { useState } from 'react';
import { getPublic } from '../services/publicConfig';

// Only shown when VAPI_PUBLIC_KEY is missing (e.g. local dev without .env).
export default function SetupScreen({ onComplete }) {
  const [publicKey, setPublicKey] = useState(getPublic('VAPI_PUBLIC_KEY'));
  const [assistantId, setAssistantId] = useState(getPublic('VAPI_ASSISTANT_ID'));
  const [error, setError] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    if (!publicKey.trim()) {
      setError('VAPI_PUBLIC_KEY is required to start voice calls.');
      return;
    }
    localStorage.setItem('VAPI_PUBLIC_KEY', publicKey.trim());
    if (assistantId.trim()) localStorage.setItem('VAPI_ASSISTANT_ID', assistantId.trim());
    else localStorage.removeItem('VAPI_ASSISTANT_ID');
    onComplete();
  };

  const inputClass =
    'w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500';

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 sm:p-6">
      <div className="glass-card max-w-xl w-full p-6 sm:p-8 space-y-5">
        <div>
          <span className="status-badge bg-blue-500/20 text-blue-400 border border-blue-500/30 mb-2">Setup Required</span>
          <h2 className="text-xl font-bold tracking-tight">Configure Vapi</h2>
          <p className="text-sm text-slate-400 mt-1">
            On Vercel, set <code>VAPI_PUBLIC_KEY</code> and <code>VAPI_ASSISTANT_ID</code>, plus the
            server-only <code>VAPI_PRIVATE_KEY</code> and <code>GEMINI_API_KEY</code>, then redeploy.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm text-red-300">{error}</div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 font-mono">
              VAPI_PUBLIC_KEY <span className="text-red-400">*</span>
            </label>
            <input type="text" value={publicKey} onChange={(e) => { setPublicKey(e.target.value); setError(''); }} className={inputClass} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 font-mono">VAPI_ASSISTANT_ID (optional)</label>
            <input type="text" value={assistantId} onChange={(e) => setAssistantId(e.target.value)} className={inputClass} />
          </div>
          <button type="submit" className="btn-primary bg-blue-600 hover:bg-blue-500 text-white w-full text-sm">
            Save & Launch App
          </button>
        </form>
      </div>
    </div>
  );
}
