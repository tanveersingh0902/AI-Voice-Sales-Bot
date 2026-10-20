export default function SalesBadge({ status }) {
  const config = {
    Converted: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    Interested: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Follow-up Required': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'Not Interested': 'bg-red-500/20 text-red-400 border-red-500/30',
    'Demo Requested': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'No Response': 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  };

  const color = config[status] || config['No Response'];

  return (
    <span className={`status-badge border ${color}`}>
      {status}
    </span>
  );
}
