import { useState, useEffect } from "react";
import {
  Truck, Plus, Search, RefreshCw, Trash2, Edit, CheckCircle, RotateCcw,
  Phone, MapPin, Building, Package, Link2, X
} from "lucide-react";
import proveedorService from "../service/proveedorService";
import productoService from "../service/productoService";

export default function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [proveedorEditando, setProveedorEditando] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [errorModal, setErrorModal] = useState("");

  // Modal para ver/asociar productos
  const [modalAsociacion, setModalAsociacion] = useState(false);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [productosProveedor, setProductosProveedor] = useState([]);
  const [todosProductos, setTodosProductos] = useState([]);
  const [formAsociacion, setFormAsociacion] = useState({ id_producto: "", precio_compra: "" });

  const [form, setForm] = useState({
    nit: "",
    razon_social: "",
    telefono_proveedor: "",
    direccion: "",
    ciudad: "",
  });

  const cargarProveedores = async () => {
    setCargando(true);
    try {
      const res = await proveedorService.obtenerTodos();
      const pData = res?.data;
      setProveedores(Array.isArray(pData) ? pData : pData?.proveedores || []);
    } catch (err) {
      console.error("Error al cargar proveedores:", err);
      setProveedores([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarProveedores();
  }, []);

  const abrirModalNuevo = () => {
    setProveedorEditando(null);
    setErrorModal("");
    setForm({
      nit: "",
      razon_social: "",
      telefono_proveedor: "",
      direccion: "",
      ciudad: "Cali",
    });
    setModalAbierto(true);
  };

  const abrirModalEditar = (prov) => {
    setProveedorEditando(prov);
    setErrorModal("");
    setForm({
      nit: prov.nit || "",
      razon_social: prov.razon_social || "",
      telefono_proveedor: prov.telefono_proveedor || "",
      direccion: prov.direccion || "",
      ciudad: prov.ciudad || "",
    });
    setModalAbierto(true);
  };

  const guardarProveedor = async (e) => {
    e.preventDefault();
    setErrorModal("");
    setGuardando(true);

    try {
      const payload = {
        ...form,
        nit: Number(form.nit) || form.nit,
      };

      if (proveedorEditando) {
        await proveedorService.actualizar(proveedorEditando.id_proveedor || proveedorEditando.id, payload);
      } else {
        await proveedorService.crear(payload);
      }

      setModalAbierto(false);
      cargarProveedores();
    } catch (err) {
      setErrorModal(err.mensaje || "Error al guardar el proveedor.");
    } finally {
      setGuardando(false);
    }
  };

  const eliminarProveedor = async (id) => {
    if (!window.confirm("¿Seguro que deseas desactivar este proveedor?")) return;
    try {
      await proveedorService.eliminar(id);
      cargarProveedores();
    } catch (err) {
      alert(err.mensaje || "Error al eliminar proveedor.");
    }
  };

  const abrirAsociaciones = async (prov) => {
    setProveedorSeleccionado(prov);
    setModalAsociacion(true);
    try {
      const [resProdProv, resTodos] = await Promise.all([
        proveedorService.obtenerProductosDeProveedor(prov.id_proveedor || prov.id),
        productoService.obtenerTodos(),
      ]);
      const ppData = resProdProv?.data;
      const tData = resTodos?.data;
      const arrPP = Array.isArray(ppData) ? ppData : ppData?.productos || [];
      const arrTodos = Array.isArray(tData) ? tData : tData?.productos || [];

      setProductosProveedor(arrPP);
      setTodosProductos(arrTodos);
      if (arrTodos.length > 0) {
        setFormAsociacion({
          id_producto: arrTodos[0].id_producto || arrTodos[0].id,
          precio_compra: "",
        });
      }
    } catch (err) {
      console.error("Error al cargar productos de proveedor:", err);
    }
  };

  const agregarAsociacion = async (e) => {
    e.preventDefault();
    if (!proveedorSeleccionado || !formAsociacion.id_producto || !formAsociacion.precio_compra) return;

    try {
      await proveedorService.asociarProducto(
        proveedorSeleccionado.id_proveedor || proveedorSeleccionado.id,
        {
          fk_producto_proveedor_id_producto: Number(formAsociacion.id_producto),
          precio_compra: Number(formAsociacion.precio_compra),
        }
      );
      // Recargar asociados
      const res = await proveedorService.obtenerProductosDeProveedor(
        proveedorSeleccionado.id_proveedor || proveedorSeleccionado.id
      );
      const ppData = res?.data;
      setProductosProveedor(Array.isArray(ppData) ? ppData : ppData?.productos || []);
      setFormAsociacion({ ...formAsociacion, precio_compra: "" });
    } catch (err) {
      alert(err.mensaje || "Error al asociar producto.");
    }
  };

  const listaProveedores = Array.isArray(proveedores) ? proveedores : [];
  const proveedoresFiltrados = listaProveedores.filter((p) => {
    const term = busqueda.toLowerCase();
    return (
      p.razon_social?.toLowerCase().includes(term) ||
      String(p.nit || "").toLowerCase().includes(term) ||
      p.ciudad?.toLowerCase().includes(term)
    );
  });

  const fmt = (n) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n || 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Directorio de Proveedores</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Gestiona información de contacto y catálogos de compra con tus proveedores.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={cargarProveedores}
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
            Nuevo Proveedor
          </button>
        </div>
      </div>

      {/* Buscador */}
      <div className="flex items-center gap-2 bg-card border border-border rounded-xl p-3 shadow-sm max-w-md">
        <Search size={16} className="text-muted-foreground flex-shrink-0" />
        <input
          type="text"
          placeholder="Buscar por NIT, nombre o ciudad..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="bg-transparent text-sm outline-none w-full text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Grid de Proveedores */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {cargando ? (
          <div className="col-span-full text-center py-12 text-muted-foreground text-xs">
            Cargando proveedores...
          </div>
        ) : proveedoresFiltrados.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground text-xs">
            No se encontraron proveedores registrados.
          </div>
        ) : (
          proveedoresFiltrados.map((p) => {
            const id = p.id_proveedor || p.id;
            return (
              <div
                key={id}
                className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                      <Truck size={20} />
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => abrirAsociaciones(p)}
                        className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-blue-600 transition-colors"
                        title="Ver / Asociar productos"
                      >
                        <Link2 size={15} />
                      </button>
                      <button
                        onClick={() => abrirModalEditar(p)}
                        className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-blue-600 transition-colors"
                        title="Editar"
                      >
                        <Edit size={15} />
                      </button>
                      <button
                        onClick={() => eliminarProveedor(id)}
                        className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-red-500 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-semibold text-foreground text-base leading-snug">{p.razon_social}</h3>
                  <p className="text-xs font-mono text-muted-foreground mt-0.5">NIT: {p.nit}</p>

                  <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Phone size={13} className="text-slate-400" />
                      <span>{p.telefono_proveedor || "Sin teléfono"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className="text-slate-400" />
                      <span>{p.direccion ? `${p.direccion}, ${p.ciudad || ""}` : p.ciudad || "Sin dirección"}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-border flex items-center justify-between">
                  <button
                    onClick={() => abrirAsociaciones(p)}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1.5"
                  >
                    <Package size={13} />
                    Catálogo de Productos
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Crear / Editar Proveedor */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-foreground mb-1">
              {proveedorEditando ? "Editar Proveedor" : "Registrar Nuevo Proveedor"}
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Ingresa los datos comerciales del proveedor.
            </p>

            {errorModal && (
              <div className="p-3 mb-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
                {errorModal}
              </div>
            )}

            <form onSubmit={guardarProveedor} className="space-y-3.5">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">NIT / Identificación *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. 900123456-1"
                  value={form.nit}
                  onChange={(e) => setForm({ ...form, nit: e.target.value })}
                  className="w-full px-3 py-2 bg-muted rounded-lg text-xs outline-none border border-transparent focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground block mb-1">Razón Social *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Distribuidora del Valle S.A.S."
                  value={form.razon_social}
                  onChange={(e) => setForm({ ...form, razon_social: e.target.value })}
                  className="w-full px-3 py-2 bg-muted rounded-lg text-xs outline-none border border-transparent focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">Teléfono</label>
                  <input
                    type="tel"
                    placeholder="3101234567"
                    value={form.telefono_proveedor}
                    onChange={(e) => setForm({ ...form, telefono_proveedor: e.target.value })}
                    className="w-full px-3 py-2 bg-muted rounded-lg text-xs outline-none border border-transparent focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">Ciudad</label>
                  <input
                    type="text"
                    placeholder="Cali"
                    value={form.ciudad}
                    onChange={(e) => setForm({ ...form, ciudad: e.target.value })}
                    className="w-full px-3 py-2 bg-muted rounded-lg text-xs outline-none border border-transparent focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground block mb-1">Dirección</label>
                <input
                  type="text"
                  placeholder="Calle 10 # 5-20"
                  value={form.direccion}
                  onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                  className="w-full px-3 py-2 bg-muted rounded-lg text-xs outline-none border border-transparent focus:border-blue-500"
                />
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
                  {guardando ? "Guardando..." : "Guardar Proveedor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Asociar Productos */}
      {modalAsociacion && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Catálogo: {proveedorSeleccionado?.razon_social}
                </h3>
                <p className="text-xs text-muted-foreground">Productos y precios de compra pactados.</p>
              </div>
              <button
                onClick={() => setModalAsociacion(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>

            {/* Formulario para agregar producto al proveedor */}
            <form onSubmit={agregarAsociacion} className="p-3 bg-muted/40 rounded-xl border border-border mb-4 space-y-2">
              <p className="text-xs font-semibold text-foreground">Vincular Producto</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <select
                  value={formAsociacion.id_producto}
                  onChange={(e) => setFormAsociacion({ ...formAsociacion, id_producto: e.target.value })}
                  className="px-2.5 py-1.5 bg-card rounded-lg text-xs outline-none border border-border"
                >
                  {todosProductos.map((prod) => (
                    <option key={prod.id_producto || prod.id} value={prod.id_producto || prod.id}>
                      {prod.codigo_producto} - {prod.nombre_producto}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  required
                  min="0"
                  step="any"
                  placeholder="Precio de compra ($)"
                  value={formAsociacion.precio_compra}
                  onChange={(e) => setFormAsociacion({ ...formAsociacion, precio_compra: e.target.value })}
                  className="px-2.5 py-1.5 bg-card rounded-lg text-xs outline-none border border-border"
                />
              </div>
              <button
                type="submit"
                className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                + Vincular al Proveedor
              </button>
            </form>

            {/* Listado de Productos asociados */}
            <div className="max-h-60 overflow-y-auto space-y-1.5 divide-y divide-border">
              {productosProveedor.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">
                  No hay productos vinculados a este proveedor aún.
                </p>
              ) : (
                productosProveedor.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 text-xs">
                    <div>
                      <p className="font-semibold text-foreground">{item.nombre_producto || `Producto #${item.fk_producto_proveedor_id_producto}`}</p>
                      <p className="text-muted-foreground font-mono text-[11px]">Código: {item.codigo_producto || "—"}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">{fmt(item.precio_compra || item.ProductoProveedor?.precio_compra)}</p>
                      <p className="text-[10px] text-muted-foreground">Precio compra pactado</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
