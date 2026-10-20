import SalesBadge from './SalesBadge';
import AudioPlayer from './AudioPlayer';

export default function SummaryCard({ summary, recordingUrl }) {
  if (!summary) return null;

  return (
    <div className="glass-card p-6 space-y-5 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{summary.customerName || 'Unknown Customer'}</h3>
          <p className="text-sm text-slate-400">
            {new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
          </p>
        </div>
        <SalesBadge status={summary.salesStatus} />
      </div>

      {/* Summary */}
      <div>
        <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Summary</h4>
        <p className="text-slate-300 text-sm leading-relaxed">{summary.summary}</p>
      </div>

      {/* Requirements */}
      {summary.customerRequirements?.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">
            Customer Requirements
          </h4>
          <ul className="space-y-1">
            {summary.customerRequirements.map((req, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-blue-400 mt-0.5">•</span>
                {req}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Objections */}
      {summary.objections?.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-2">
            Objections Raised
          </h4>
          <ul className="space-y-1">
            {summary.objections.map((obj, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-amber-400 mt-0.5">•</span>
                {obj}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Next Steps */}
      {summary.nextSteps?.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-2">
            Recommended Next Steps
          </h4>
          <ul className="space-y-1">
            {summary.nextSteps.map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-emerald-400 mt-0.5">•</span>
                {step}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Audio Player */}
      <div>
        <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Call Recording
        </h4>
        <AudioPlayer src={recordingUrl} />
      </div>
    </div>
  );
}
