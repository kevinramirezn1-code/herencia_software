import { useState, useEffect } from "react";
import {
  ArrowLeftRight, ArrowDownLeft, ArrowUpRight, Plus, RefreshCw,
  Package, Calendar, Truck, User, FileText, CheckCircle2, AlertCircle
} from "lucide-react";
import movimientoService from "../service/movimientoService";
import productoService from "../service/productoService";
import proveedorService from "../service/proveedorService";

export default function Movimientos() {
  const [tabActiva, setTabActiva] = useState("ingresos"); // "ingresos" | "salidas"
  const [ingresos, setIngresos] = useState([]);
  const [salidas, setSalidas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Modales
  const [modalIngreso, setModalIngreso] = useState(false);
  const [modalSalida, setModalSalida] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [errorModal, setErrorModal] = useState("");

  // Form Ingreso
  const [formIngreso, setFormIngreso] = useState({
    fk_ingreso_id_proveedor: "",
    numero_factura_proveedor: "",
    detalles: [
      {
        fk_producto: "",
        cantidad: 1,
        precio_compra: "",
        numero_lote: `LOT-${Date.now().toString().slice(-4)}`,
        fecha_vencimiento: "",
      },
    ],
  });

  // Form Salida
  const [formSalida, setFormSalida] = useState({
    motivo_salida: "Merma / Daño",
    detalles: [
      {
        fk_producto: "",
        cantidad: 1,
        observacion: "Ajuste de inventario",
      },
    ],
  });

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [resIngresos, resSalidas, resProd, resProv] = await Promise.all([
        movimientoService.listarIngresos(),
        movimientoService.listarSalidas(),
        productoService.obtenerTodos(),
        proveedorService.obtenerTodos(),
      ]);
      const arrIngresos = Array.isArray(resIngresos?.data) ? resIngresos.data : resIngresos?.data?.ingresos || [];
      const arrSalidas = Array.isArray(resSalidas?.data) ? resSalidas.data : resSalidas?.data?.salidas || [];
      const arrProd = Array.isArray(resProd?.data) ? resProd.data : resProd?.data?.productos || [];
      const arrProv = Array.isArray(resProv?.data) ? resProv.data : resProv?.data?.proveedores || [];

      setIngresos(arrIngresos);
      setSalidas(arrSalidas);
      setProductos(arrProd);
      setProveedores(arrProv);

      if (arrProv.length > 0 && arrProd.length > 0) {
        setFormIngreso((prev) => ({
          ...prev,
          fk_ingreso_id_proveedor: arrProv[0].id_proveedor || arrProv[0].id,
          detalles: [
            {
              ...prev.detalles[0],
              fk_producto: arrProd[0].id_producto || arrProd[0].id,
            },
          ],
        }));
        setFormSalida((prev) => ({
          ...prev,
          detalles: [
            {
              ...prev.detalles[0],
              fk_producto: arrProd[0].id_producto || arrProd[0].id,
            },
          ],
        }));
      }
    } catch (err) {
      console.error("Error al cargar movimientos:", err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const guardarIngreso = async (e) => {
    e.preventDefault();
    setErrorModal("");
    setGuardando(true);

    try {
      const payload = {
        fk_ingreso_id_proveedor: Number(formIngreso.fk_ingreso_id_proveedor),
        numero_factura_proveedor: formIngreso.numero_factura_proveedor,
        detalles: formIngreso.detalles.map((d) => ({
          fk_producto: Number(d.fk_producto),
          cantidad: Number(d.cantidad),
          precio_compra: Number(d.precio_compra),
          numero_lote: d.numero_lote,
          fecha_vencimiento: d.fecha_vencimiento || null,
        })),
      };

      await movimientoService.registrarIngreso(payload);
      setModalIngreso(false);
      cargarDatos();
    } catch (err) {
      setErrorModal(err.mensaje || "Error al registrar el ingreso de mercancía.");
    } finally {
      setGuardando(false);
    }
  };

  const guardarSalida = async (e) => {
    e.preventDefault();
    setErrorModal("");
    setGuardando(true);

    try {
      const payload = {
        motivo_salida: formSalida.motivo_salida,
        detalles: formSalida.detalles.map((d) => ({
          fk_producto: Number(d.fk_producto),
          cantidad: Number(d.cantidad),
          observacion: d.observacion,
        })),
      };

      await movimientoService.registrarSalida(payload);
      setModalSalida(false);
      cargarDatos();
    } catch (err) {
      setErrorModal(err.mensaje || "Error al registrar la salida de mercancía.");
    } finally {
      setGuardando(false);
    }
  };

  const fmt = (n) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n || 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Movimientos de Inventario</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Registro y control de entradas (compras/lotes) y salidas (mermas/ajustes).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={cargarDatos}
            className="p-2 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Recargar"
          >
            <RefreshCw size={16} className={cargando ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => {
              setErrorModal("");
              setModalIngreso(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            <ArrowDownLeft size={16} />
            + Registrar Entrada
          </button>
          <button
            onClick={() => {
              setErrorModal("");
              setModalSalida(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            <ArrowUpRight size={16} />
            - Registrar Salida
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border">
        <button
          onClick={() => setTabActiva("ingresos")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            tabActiva === "ingresos"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <ArrowDownLeft size={16} className="text-emerald-500" />
          Ingresos de Mercancía ({ingresos.length})
        </button>
        <button
          onClick={() => setTabActiva("salidas")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            tabActiva === "salidas"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <ArrowUpRight size={16} className="text-red-500" />
          Salidas y Bajas ({salidas.length})
        </button>
      </div>

      {/* Contenido Tabla Ingresos */}
      {tabActiva === "ingresos" && (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/40 border-b border-border text-xs text-muted-foreground font-medium uppercase">
                <tr>
                  <th className="px-5 py-3">ID / Factura</th>
                  <th className="px-5 py-3">Proveedor</th>
                  <th className="px-5 py-3">Fecha</th>
                  <th className="px-5 py-3 text-right">Total Entrada</th>
                  <th className="px-5 py-3 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {cargando ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-muted-foreground text-xs">
                      Cargando historial de entradas...
                    </td>
                  </tr>
                ) : ingresos.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-muted-foreground text-xs">
                      No hay entradas de mercancía registradas todavía.
                    </td>
                  </tr>
                ) : (
                  ingresos.map((ing) => (
                    <tr key={ing.idingreso_mercancia || ing.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-xs font-semibold text-blue-600">
                        ING-#{ing.idingreso_mercancia || ing.id} · Fac: {ing.numero_factura_proveedor || "N/A"}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-foreground">
                        {ing.proveedor?.razon_social || `Proveedor #${ing.fk_ingreso_id_proveedor}`}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">
                        {ing.fecha_ingreso ? new Date(ing.fecha_ingreso).toLocaleString("es-CO") : "—"}
                      </td>
                      <td className="px-5 py-3.5 text-right font-bold text-emerald-600 text-xs">
                        {fmt(ing.total_ingreso)}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Completado
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Contenido Tabla Salidas */}
      {tabActiva === "salidas" && (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/40 border-b border-border text-xs text-muted-foreground font-medium uppercase">
                <tr>
                  <th className="px-5 py-3">ID Salida</th>
                  <th className="px-5 py-3">Motivo</th>
                  <th className="px-5 py-3">Fecha</th>
                  <th className="px-5 py-3 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {cargando ? (
                  <tr>
                    <td colSpan={4} className="text-center py-10 text-muted-foreground text-xs">
                      Cargando historial de salidas...
                    </td>
                  </tr>
                ) : salidas.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-10 text-muted-foreground text-xs">
                      No hay salidas de mercancía registradas todavía.
                    </td>
                  </tr>
                ) : (
                  salidas.map((sal) => (
                    <tr key={sal.idsalida_mercancia || sal.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-xs font-semibold text-red-600">
                        SAL-#{sal.idsalida_mercancia || sal.id}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-foreground">{sal.motivo_salida}</td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">
                        {sal.fecha_salida ? new Date(sal.fecha_salida).toLocaleString("es-CO") : "—"}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-red-50 text-red-700 border border-red-200">
                          Descontado
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Registrar Ingreso */}
      {modalIngreso && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-foreground mb-1">Registrar Entrada de Mercancía</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Aumenta el stock y registra el lote y costo de compra del proveedor.
            </p>

            {errorModal && (
              <div className="p-3 mb-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
                {errorModal}
              </div>
            )}

            <form onSubmit={guardarIngreso} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">Proveedor *</label>
                  <select
                    value={formIngreso.fk_ingreso_id_proveedor}
                    onChange={(e) => setFormIngreso({ ...formIngreso, fk_ingreso_id_proveedor: e.target.value })}
                    className="w-full px-3 py-2 bg-muted rounded-lg text-xs outline-none border border-transparent focus:border-blue-500"
                    required
                  >
                    {proveedores.map((prov) => (
                      <option key={prov.id_proveedor || prov.id} value={prov.id_proveedor || prov.id}>
                        {prov.razon_social}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">N° Factura Proveedor *</label>
                  <input
                    type="text"
                    required
                    placeholder="FAC-2026-001"
                    value={formIngreso.numero_factura_proveedor}
                    onChange={(e) => setFormIngreso({ ...formIngreso, numero_factura_proveedor: e.target.value })}
                    className="w-full px-3 py-2 bg-muted rounded-lg text-xs outline-none border border-transparent focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-muted/40 rounded-xl border border-border space-y-3">
                <p className="text-xs font-semibold text-foreground">Detalle del Producto Ingresado</p>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Producto *</label>
                  <select
                    value={formIngreso.detalles[0].fk_producto}
                    onChange={(e) => {
                      const det = [...formIngreso.detalles];
                      det[0].fk_producto = e.target.value;
                      setFormIngreso({ ...formIngreso, detalles: det });
                    }}
                    className="w-full px-3 py-2 bg-card rounded-lg text-xs outline-none border border-border"
                    required
                  >
                    {productos.map((p) => (
                      <option key={p.id_producto || p.id} value={p.id_producto || p.id}>
                        {p.codigo_producto} - {p.nombre_producto} (Stock actual: {p.stock})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Cantidad a ingresar *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formIngreso.detalles[0].cantidad}
                      onChange={(e) => {
                        const det = [...formIngreso.detalles];
                        det[0].cantidad = e.target.value;
                        setFormIngreso({ ...formIngreso, detalles: det });
                      }}
                      className="w-full px-3 py-2 bg-card rounded-lg text-xs outline-none border border-border"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Costo Unitario ($) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="any"
                      placeholder="2500"
                      value={formIngreso.detalles[0].precio_compra}
                      onChange={(e) => {
                        const det = [...formIngreso.detalles];
                        det[0].precio_compra = e.target.value;
                        setFormIngreso({ ...formIngreso, detalles: det });
                      }}
                      className="w-full px-3 py-2 bg-card rounded-lg text-xs outline-none border border-border"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">N° Lote *</label>
                    <input
                      type="text"
                      required
                      value={formIngreso.detalles[0].numero_lote}
                      onChange={(e) => {
                        const det = [...formIngreso.detalles];
                        det[0].numero_lote = e.target.value;
                        setFormIngreso({ ...formIngreso, detalles: det });
                      }}
                      className="w-full px-3 py-2 bg-card rounded-lg text-xs outline-none border border-border"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Fecha Vencimiento</label>
                    <input
                      type="date"
                      value={formIngreso.detalles[0].fecha_vencimiento}
                      onChange={(e) => {
                        const det = [...formIngreso.detalles];
                        det[0].fecha_vencimiento = e.target.value;
                        setFormIngreso({ ...formIngreso, detalles: det });
                      }}
                      className="w-full px-3 py-2 bg-card rounded-lg text-xs outline-none border border-border"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border mt-4">
                <button
                  type="button"
                  onClick={() => setModalIngreso(false)}
                  className="px-4 py-2 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardando}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  {guardando ? "Procesando..." : "Confirmar Ingreso"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Registrar Salida */}
      {modalSalida && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-foreground mb-1">Registrar Salida / Merma</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Disminuye existencias por concepto de merma, rotura o ajuste.
            </p>

            {errorModal && (
              <div className="p-3 mb-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
                {errorModal}
              </div>
            )}

            <form onSubmit={guardarSalida} className="space-y-3.5">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">Motivo de la Salida *</label>
                <select
                  value={formSalida.motivo_salida}
                  onChange={(e) => setFormSalida({ ...formSalida, motivo_salida: e.target.value })}
                  className="w-full px-3 py-2 bg-muted rounded-lg text-xs outline-none border border-transparent focus:border-blue-500"
                >
                  <option value="Merma / Daño">Merma / Daño</option>
                  <option value="Producto Vencido">Producto Vencido</option>
                  <option value="Ajuste de Inventario">Ajuste de Inventario</option>
                  <option value="Consumo Interno">Consumo Interno</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground block mb-1">Producto *</label>
                <select
                  value={formSalida.detalles[0].fk_producto}
                  onChange={(e) => {
                    const det = [...formSalida.detalles];
                    det[0].fk_producto = e.target.value;
                    setFormSalida({ ...formSalida, detalles: det });
                  }}
                  className="w-full px-3 py-2 bg-muted rounded-lg text-xs outline-none border border-transparent focus:border-blue-500"
                  required
                >
                  {productos.map((p) => (
                    <option key={p.id_producto || p.id} value={p.id_producto || p.id}>
                      {p.codigo_producto} - {p.nombre_producto} (Stock actual: {p.stock})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground block mb-1">Cantidad a retirar *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formSalida.detalles[0].cantidad}
                  onChange={(e) => {
                    const det = [...formSalida.detalles];
                    det[0].cantidad = e.target.value;
                    setFormSalida({ ...formSalida, detalles: det });
                  }}
                  className="w-full px-3 py-2 bg-muted rounded-lg text-xs outline-none border border-transparent focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground block mb-1">Observación</label>
                <input
                  type="text"
                  placeholder="Detalle o justificación"
                  value={formSalida.detalles[0].observacion}
                  onChange={(e) => {
                    const det = [...formSalida.detalles];
                    det[0].observacion = e.target.value;
                    setFormSalida({ ...formSalida, detalles: det });
                  }}
                  className="w-full px-3 py-2 bg-muted rounded-lg text-xs outline-none border border-transparent focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border mt-4">
                <button
                  type="button"
                  onClick={() => setModalSalida(false)}
                  className="px-4 py-2 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardando}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  {guardando ? "Procesando..." : "Confirmar Salida"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
