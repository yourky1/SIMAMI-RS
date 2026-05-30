export default function StatCard({ title, value, subtitle, icon: Icon, color = 'primary', trend }) {
  const colors = {
    primary: { bg: 'bg-primary-50', icon: 'text-primary-600', border: 'border-primary-100' },
    blue:    { bg: 'bg-blue-50',    icon: 'text-blue-600',    border: 'border-blue-100' },
    amber:   { bg: 'bg-amber-50',   icon: 'text-amber-600',   border: 'border-amber-100' },
    red:     { bg: 'bg-red-50',     icon: 'text-red-600',     border: 'border-red-100' },
    slate:   { bg: 'bg-slate-100',  icon: 'text-slate-600',   border: 'border-slate-200' },
  };
  const c = colors[color] || colors.primary;

  return (
    <div className={`card p-5 border ${c.border}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-slate-800 mt-1.5 tabular-nums">{value}</p>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`w-10 h-10 rounded-lg ${c.bg} flex items-center justify-center flex-shrink-0 ml-3`}>
            <Icon className={`w-5 h-5 ${c.icon}`} strokeWidth={1.75} />
          </div>
        )}
      </div>
    </div>
  );
}
