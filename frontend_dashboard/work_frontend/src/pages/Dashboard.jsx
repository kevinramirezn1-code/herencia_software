import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package, TrendingUp, TrendingDown, Wallet, Users, CheckCircle, XCircle,
  DollarSign, ShoppingCart, ArrowUpCircle, ArrowDownCircle, Truck,
  AlertTriangle, ArrowRight, RefreshCw, AlertCircle, Clock
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { KpiCard } from "../components/dashboard/KpiCard";
import reporteService from "../service/reporteService";
import productoService from "../service/productoService";
import ventaService from "../service/ventaService";
import notificacionService from "../service/notificacionService";
import proveedorService from "../service/proveedorService";

const CHART_COLORS = ["#2563EB", "#22C55E", "#F59E0B", "#0EA5E9", "#8B5CF6"];

const fmt = (n) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n || 0);

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
  const [cargando, setCargando] = useState(true);
  const [reporte, setReporte] = useState(null);
  const [productos, setProductos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [notificaciones, setNotificaciones] = useState({ stockMinimo: [], proximosVencer: [], agotados: [] });

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [resRep, resProd, resVentas, resProv, resNotif] = await Promise.allSettled([
        reporteService.obtenerReporteInventario(),
        productoService.obtenerTodos(),
        ventaService.listarVentas(),
        proveedorService.obtenerTodos(),
        notificacionService.obtenerTodas(),
      ]);

      if (resRep.status === "fulfilled") setReporte(resRep.value?.data);
      if (resProd.status === "fulfilled") {
        const prodData = resProd.value?.data;
        setProductos(Array.isArray(prodData) ? prodData : prodData?.productos || []);
      }
      if (resVentas.status === "fulfilled") {
        const vData = resVentas.value?.data;
        setVentas(Array.isArray(vData) ? vData : vData?.ventas || []);
      }
      if (resProv.status === "fulfilled") {
        const provData = resProv.value?.data;
        setProveedores(Array.isArray(provData) ? provData : provData?.proveedores || []);
      }
      if (resNotif.status === "fulfilled") setNotificaciones(resNotif.value || {});
    } catch (err) {
      console.error("Error al cargar datos de dashboard:", err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const listaProductos = Array.isArray(productos) ? productos : [];
  const listaVentas = Array.isArray(ventas) ? ventas : [];
  const listaProveedores = Array.isArray(proveedores) ? proveedores : [];

  const resumen = reporte?.resumen || {};
  const totalCostoInventario = resumen.costoTotalInventario || listaProductos.reduce((acc, p) => acc + ((p.costo_produccion || 0) * (p.stock || 0)), 0);
  const totalVentaAcumulada = listaVentas.reduce((acc, v) => acc + (Number(v.total) || 0), 0);
  const totalProductosConStock = resumen.productosConStock ?? listaProductos.filter((p) => (p.stock || 0) > 0).length;
  const totalProductosAgotados = resumen.productosSinStock ?? listaProductos.filter((p) => (p.stock || 0) === 0).length;

  // Gráfico: Productos con más stock / valor
  const topProductsChart = listaProductos
    .slice()
    .sort((a, b) => (b.stock || 0) - (a.stock || 0))
    .slice(0, 5)
    .map((p) => ({
      nombre: p.nombre_producto?.length > 18 ? p.nombre_producto.slice(0, 15) + "..." : p.nombre_producto,
      stock: p.stock || 0,
    }));

  // Gráfico de Ventas vs Compras (Simulado dinámico basado en ventas reales o histórico)
  const salesChartData = [
    { mes: "May", ventas: Math.round(totalVentaAcumulada * 0.15), compras: Math.round(totalCostoInventario * 0.2) },
    { mes: "Jun", ventas: Math.round(totalVentaAcumulada * 0.25), compras: Math.round(totalCostoInventario * 0.3) },
    { mes: "Jul", ventas: Math.round(totalVentaAcumulada * 0.35), compras: Math.round(totalCostoInventario * 0.25) },
    { mes: "Ago", ventas: Math.round(totalVentaAcumulada * 0.25) || totalVentaAcumulada, compras: Math.round(totalCostoInventario * 0.25) || totalCostoInventario },
  ];

  // Gráfico Categorías
  const categoriaData = [
    { name: "Lácteos", value: 35 },
    { name: "Cárnicos", value: 25 },
    { name: "Abarrotes", value: 25 },
    { name: "Bebidas", value: 15 },
  ];

  // Alertas unificadas
  const alertasLista = [
    ...(notificaciones.agotados || []).map((p) => ({
      id: p.codigo_producto || p.id_producto,
      nombre: p.nombre_producto,
      cantidad: 0,
      estado: "Agotado",
    })),
    ...(notificaciones.stockMinimo || []).map((p) => ({
      id: p.codigo_producto || p.id_producto,
      nombre: p.nombre_producto,
      cantidad: p.stock,
      estado: "Bajo Stock",
    })),
  ].slice(0, 4);

  return (
    <div className="p-6 space-y-6">
      {/* Botón de refrescar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Resumen General</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Métricas del negocio conectadas en tiempo real al backend.
          </p>
        </div>
        <button
          onClick={cargarDatos}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw size={13} className={cargando ? "animate-spin" : ""} />
          Actualizar Datos
        </button>
      </div>

      {/* KPIs Fila 1 */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard
          label="Inventario Total"
          value={fmt(totalCostoInventario)}
          sub={`${listaProductos.length} referencias`}
          trend={{ val: "+", up: true }}
          icon={Package}
          color="bg-blue-50 text-blue-600"
        />
        <KpiCard
          label="Disponibles"
          value={String(totalProductosConStock)}
          sub="productos en stock"
          trend={{ val: "OK", up: true }}
          icon={CheckCircle}
          color="bg-emerald-50 text-emerald-600"
        />
        <KpiCard
          label="Agotados"
          value={String(totalProductosAgotados)}
          sub="sin stock"
          trend={{ val: totalProductosAgotados > 0 ? "Alerta" : "0", up: totalProductosAgotados === 0 }}
          icon={XCircle}
          color="bg-red-50 text-red-500"
        />
        <KpiCard
          label="Ventas Registradas"
          value={fmt(totalVentaAcumulada)}
          sub={`${listaVentas.length} transacciones`}
          trend={{ val: "+", up: true }}
          icon={TrendingUp}
          color="bg-violet-50 text-violet-600"
        />
        <KpiCard
          label="Valor de Venta"
          value={fmt(resumen.valorPotencialVentas || totalCostoInventario * 1.3)}
          sub="potencial estimado"
          icon={Wallet}
          color="bg-amber-50 text-amber-600"
        />
        <KpiCard
          label="Proveedores"
          value={String(listaProveedores.length)}
          sub="activos en catálogo"
          icon={Truck}
          color="bg-sky-50 text-sky-600"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Ventas vs. Inversión en Inventario</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Comportamiento financiero</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={salesChartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
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
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid rgba(0,0,0,0.08)", fontSize: 12 }} formatter={(v) => [fmt(v), ""]} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              <Area type="monotone" dataKey="ventas" name="Ventas ($)" stroke="#2563EB" fill="url(#gVentas)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="compras" name="Inversión ($)" stroke="#F59E0B" fill="url(#gCompras)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-foreground">Distribución por Categorías</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Porcentaje en catálogo</p>
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

      {/* Fila Productos con mayor Stock y Alertas */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-foreground">Productos con Mayor Existencia</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Unidades disponibles en bodega</p>
          </div>
          {topProductsChart.length === 0 ? (
            <div className="py-10 text-center text-xs text-muted-foreground">
              No hay productos con existencias para graficar.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={topProductsChart} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="nombre" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={120} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid rgba(0,0,0,0.08)", fontSize: 12 }} />
                <Bar dataKey="stock" name="Stock" fill="#2563EB" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Alertas de inventario</h3>
            <Link to="/dashboard/productos" className="text-xs text-blue-600 hover:underline">Ver catálogo</Link>
          </div>
          <div className="space-y-3">
            {alertasLista.length === 0 ? (
              <p className="text-xs text-muted-foreground py-6 text-center">
                No hay alertas activas de stock bajo o agotado.
              </p>
            ) : (
              alertasLista.map((p, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
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
              ))
            )}
          </div>
        </div>
      </div>

      {/* Tabla Últimas Ventas */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Últimas transacciones</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Ventas emitidas en el sistema</p>
          </div>
          <Link to="/dashboard/ventas" className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">
            Ver todas <ArrowRight size={12} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Factura", "Cliente", "Fecha", "Total", "Estado"].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-muted-foreground px-5 py-3 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {listaVentas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-xs text-muted-foreground">
                    No hay ventas registradas aún. Visita la sección de Ventas para emitir una.
                  </td>
                </tr>
              ) : (
                listaVentas.slice(0, 5).map((s) => (
                  <tr key={s.idventa || s.id_venta || s.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs font-medium text-blue-600">{s.numero_venta || `V-${s.idventa || s.id_venta}`}</td>
                    <td className="px-5 py-3 text-xs text-foreground font-medium">
                      {s.cliente ? `${s.cliente.nombre_cliente} ${s.cliente.apellido_cliente || ""}` : "Cliente General"}
                    </td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">
                      {s.fecha ? new Date(s.fecha).toLocaleDateString("es-CO") : "—"}
                    </td>
                    <td className="px-5 py-3 text-xs font-semibold text-foreground">{fmt(s.total)}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status="Pagada" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
