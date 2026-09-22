import { useState, useEffect } from "react";
import {
  Package, Plus, Search, Filter, RefreshCw, Trash2, Edit, AlertTriangle,
  CheckCircle, XCircle, Clock, DollarSign
} from "lucide-react";
import productoService from "../service/productoService";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState("todos"); // todos, con-stock, sin-stock, stock-bajo, por-vencer
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [errorModal, setErrorModal] = useState("");

  const [form, setForm] = useState({
    codigo_producto: "",
    nombre_producto: "",
    fk_producto_id_categoria: 1,
    costo_produccion: "",
    precio_venta: "",
    stock: 0,
    iva: 19,
    fecha_produccion: "",
    fecha_vencimiento: "",
  });

  const cargarProductos = async () => {
    setCargando(true);
    try {
      let res;
      if (filtro === "con-stock") res = await productoService.obtenerConStock();
      else if (filtro === "sin-stock") res = await productoService.obtenerSinStock();
      else if (filtro === "stock-bajo") res = await productoService.obtenerStockBajo(5);
      else if (filtro === "por-vencer") res = await productoService.obtenerProximosAVencer(30);
      else res = await productoService.obtenerTodos();

      const pData = res?.data;
      setProductos(Array.isArray(pData) ? pData : pData?.productos || []);
    } catch (err) {
      console.error("Error al cargar productos:", err);
      setProductos([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, [filtro]);

  const abrirModalNuevo = () => {
    setProductoEditando(null);
    setErrorModal("");
    setForm({
      codigo_producto: Math.floor(1000 + Math.random() * 9000),
      nombre_producto: "",
      fk_producto_id_categoria: 1,
      costo_produccion: "",
      precio_venta: "",
      stock: 0,
      iva: 19,
      fecha_produccion: new Date().toISOString().slice(0, 10),
      fecha_vencimiento: "",
    });
    setModalAbierto(true);
  };

  const abrirModalEditar = (prod) => {
    setProductoEditando(prod);
    setErrorModal("");
    setForm({
      codigo_producto: prod.codigo_producto || "",
      nombre_producto: prod.nombre_producto || "",
      fk_producto_id_categoria: prod.fk_producto_id_categoria || 1,
      costo_produccion: prod.costo_produccion || "",
      precio_venta: prod.precio_venta || "",
      stock: prod.stock || 0,
      iva: prod.iva || 19,
      fecha_produccion: prod.fecha_produccion ? prod.fecha_produccion.slice(0, 10) : "",
      fecha_vencimiento: prod.fecha_vencimiento ? prod.fecha_vencimiento.slice(0, 10) : "",
    });
    setModalAbierto(true);
  };

  const guardarProducto = async (e) => {
    e.preventDefault();
    setErrorModal("");
    setGuardando(true);

    try {
      const payload = {
        ...form,
        codigo_producto: Number(form.codigo_producto),
        fk_producto_id_categoria: Number(form.fk_producto_id_categoria),
        costo_produccion: Number(form.costo_produccion),
        precio_venta: Number(form.precio_venta),
        stock: Number(form.stock),
        iva: Number(form.iva),
      };

      if (productoEditando) {
        await productoService.actualizar(productoEditando.id_producto || productoEditando.id, payload);
      } else {
        await productoService.crear(payload);
      }

      setModalAbierto(false);
      cargarProductos();
    } catch (err) {
      setErrorModal(err.mensaje || "Error al guardar el producto.");
    } finally {
      setGuardando(false);
    }
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      await productoService.eliminar(id);
      cargarProductos();
    } catch (err) {
      alert(err.mensaje || "No se pudo eliminar el producto.");
    }
  };

  const listaProductos = Array.isArray(productos) ? productos : [];
  const productosFiltrados = listaProductos.filter((p) => {
    const term = busqueda.toLowerCase();
    return (
      p.nombre_producto?.toLowerCase().includes(term) ||
      String(p.codigo_producto || "").toLowerCase().includes(term)
    );
  });

  const fmt = (n) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n || 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Gestión de Productos</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Administra el catálogo de referencias, precios, stock y fechas de caducidad.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={cargarProductos}
            className="p-2 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Recargar"
          >
            <RefreshCw size={16} className={cargando ? "animate-spin" : ""} />
          </button>
          <button
            onClick={abrirModalNuevo}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
          >
            <Plus size={16} />
            Nuevo Producto
          </button>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-card border border-border rounded-xl p-3 shadow-sm">
        <div className="flex items-center gap-2 w-full md:w-80 bg-muted rounded-lg px-3 py-1.5">
          <Search size={16} className="text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            placeholder="Buscar por código o nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="bg-transparent text-sm outline-none w-full text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Botones de Filtro Rápido */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: "todos", label: "Todos" },
            { id: "con-stock", label: "Con Stock" },
            { id: "stock-bajo", label: "Stock Bajo" },
            { id: "sin-stock", label: "Agotados" },
            { id: "por-vencer", label: "Por Vencer" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFiltro(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                filtro === tab.id
                  ? "bg-blue-600 text-white"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de Productos */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/40 border-b border-border text-xs text-muted-foreground font-medium uppercase">
              <tr>
                <th className="px-5 py-3">Código</th>
                <th className="px-5 py-3">Producto</th>
                <th className="px-5 py-3 text-right">Costo</th>
                <th className="px-5 py-3 text-right">Precio Venta</th>
                <th className="px-5 py-3 text-center">Stock</th>
                <th className="px-5 py-3 text-center">Estado</th>
                <th className="px-5 py-3">Vencimiento</th>
                <th className="px-5 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {cargando ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-muted-foreground text-xs">
                    Cargando catálogo de productos...
                  </td>
                </tr>
              ) : productosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-muted-foreground text-xs">
                    No se encontraron productos con los criterios seleccionados.
                  </td>
                </tr>
              ) : (
                productosFiltrados.map((p) => {
                  const id = p.id_producto || p.id;
                  const stock = p.stock || 0;
                  const esAgotado = stock === 0;
                  const esBajo = stock > 0 && stock <= 5;

                  return (
                    <tr key={id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-xs font-semibold text-blue-600">{p.codigo_producto}</td>
                      <td className="px-5 py-3.5 font-medium text-foreground">{p.nombre_producto}</td>
                      <td className="px-5 py-3.5 text-right text-xs text-muted-foreground">{fmt(p.costo_produccion)}</td>
                      <td className="px-5 py-3.5 text-right text-xs font-semibold text-foreground">{fmt(p.precio_venta)}</td>
                      <td className="px-5 py-3.5 text-center font-bold text-xs">{stock}</td>
                      <td className="px-5 py-3.5 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                            esAgotado
                              ? "bg-red-50 text-red-600 border-red-200"
                              : esBajo
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          {esAgotado ? "Agotado" : esBajo ? "Bajo Stock" : "Disponible"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">
                        {p.fecha_vencimiento ? new Date(p.fecha_vencimiento).toLocaleDateString("es-CO") : "—"}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => abrirModalEditar(p)}
                            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-blue-600 transition-colors"
                            title="Editar"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            onClick={() => eliminarProducto(id)}
                            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-red-500 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Crear / Editar */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-foreground mb-1">
              {productoEditando ? "Editar Producto" : "Registrar Nuevo Producto"}
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Completa los detalles de la referencia para guardarla en la base de datos.
            </p>

            {errorModal && (
              <div className="p-3 mb-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
                {errorModal}
              </div>
            )}

            <form onSubmit={guardarProducto} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">Código *</label>
                  <input
                    type="text"
                    required
                    value={form.codigo_producto}
                    onChange={(e) => setForm({ ...form, codigo_producto: e.target.value })}
                    className="w-full px-3 py-2 bg-muted rounded-lg text-xs outline-none border border-transparent focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">Categoría</label>
                  <select
                    value={form.fk_producto_id_categoria}
                    onChange={(e) => setForm({ ...form, fk_producto_id_categoria: e.target.value })}
                    className="w-full px-3 py-2 bg-muted rounded-lg text-xs outline-none border border-transparent focus:border-blue-500"
                  >
                    <option value={1}>Lácteos y Derivados</option>
                    <option value={2}>Cárnicos</option>
                    <option value={3}>Abarrotes</option>
                    <option value={4}>Bebidas</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground block mb-1">Nombre del Producto *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Queso Campesino 500g"
                  value={form.nombre_producto}
                  onChange={(e) => setForm({ ...form, nombre_producto: e.target.value })}
                  className="w-full px-3 py-2 bg-muted rounded-lg text-xs outline-none border border-transparent focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">Costo ($) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="any"
                    value={form.costo_produccion}
                    onChange={(e) => setForm({ ...form, costo_produccion: e.target.value })}
                    className="w-full px-3 py-2 bg-muted rounded-lg text-xs outline-none border border-transparent focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">Precio Venta ($) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="any"
                    value={form.precio_venta}
                    onChange={(e) => setForm({ ...form, precio_venta: e.target.value })}
                    className="w-full px-3 py-2 bg-muted rounded-lg text-xs outline-none border border-transparent focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">Stock Inicial</label>
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full px-3 py-2 bg-muted rounded-lg text-xs outline-none border border-transparent focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">Fecha Producción</label>
                  <input
                    type="date"
                    value={form.fecha_produccion}
                    onChange={(e) => setForm({ ...form, fecha_produccion: e.target.value })}
                    className="w-full px-3 py-2 bg-muted rounded-lg text-xs outline-none border border-transparent focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">Fecha Vencimiento</label>
                  <input
                    type="date"
                    value={form.fecha_vencimiento}
                    onChange={(e) => setForm({ ...form, fecha_vencimiento: e.target.value })}
                    className="w-full px-3 py-2 bg-muted rounded-lg text-xs outline-none border border-transparent focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border mt-4">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="px-4 py-2 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardando}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  {guardando ? "Guardando..." : "Guardar Producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
