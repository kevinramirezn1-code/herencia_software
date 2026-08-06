import { useState } from "react";
import { Menu, Search, Bell, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export function Topbar({ title, subtitle, onMenuClick }) {
  const [searchVal, setSearchVal] = useState("");
  const { usuario } = useAuth();

  const iniciales = usuario
    ? `${usuario.nombre_usuario?.[0] ?? ""}${usuario.apellido_usuario?.[0] ?? ""}`.toUpperCase()
    : "??";

  return (
    <header className="flex items-center gap-4 px-6 py-4 bg-card border-b border-border">
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
      <button className="relative p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
        <Bell size={18} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
      </button>
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
