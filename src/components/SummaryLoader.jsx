export default function SummaryLoader() {
  return (
    <div className="glass-card p-8 flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-slate-700 border-t-blue-500 animate-spin" />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-slate-200">Generating Summary...</p>
        <p className="text-xs text-slate-500 mt-1">Analyzing conversation with AI</p>
      </div>
    </div>
  );
}
