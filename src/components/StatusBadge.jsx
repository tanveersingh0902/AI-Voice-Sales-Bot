export default function StatusBadge({ status }) {
  const config = {
    idle: { label: 'Idle', color: 'bg-slate-600 text-slate-200' },
    connecting: { label: 'Connecting', color: 'bg-yellow-500/20 text-yellow-400' },
    live: { label: 'Live', color: 'bg-emerald-500/20 text-emerald-400' },
    ended: { label: 'Ended', color: 'bg-red-500/20 text-red-400' },
  };

  const { label, color } = config[status] || config.idle;

  return (
    <span className={`status-badge ${color}`}>
      {status === 'live' && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
      )}
      {status === 'connecting' && (
        <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {label}
    </span>
  );
}
