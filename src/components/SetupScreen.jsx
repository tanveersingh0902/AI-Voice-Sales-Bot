export default function SetupScreen() {
  const envVars = [
    {
      name: 'VITE_VAPI_PUBLIC_KEY',
      description: 'Public SDK key used by the web client to initiate voice calls.',
      source: 'Vapi Dashboard',
      url: 'https://vapi.ai',
    },
    {
      name: 'VITE_VAPI_PRIVATE_KEY',
      description: 'Private API key used securely to retrieve post-call audio recordings.',
      source: 'Vapi Dashboard',
      url: 'https://vapi.ai',
    },
    {
      name: 'VITE_VAPI_ASSISTANT_ID',
      description: 'The Assistant ID for your configured Alex sales representative bot.',
      source: 'Vapi Dashboard',
      url: 'https://vapi.ai',
    },
    {
      name: 'VITE_GEMINI_API_KEY',
      description: 'Google Gemini API key used to generate structured post-call summaries.',
      source: 'Google AI Studio',
      url: 'https://aistudio.google.com',
    },
  ];

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
            <h2 className="text-xl font-bold tracking-tight">Configure Environment Variables</h2>
            <p className="text-sm text-slate-400 mt-1">
              To launch the AI Sales Bot, please provide the required API credentials in your{' '}
              <code className="text-blue-400 bg-slate-900 px-1.5 py-0.5 rounded font-mono text-xs">.env</code> file.
            </p>
          </div>
        </div>

        {/* Variables List */}
        <div className="space-y-3">
          {envVars.map((v) => (
            <div key={v.name} className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <p className="font-mono text-sm font-semibold text-blue-300">{v.name}</p>
                <p className="text-xs text-slate-400">{v.description}</p>
              </div>
              <a
                href={v.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors shrink-0"
              >
                <span>{v.source}</span>
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            </div>
          ))}
        </div>

        {/* Example Config */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Example .env configuration</p>
          <pre className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
{`VITE_VAPI_PUBLIC_KEY=your_vapi_public_key
VITE_VAPI_PRIVATE_KEY=your_vapi_private_key
VITE_VAPI_ASSISTANT_ID=your_vapi_assistant_id
VITE_GEMINI_API_KEY=your_gemini_api_key`}
          </pre>
        </div>

        {/* External Portals Links */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <a
            href="https://vapi.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary bg-blue-600 hover:bg-blue-500 text-white flex-1 text-center text-sm flex items-center justify-center gap-2"
          >
            <span>Open Vapi Dashboard</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
          <a
            href="https://aistudio.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary bg-slate-800 hover:bg-slate-700 text-slate-200 flex-1 text-center text-sm flex items-center justify-center gap-2 border border-slate-700"
          >
            <span>Open Google AI Studio</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
