import {
  Package, TrendingUp, TrendingDown, Wallet, Users, CheckCircle, XCircle,
  DollarSign, ShoppingCart, ArrowUpCircle, ArrowDownCircle, Truck,
  AlertTriangle, ArrowRight,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { KpiCard } from "../components/dashboard/KpiCard";

// ─────────────────────────────────────────────────────────────────────────
// DATOS DE EJEMPLO (mock). Reemplaza esto por llamadas reales a tu backend,
// por ejemplo con axiosClient.get("/dashboard/resumen") dentro de un
// useEffect, guardando el resultado en useState.
// ─────────────────────────────────────────────────────────────────────────
const salesData = [
  { mes: "Feb", ventas: 3800000, compras: 2400000 },
  { mes: "Mar", ventas: 5100000, compras: 3200000 },
  { mes: "Abr", ventas: 4700000, compras: 2900000 },
  { mes: "May", ventas: 6200000, compras: 3800000 },
  { mes: "Jun", ventas: 5800000, compras: 3500000 },
  { mes: "Jul", ventas: 6400000, compras: 3900000 },
];

const topProducts = [
  { nombre: "Producto A", ventas: 1240 },
  { nombre: "Producto B", ventas: 980 },
  { nombre: "Producto C", ventas: 820 },
  { nombre: "Producto D", ventas: 650 },
  { nombre: "Producto E", ventas: 540 },
];

const categoriaData = [
  { name: "Categoría 1", value: 35 },
  { name: "Categoría 2", value: 22 },
  { name: "Categoría 3", value: 20 },
  { name: "Categoría 4", value: 13 },
  { name: "Otros", value: 10 },
];

const CHART_COLORS = ["#2563EB", "#22C55E", "#F59E0B", "#0EA5E9", "#8B5CF6"];

const alertasInventario = [
  { id: "P001", nombre: "Producto con bajo stock", cantidad: 3, estado: "Bajo Stock" },
  { id: "P002", nombre: "Producto agotado", cantidad: 0, estado: "Agotado" },
];

const ultimasVentas = [
  { id: "V-0001", cliente: "Cliente Demo A", fecha: "31/07/2026", items: 4, total: 640000, estado: "Pagada" },
  { id: "V-0002", cliente: "Cliente Demo B", fecha: "30/07/2026", items: 8, total: 1180000, estado: "Pendiente" },
];

const fmt = (n) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

const StatusBadge = ({ status }) => {
  const map = {
    Disponible: "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Bajo Stock": "bg-amber-50 text-amber-700 border-amber-200",
    Agotado: "bg-red-50 text-red-600 border-red-200",
    Pagada: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Pendiente: "bg-amber-50 text-amber-700 border-amber-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
        map[status] ?? "bg-gray-100 text-gray-600 border-gray-200"
      }`}
    >
      {status}
    </span>
  );
};

export function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard label="Inventario Total" value="$48.2M" sub="248 referencias" trend={{ val: "+4.2%", up: true }} icon={Package} color="bg-blue-50 text-blue-600" />
        <KpiCard label="Disponibles" value="201" sub="productos en stock" trend={{ val: "+2.1%", up: true }} icon={CheckCircle} color="bg-emerald-50 text-emerald-600" />
        <KpiCard label="Agotados" value="12" sub="sin stock" trend={{ val: "-1", up: false }} icon={XCircle} color="bg-red-50 text-red-500" />
        <KpiCard label="Ventas del Día" value="$3.8M" sub="hoy" trend={{ val: "+18%", up: true }} icon={TrendingUp} color="bg-violet-50 text-violet-600" />
        <KpiCard label="Caja Actual" value="$12.4M" sub="saldo disponible" trend={{ val: "+8%", up: true }} icon={Wallet} color="bg-amber-50 text-amber-600" />
        <KpiCard label="Clientes" value="184" sub="activos" trend={{ val: "+6", up: true }} icon={Users} color="bg-sky-50 text-sky-600" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard label="Ventas del Mes" value="$58M" sub="jul 2026" trend={{ val: "+12%", up: true }} icon={DollarSign} color="bg-blue-50 text-blue-600" />
        <KpiCard label="Compras del Mes" value="$35M" sub="jul 2026" trend={{ val: "+5%", up: true }} icon={ShoppingCart} color="bg-indigo-50 text-indigo-600" />
        <KpiCard label="Ingresos" value="$72M" sub="acumulado" trend={{ val: "+9%", up: true }} icon={ArrowUpCircle} color="bg-emerald-50 text-emerald-600" />
        <KpiCard label="Egresos" value="$44M" sub="acumulado" trend={{ val: "+3%", up: false }} icon={ArrowDownCircle} color="bg-red-50 text-red-500" />
        <KpiCard label="Utilidad" value="$28M" sub="neta acumulada" trend={{ val: "+15%", up: true }} icon={TrendingUp} color="bg-emerald-50 text-emerald-600" />
        <KpiCard label="Proveedores" value="38" sub="activos" icon={Truck} color="bg-orange-50 text-orange-600" />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Ventas vs. Compras</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Últimos 6 meses</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={salesData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="gVentas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gCompras" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000000).toFixed(0)}M`} />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid rgba(0,0,0,0.08)", fontSize: 12 }} formatter={(v) => [fmt(v), ""]} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              <Area type="monotone" dataKey="ventas" name="Ventas" stroke="#2563EB" fill="url(#gVentas)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="compras" name="Compras" stroke="#F59E0B" fill="url(#gCompras)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-foreground">Categorías más vendidas</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Por volumen de ventas</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={categoriaData} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="value">
                {categoriaData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid rgba(0,0,0,0.08)", fontSize: 12 }} formatter={(v) => [`${v}%`, ""]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1.5">
            {categoriaData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: CHART_COLORS[i] }} />
                <span className="flex-1 text-muted-foreground">{d.name}</span>
                <span className="font-medium text-foreground">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-foreground">Productos más vendidos</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Unidades vendidas este mes</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={topProducts} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="nombre" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={110} />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid rgba(0,0,0,0.08)", fontSize: 12 }} />
              <Bar dataKey="ventas" name="Unidades" fill="#2563EB" radius={[0, 4, 4, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-4">Alertas de inventario</h3>
          <div className="space-y-3">
            {alertasInventario.map((p) => (
              <div key={p.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${p.estado === "Agotado" ? "bg-red-100" : "bg-amber-100"}`}>
                  <AlertTriangle size={13} className={p.estado === "Agotado" ? "text-red-500" : "text-amber-500"} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{p.nombre}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.cantidad} uds · <StatusBadge status={p.estado} />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Últimas ventas</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Transacciones recientes</p>
          </div>
          <button className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">
            Ver todas <ArrowRight size={12} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Factura", "Cliente", "Fecha", "Items", "Total", "Estado"].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-muted-foreground px-5 py-3 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ultimasVentas.map((s) => (
                <tr key={s.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs font-medium text-blue-600">{s.id}</td>
                  <td className="px-5 py-3 text-xs text-foreground font-medium">{s.cliente}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{s.fecha}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{s.items} items</td>
                  <td className="px-5 py-3 text-xs font-semibold text-foreground">{fmt(s.total)}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={s.estado} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
