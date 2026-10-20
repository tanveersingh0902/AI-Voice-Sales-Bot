
export default function ConsentBanner({ onAccept, onDecline }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card p-6 max-w-md w-full space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold">Recording Consent</h3>
        </div>

        <p className="text-slate-300 text-sm leading-relaxed">
          This call may be recorded for quality and training purposes. By proceeding,
          you consent to the recording of this conversation.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onAccept}
            className="btn-primary bg-emerald-600 hover:bg-emerald-500 text-white flex-1"
          >
            I Agree — Start Call
          </button>
          <button
            onClick={onDecline}
            className="btn-primary bg-slate-700 hover:bg-slate-600 text-slate-300 flex-1"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
