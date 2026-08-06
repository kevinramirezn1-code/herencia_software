import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "../components/dashboard/Sidebar";
import { Topbar } from "../components/dashboard/Topbar";
import { navSections } from "../config/navSections";

// Busca en la config de navegación el label del módulo activo según la URL actual
function useCurrentTitle() {
  const { pathname } = useLocation();
  const segment = pathname.replace(/^\/dashboard\/?/, "");
  for (const section of navSections) {
    const found = section.items.find((item) => item.path === segment);
    if (found) return found.label;
  }
  return "Dashboard";
}

export function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const title = useCurrentTitle();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar collapsed={collapsed} onCollapse={() => setCollapsed((c) => !c)} />
      <div className={`transition-all duration-300 ${collapsed ? "pl-16" : "pl-60"}`}>
        <Topbar title={title} />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
