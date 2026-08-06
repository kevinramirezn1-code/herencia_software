import { Construction } from "lucide-react";

export function ComingSoon({ label }) {
  return (
    <div className="p-6">
      <div className="bg-card border border-border rounded-xl p-12 flex flex-col items-center justify-center text-center gap-3">
        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
          <Construction size={22} />
        </div>
        <h2 className="text-base font-semibold text-foreground">{label}</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          Este módulo todavía no está construido. Lo iremos armando paso a paso.
        </p>
      </div>
    </div>
  );
}
