import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ChevronRight, ChevronDown, LogOut } from "lucide-react";
import { navSections } from "../../config/navSections";
import { useAuth } from "../../context/AuthContext";

export function Sidebar({ collapsed, onCollapse }) {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Iniciales para el avatar, a partir del nombre real del usuario logueado
  const iniciales = usuario
    ? `${usuario.nombre_usuario?.[0] ?? ""}${usuario.apellido_usuario?.[0] ?? ""}`.toUpperCase()
    : "??";

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 flex flex-col transition-all duration-300 ${
        collapsed ? "w-16" : "w-60"
      }`}
      style={{ background: "var(--sidebar)", borderRight: "1px solid var(--sidebar-border)" }}
    >
      {/* Marca */}
      <div
        className="flex items-center gap-3 px-4 py-5 border-b"
        style={{ borderColor: "var(--sidebar-border)" }}
      >
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0 text-white text-sm font-bold shadow-sm">
          HP
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold leading-tight truncate">
              Herencia de Papá
            </p>
            <p className="text-[11px] leading-tight text-slate-400">
              Sistema ERP
            </p>
          </div>
        )}
        <button
          onClick={onCollapse}
          className="ml-auto p-1 rounded hover:bg-white/10 transition-colors text-slate-400 hover:text-white flex-shrink-0"
        >
          {collapsed ? (
            <ChevronRight size={14} />
          ) : (
            <ChevronDown size={14} style={{ transform: "rotate(-90deg)" }} />
          )}
        </button>
      </div>
      
      {/* Navegación */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-5">
        {navSections.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <p
                className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: "rgba(148,163,184,0.6)" }}
              >
                {section.label}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    end={item.path === ""}
                    title={collapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      `w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-slate-400 hover:bg-white/8 hover:text-slate-200"
                      } ${collapsed ? "justify-center" : ""}`
                    }
                  >
                    <Icon size={16} className="flex-shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Sesión */}
      <div className="p-3 border-t" style={{ borderColor: "var(--sidebar-border)" }}>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm text-slate-400 hover:bg-red-500/15 hover:text-red-400 transition-colors ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut size={16} />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
        {!collapsed && (
          <div className="mt-3 flex items-center gap-2 px-2">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
              {iniciales}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-300 truncate">
                {usuario ? `${usuario.nombre_usuario} ${usuario.apellido_usuario}` : "Usuario"}
              </p>
              <p className="text-[10px] truncate" style={{ color: "var(--sidebar-foreground)" }}>
                {usuario?.rol?.nombre_rol ?? "—"}
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
