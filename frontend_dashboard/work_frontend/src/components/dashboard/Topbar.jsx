import { useState, useEffect, useRef } from "react";
import { Menu, Search, Bell, ChevronDown, AlertTriangle, AlertCircle, Clock, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import notificacionService from "../../service/notificacionService";

export function Topbar({ title, subtitle, onMenuClick }) {
  const [searchVal, setSearchVal] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificaciones, setNotificaciones] = useState({
    stockMinimo: [],
    proximosVencer: [],
    agotados: [],
  });
  const [cargandoNotif, setCargandoNotif] = useState(false);
  const notifRef = useRef(null);
  const { usuario } = useAuth();

  const iniciales = usuario
    ? `${usuario.nombre_usuario?.[0] ?? ""}${usuario.apellido_usuario?.[0] ?? ""}`.toUpperCase()
    : "??";

  const totalAlertas =
    (notificaciones.stockMinimo?.length || 0) +
    (notificaciones.proximosVencer?.length || 0) +
    (notificaciones.agotados?.length || 0);

  useEffect(() => {
    const cargarNotificaciones = async () => {
      setCargandoNotif(true);
      try {
        const datos = await notificacionService.obtenerTodas();
        setNotificaciones(datos);
      } catch (err) {
        console.error("Error al cargar notificaciones:", err);
      } finally {
        setCargandoNotif(false);
      }
    };

    cargarNotificaciones();
    // Refrescar cada 60s
    const timer = setInterval(cargarNotificaciones, 60000);
    return () => clearInterval(timer);
  }, []);

  // Cerrar popup al hacer click afuera
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex items-center gap-4 px-6 py-4 bg-card border-b border-border relative">
      <button onClick={onMenuClick} className="md:hidden p-1.5 rounded-lg hover:bg-muted transition-colors">
        <Menu size={18} />
      </button>

      <div className="flex-1 min-w-0">
        <h1 className="text-base font-semibold text-foreground leading-none">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>

      <div className="hidden md:flex items-center gap-2 bg-muted rounded-lg px-3 py-2 w-56">
        <Search size={14} className="text-muted-foreground flex-shrink-0" />
        <input
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          placeholder="Buscar..."
          className="bg-transparent text-sm outline-none w-full text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Botón y Popover de Notificaciones */}
      <div className="relative" ref={notifRef}>
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
          title="Notificaciones"
        >
          <Bell size={18} />
          {totalAlertas > 0 && (
            <span className="absolute top-1 right-1 min-w-4 h-4 px-1 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
              {totalAlertas}
            </span>
          )}
        </button>

        {showNotifications && (
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden text-card-foreground animate-in fade-in-50">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/40">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-blue-600" />
                <h3 className="text-sm font-semibold">Alertas de Inventario</h3>
              </div>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-border p-2 space-y-1">
              {cargandoNotif ? (
                <p className="text-xs text-muted-foreground text-center py-6">Cargando alertas...</p>
              ) : totalAlertas === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-xs">Todo en orden. No hay alertas pendientes.</p>
                </div>
              ) : (
                <>
                  {/* Agotados */}
                  {notificaciones.agotados?.map((item, idx) => (
                    <div key={`ag-${idx}`} className="flex items-start gap-2.5 p-2 rounded-lg bg-red-50/60 dark:bg-red-950/30">
                      <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
                      <div className="text-xs min-w-0">
                        <p className="font-semibold text-red-700 dark:text-red-400 truncate">
                          {item.nombre_producto || "Producto agotado"}
                        </p>
                        <p className="text-muted-foreground text-[11px]">Stock en 0 unidades</p>
                      </div>
                    </div>
                  ))}

                  {/* Stock Mínimo */}
                  {notificaciones.stockMinimo?.map((item, idx) => (
                    <div key={`sm-${idx}`} className="flex items-start gap-2.5 p-2 rounded-lg bg-amber-50/60 dark:bg-amber-950/30">
                      <AlertTriangle size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
                      <div className="text-xs min-w-0">
                        <p className="font-semibold text-amber-700 dark:text-amber-400 truncate">
                          {item.nombre_producto || "Stock bajo"}
                        </p>
                        <p className="text-muted-foreground text-[11px]">
                          Quedan {item.stock} unidades (mínimo recomendado)
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Próximos a vencer */}
                  {notificaciones.proximosVencer?.map((item, idx) => (
                    <div key={`pv-${idx}`} className="flex items-start gap-2.5 p-2 rounded-lg bg-blue-50/60 dark:bg-blue-950/30">
                      <Clock size={15} className="text-blue-500 flex-shrink-0 mt-0.5" />
                      <div className="text-xs min-w-0">
                        <p className="font-semibold text-blue-700 dark:text-blue-400 truncate">
                          {item.nombre_producto || "Próximo a vencer"}
                        </p>
                        <p className="text-muted-foreground text-[11px]">
                          Vence: {item.fecha_vencimiento ? new Date(item.fecha_vencimiento).toLocaleDateString("es-CO") : "Pronto"}
                        </p>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 pl-2 border-l border-border">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
          {iniciales}
        </div>
        <div className="hidden md:block">
          <p className="text-xs font-medium leading-none">{usuario?.nombre_usuario ?? "Usuario"}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{usuario?.rol?.nombre_rol ?? "—"}</p>
        </div>
        <ChevronDown size={14} className="text-muted-foreground hidden md:block" />
      </div>
    </header>
  );
}
