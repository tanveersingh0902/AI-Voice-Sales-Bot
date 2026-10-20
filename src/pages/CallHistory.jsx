import { useState } from 'react';
import SalesBadge from '../components/SalesBadge';
import AudioPlayer from '../components/AudioPlayer';

export default function CallHistory({ history, onClear }) {
  const [expandedId, setExpandedId] = useState(null);

  if (history.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-slate-800 flex items-center justify-center">
            <svg className="w-10 h-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-300">No Call History</h3>
            <p className="text-sm text-slate-500 mt-1">Completed calls will appear here with their summaries and recordings.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          Call History
          <span className="ml-2 text-sm text-slate-500 font-normal">({history.length} calls)</span>
        </h2>
        <button
          onClick={onClear}
          className="text-xs text-slate-500 hover:text-red-400 transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Call list */}
      {history.map((call) => {
        const isExpanded = expandedId === call.id;
        return (
          <div key={call.id} className="glass-card overflow-hidden">
            {/* Row header */}
            <button
              onClick={() => setExpandedId(isExpanded ? null : call.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-700/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="text-left">
                  <p className="text-sm font-medium">
                    {call.summary?.customerName || call.transcript?.[0]?.text?.slice(0, 30) || 'Unknown Customer'}
                  </p>
                  <p className="text-xs text-slate-500">{call.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-mono">{call.duration}</span>
                <SalesBadge status={call.salesStatus || 'No Response'} />
                <svg
                  className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </button>

            {/* Expanded content */}
            {isExpanded && (
              <div className="border-t border-slate-700/50 p-4 space-y-4">
                {/* Summary */}
                {call.summary && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Summary</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">{call.summary.summary}</p>
                  </div>
                )}

                {/* Requirements */}
                {call.summary?.customerRequirements?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">Requirements</h4>
                    <ul className="space-y-1">
                      {call.summary.customerRequirements.map((r, i) => (
                        <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                          <span className="text-blue-400">•</span>{r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Objections */}
                {call.summary?.objections?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-2">Objections</h4>
                    <ul className="space-y-1">
                      {call.summary.objections.map((o, i) => (
                        <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                          <span className="text-amber-400">•</span>{o}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Next Steps */}
                {call.summary?.nextSteps?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-2">Next Steps</h4>
                    <ul className="space-y-1">
                      {call.summary.nextSteps.map((s, i) => (
                        <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                          <span className="text-emerald-400">•</span>{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Transcript */}
                {call.transcript?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Transcript</h4>
                    <div className="bg-slate-900/50 rounded-xl p-3 max-h-60 overflow-y-auto space-y-2">
                      {call.transcript.map((msg, i) => (
                        <div key={i} className={`text-sm ${msg.role === 'user' ? 'text-blue-300' : 'text-slate-400'}`}>
                          <span className="font-semibold text-xs uppercase opacity-60">
                            {msg.role === 'user' ? 'Customer' : 'Alex'}:
                          </span>{' '}
                          {msg.text}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Audio */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Recording</h4>
                  <AudioPlayer src={call.recordingUrl} />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
