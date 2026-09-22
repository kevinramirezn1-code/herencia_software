import { useState, useEffect } from "react";
import {
  ShoppingCart, Plus, Search, RefreshCw, FileText, Download,
  CheckCircle, Clock, DollarSign, User, AlertCircle, Eye
} from "lucide-react";
import ventaService from "../service/ventaService";
import productoService from "../service/productoService";

export default function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [modalNuevaVenta, setModalNuevaVenta] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [descargandoPdfId, setDescargandoPdfId] = useState(null);
  const [errorModal, setErrorModal] = useState("");

  // Items en la nueva venta
  const [itemsVenta, setItemsVenta] = useState([
    { fk_producto: "", cantidad: 1, precio_unitario: 0, stockMax: 0, subtotal: 0 },
  ]);
  const [descuentoGlobal, setDescuentoGlobal] = useState(0);

  const cargarVentas = async () => {
    setCargando(true);
    try {
      const [resVentas, resProd] = await Promise.all([
        ventaService.listarVentas(),
        productoService.obtenerTodos(),
      ]);
      const vData = resVentas?.data;
      const pData = resProd?.data;
      const arrVentas = Array.isArray(vData) ? vData : vData?.ventas || [];
      const arrProductos = Array.isArray(pData) ? pData : pData?.productos || [];

      setVentas(arrVentas);
      setProductos(arrProductos);

      if (arrProductos.length > 0) {
        const primerProd = arrProductos[0];
        setItemsVenta([
          {
            fk_producto: primerProd.id_producto || primerProd.id,
            cantidad: 1,
            precio_unitario: primerProd.precio_venta || 0,
            stockMax: primerProd.stock || 0,
            subtotal: primerProd.precio_venta || 0,
          },
        ]);
      }
    } catch (err) {
      console.error("Error al cargar ventas:", err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarVentas();
  }, []);

  const agregarItem = () => {
    if (productos.length === 0) return;
    const primerProd = productos[0];
    setItemsVenta([
      ...itemsVenta,
      {
        fk_producto: primerProd.id_producto || primerProd.id,
        cantidad: 1,
        precio_unitario: primerProd.precio_venta || 0,
        stockMax: primerProd.stock || 0,
        subtotal: primerProd.precio_venta || 0,
      },
    ]);
  };

  const eliminarItem = (index) => {
    if (itemsVenta.length === 1) return;
    setItemsVenta(itemsVenta.filter((_, i) => i !== index));
  };

  const actualizarItem = (index, campo, valor) => {
    const nuevosItems = [...itemsVenta];
    const item = { ...nuevosItems[index] };

    if (campo === "fk_producto") {
      const prod = productos.find((p) => (p.id_producto || p.id) === Number(valor));
      item.fk_producto = valor;
      item.precio_unitario = prod ? prod.precio_venta : 0;
      item.stockMax = prod ? prod.stock : 0;
    } else if (campo === "cantidad") {
      item.cantidad = Math.max(1, Number(valor));
    } else if (campo === "precio_unitario") {
      item.precio_unitario = Number(valor);
    }

    item.subtotal = item.cantidad * item.precio_unitario;
    nuevosItems[index] = item;
    setItemsVenta(nuevosItems);
  };

  const calcularTotales = () => {
    const subtotal = itemsVenta.reduce((acc, curr) => acc + curr.subtotal, 0);
    const iva = subtotal * 0.19; // Estimado 19%
    const total = Math.max(0, subtotal + iva - Number(descuentoGlobal));
    return { subtotal, iva, total };
  };

  const registrarVenta = async (e) => {
    e.preventDefault();
    setErrorModal("");
    setGuardando(true);

    try {
      const payload = {
        fk_venta_id_cliente: 1, // Cliente por defecto
        detalles: itemsVenta.map((item) => ({
          fk_producto: Number(item.fk_producto),
          cantidad: Number(item.cantidad),
          precio_unitario: Number(item.precio_unitario),
        })),
        descuento: Number(descuentoGlobal) || 0,
      };

      await ventaService.crearVenta(payload);
      setModalNuevaVenta(false);
      cargarVentas();
    } catch (err) {
      setErrorModal(err.mensaje || "Error al registrar la venta.");
    } finally {
      setGuardando(false);
    }
  };

  const descargarPDF = async (idVenta, numeroVenta) => {
    setDescargandoPdfId(idVenta);
    try {
      await ventaService.descargarFacturaPDF(idVenta, numeroVenta);
    } catch (err) {
      alert("No se pudo generar la factura en PDF.");
    } finally {
      setDescargandoPdfId(null);
    }
  };

  const listaVentas = Array.isArray(ventas) ? ventas : [];
  const ventasFiltradas = listaVentas.filter((v) => {
    const term = busqueda.toLowerCase();
    return (
      v.numero_venta?.toLowerCase().includes(term) ||
      v.cliente?.nombre_cliente?.toLowerCase().includes(term) ||
      String(v.idventa || v.id_venta).includes(term)
    );
  });

  const fmt = (n) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n || 0);

  const { subtotal, iva, total } = calcularTotales();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Ventas y Facturación</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Registro de transacciones comerciales y generación de facturas oficiales en PDF.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={cargarVentas}
            className="p-2 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Recargar"
          >
            <RefreshCw size={16} className={cargando ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => {
              setErrorModal("");
              setModalNuevaVenta(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
          >
            <Plus size={16} />
            Nueva Venta
          </button>
        </div>
      </div>

      {/* Buscador */}
      <div className="flex items-center gap-2 bg-card border border-border rounded-xl p-3 shadow-sm max-w-md">
        <Search size={16} className="text-muted-foreground flex-shrink-0" />
        <input
          type="text"
          placeholder="Buscar por número de factura o cliente..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="bg-transparent text-sm outline-none w-full text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Tabla de Ventas */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/40 border-b border-border text-xs text-muted-foreground font-medium uppercase">
              <tr>
                <th className="px-5 py-3">N° Factura</th>
                <th className="px-5 py-3">Cliente</th>
                <th className="px-5 py-3">Fecha</th>
                <th className="px-5 py-3 text-right">Subtotal</th>
                <th className="px-5 py-3 text-right">Total</th>
                <th className="px-5 py-3 text-center">Estado</th>
                <th className="px-5 py-3 text-right">Factura PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {cargando ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-muted-foreground text-xs">
                    Cargando ventas...
                  </td>
                </tr>
              ) : ventasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-muted-foreground text-xs">
                    No hay ventas registradas aún. Haz clic en "Nueva Venta" para emitir la primera factura.
                  </td>
                </tr>
              ) : (
                ventasFiltradas.map((v) => {
                  const idVenta = v.idventa || v.id_venta || v.id;
                  const numero = v.numero_venta || `V-${idVenta}`;
                  const clienteNombre = v.cliente
                    ? `${v.cliente.nombre_cliente} ${v.cliente.apellido_cliente || ""}`.trim()
                    : "Cliente General";

                  return (
                    <tr key={idVenta} className="hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-xs font-semibold text-blue-600">{numero}</td>
                      <td className="px-5 py-3.5 font-medium text-foreground">{clienteNombre}</td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">
                        {v.fecha ? new Date(v.fecha).toLocaleString("es-CO") : "—"}
                      </td>
                      <td className="px-5 py-3.5 text-right text-xs text-muted-foreground">{fmt(v.subtotal)}</td>
                      <td className="px-5 py-3.5 text-right font-bold text-foreground text-xs">{fmt(v.total)}</td>
                      <td className="px-5 py-3.5 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Pagada
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => descargarPDF(idVenta, numero)}
                          disabled={descargandoPdfId === idVenta}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 hover:bg-blue-100 text-xs font-medium transition-colors"
                        >
                          <Download size={13} className={descargandoPdfId === idVenta ? "animate-bounce" : ""} />
                          {descargandoPdfId === idVenta ? "Generando..." : "Descargar PDF"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nueva Venta (POS) */}
      {modalNuevaVenta && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-2xl w-full p-6 shadow-2xl animate-in zoom-in-95 max-h-[90vh] flex flex-col">
            <h3 className="text-base font-bold text-foreground mb-1">Registrar Nueva Venta</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Selecciona los productos y cantidades para generar la orden y factura.
            </p>

            {errorModal && (
              <div className="p-3 mb-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
                {errorModal}
              </div>
            )}

            <form onSubmit={registrarVenta} className="space-y-4 flex-1 overflow-y-auto pr-1">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">Productos de la Venta</span>
                  <button
                    type="button"
                    onClick={agregarItem}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus size={14} /> Agregar línea
                  </button>
                </div>

                {itemsVenta.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2.5 bg-muted/40 rounded-xl border border-border">
                    <div className="flex-1 min-w-0">
                      <select
                        value={item.fk_producto}
                        onChange={(e) => actualizarItem(idx, "fk_producto", e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-card rounded-lg text-xs outline-none border border-border"
                        required
                      >
                        {productos.map((prod) => (
                          <option key={prod.id_producto || prod.id} value={prod.id_producto || prod.id}>
                            {prod.codigo_producto} - {prod.nombre_producto} (Stock: {prod.stock})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-20">
                      <input
                        type="number"
                        min="1"
                        placeholder="Cant"
                        value={item.cantidad}
                        onChange={(e) => actualizarItem(idx, "cantidad", e.target.value)}
                        className="w-full px-2 py-1.5 bg-card rounded-lg text-xs text-center outline-none border border-border"
                        required
                      />
                    </div>

                    <div className="w-28 text-right font-semibold text-xs text-foreground">
                      {fmt(item.subtotal)}
                    </div>

                    {itemsVenta.length > 1 && (
                      <button
                        type="button"
                        onClick={() => eliminarItem(idx)}
                        className="p-1.5 text-muted-foreground hover:text-red-500 rounded-lg hover:bg-muted transition-colors"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Resumen Totales */}
              <div className="p-4 bg-muted/40 rounded-xl border border-border space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>IVA (19%)</span>
                  <span>{fmt(iva)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-foreground pt-2 border-t border-border">
                  <span>Total Factura</span>
                  <span className="text-blue-600">{fmt(total)}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setModalNuevaVenta(false)}
                  className="px-4 py-2 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardando}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  {guardando ? "Procesando Venta..." : "Finalizar y Facturar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
