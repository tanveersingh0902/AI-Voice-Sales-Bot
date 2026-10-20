export default function BotAvatar({ isSpeaking, status }) {
  const isActive = status === 'live';
  const isConnecting = status === 'connecting';

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Avatar with pulse rings */}
      <div className="relative flex items-center justify-center">
        {/* Outer pulse rings */}
        {isSpeaking && (
          <>
            <div className="absolute w-32 h-32 rounded-full bg-blue-500/10 animate-pulse-ring" />
            <div className="absolute w-40 h-40 rounded-full bg-blue-500/5 animate-pulse-ring" style={{ animationDelay: '0.5s' }} />
          </>
        )}

        {/* Main avatar circle */}
        <div
          className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 ${
            isActive
              ? 'bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/25'
              : isConnecting
              ? 'bg-gradient-to-br from-yellow-500 to-orange-400 animate-pulse'
              : 'bg-gradient-to-br from-slate-600 to-slate-700'
          } ${isSpeaking ? 'scale-110 animate-float' : ''}`}
        >
          {/* Bot icon */}
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
            />
          </svg>
        </div>
      </div>

      {/* Status text */}
      <div className="mt-4 text-center text-sm text-slate-400 font-medium">
        {isConnecting ? 'Connecting...' : isActive ? (isSpeaking ? 'Alex is speaking...' : 'Listening...') : ''}
      </div>
    </div>
  );
}
