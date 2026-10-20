export default function CallControls({ status, onStart, onEnd, timerFormatted }) {
  const isIdle = status === 'idle' || status === 'ended';
  const isLive = status === 'live';
  const isConnecting = status === 'connecting';

  return (
    <div className="flex items-center justify-center gap-4 p-4 border-t border-slate-700/50">
      {/* Timer */}
      {(isLive || isConnecting) && (
        <div className="flex items-center gap-2 text-slate-400 font-mono text-lg">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {timerFormatted}
        </div>
      )}

      {/* Start Call */}
      {isIdle && (
        <button
          onClick={onStart}
          className="btn-primary bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
          </svg>
          Start Call
        </button>
      )}

      {/* End Call */}
      {(isLive || isConnecting) && (
        <button
          onClick={onEnd}
          className="btn-primary bg-red-600 hover:bg-red-500 text-white flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 3.75L18 6m0 0l2.25 2.25M18 6l2.25-2.25M18 6l-2.25 2.25m1.5 13.5c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 016.75 2.25H8.25c.54 0 1.02.351 1.152.852l1.106 4.423c.11.44-.055.902-.417 1.173l-1.293.97a1.062 1.062 0 00-.38 1.21 12.035 12.035 0 007.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 011.173-.417l4.423 1.106c.5.125.852.636.852 1.152v2.25A2.25 2.25 0 0121.75 21.75h-2.25z" />
          </svg>
          End Call
        </button>
      )}
    </div>
  );
}
