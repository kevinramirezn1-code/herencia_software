import { TrendingUp, TrendingDown } from "lucide-react";

export function KpiCard({ label, value, sub, trend, icon: Icon, color }) {
  return (
    <div className="bg-card rounded-xl p-5 border border-border shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
          <Icon size={18} />
        </div>
        {trend && (
          <span
            className={`flex items-center gap-0.5 text-xs font-medium ${
              trend.up ? "text-emerald-600" : "text-red-500"
            }`}
          >
            {trend.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend.val}
          </span>
        )}
      </div>
      <p className="mt-3 text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
      <p className="mt-1 text-2xl font-bold text-foreground leading-none">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}
