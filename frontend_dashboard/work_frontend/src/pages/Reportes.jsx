import { useState, useEffect } from "react";
import {
  BarChart3, Download, RefreshCw, DollarSign, Package, AlertTriangle,
  TrendingUp, CheckCircle, XCircle, FileText
} from "lucide-react";
import reporteService from "../service/reporteService";
import { KpiCard } from "../components/dashboard/KpiCard";

export default function Reportes() {
  const [reporte, setReporte] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [descargandoPdf, setDescargandoPdf] = useState(false);

  const cargarReporte = async () => {
    setCargando(true);
    try {
      const res = await reporteService.obtenerReporteInventario();
      setReporte(res?.data || null);
    } catch (err) {
      console.error("Error al cargar reporte:", err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarReporte();
  }, []);

  const descargarPDF = async () => {
    setDescargandoPdf(true);
    try {
      await reporteService.descargarReporteInventarioPDF();
    } catch (err) {
      alert("Error al generar el PDF del reporte de inventario.");
    } finally {
      setDescargandoPdf(false);
    }
  };

  const fmt = (n) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n || 0);

  const resumen = reporte?.resumen || {};
  const inventario = reporte?.inventario || [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Reportes de Inventario & Finanzas</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Valoración total, rentabilidad estimada e informe ejecutivo imprimible.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={cargarReporte}
            className="p-2 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Recargar"
          >
            <RefreshCw size={16} className={cargando ? "animate-spin" : ""} />
          </button>
          <button
            onClick={descargarPDF}
            disabled={descargandoPdf}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
          >
            <Download size={16} className={descargandoPdf ? "animate-bounce" : ""} />
            {descargandoPdf ? "Generando Reporte..." : "Exportar PDF Oficial"}
          </button>
        </div>
      </div>

      {/* Indicadores Financieros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">Costo Total Inventario</p>
          <h3 className="text-2xl font-bold text-foreground mt-1">{fmt(resumen.costoTotalInventario)}</h3>
          <p className="text-[11px] text-muted-foreground mt-1">Capital invertido en existencias</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">Valor Potencial de Venta</p>
          <h3 className="text-2xl font-bold text-blue-600 mt-1">{fmt(resumen.valorPotencialVentas)}</h3>
          <p className="text-[11px] text-muted-foreground mt-1">Ingresos esperados al 100% de venta</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">Ganancia Neta Potencial</p>
          <h3 className="text-2xl font-bold text-emerald-600 mt-1">{fmt(resumen.gananciaPotencial)}</h3>
          <p className="text-[11px] text-muted-foreground mt-1">Margen de utilidad proyectado</p>
        </div>
      </div>

      {/* KPIs de Existencias */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Package size={20} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Productos</p>
            <p className="text-lg font-bold text-foreground">{resumen.totalProductos ?? 0}</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle size={20} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Con Stock</p>
            <p className="text-lg font-bold text-foreground">{resumen.productosConStock ?? 0}</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <AlertTriangle size={20} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Stock Bajo</p>
            <p className="text-lg font-bold text-amber-600">{resumen.productosConStockBajo ?? 0}</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center font-bold">
            <XCircle size={20} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Agotados</p>
            <p className="text-lg font-bold text-red-500">{resumen.productosSinStock ?? 0}</p>
          </div>
        </div>
      </div>

      {/* Tabla Detalle Inventario */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Detalle del Inventario Activo</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Listado valorizado de existencias</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/40 border-b border-border text-xs text-muted-foreground font-medium uppercase">
              <tr>
                <th className="px-5 py-3">Código</th>
                <th className="px-5 py-3">Producto</th>
                <th className="px-5 py-3 text-center">Stock</th>
                <th className="px-5 py-3 text-right">Costo Unit.</th>
                <th className="px-5 py-3 text-right">Precio Venta</th>
                <th className="px-5 py-3 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {cargando ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-muted-foreground text-xs">
                    Cargando reporte...
                  </td>
                </tr>
              ) : inventario.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-muted-foreground text-xs">
                    No hay registros disponibles en el inventario.
                  </td>
                </tr>
              ) : (
                inventario.map((p, idx) => (
                  <tr key={idx} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs font-semibold text-blue-600">{p.codigo_producto}</td>
                    <td className="px-5 py-3.5 font-medium text-foreground">{p.nombre_producto}</td>
                    <td className="px-5 py-3.5 text-center font-bold text-xs">{p.stock}</td>
                    <td className="px-5 py-3.5 text-right text-xs text-muted-foreground">{fmt(p.costo_produccion)}</td>
                    <td className="px-5 py-3.5 text-right font-semibold text-foreground text-xs">{fmt(p.precio_venta)}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                          p.estado === "Agotado" || p.estado === "Sin stock"
                            ? "bg-red-50 text-red-600 border-red-200"
                            : p.estado === "Stock Bajo"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}
                      >
                        {p.estado}
                      </span>
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
