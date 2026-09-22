import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { Dashboard } from "./pages/Dashboard";
import Productos from "./pages/Productos";
import Proveedores from "./pages/Proveedores";
import Movimientos from "./pages/Movimientos";
import Ventas from "./pages/Ventas";
import Reportes from "./pages/Reportes";
import { ComingSoon } from "./pages/ComingSoon";
import { navSections } from "./config/navSections";
import "./App.css";

// Rutas implementadas explícitamente
const rutasImplementadas = [
  "",
  "inventario",
  "productos",
  "proveedores",
  "movimientos",
  "compras",
  "ingresos",
  "egresos",
  "ventas",
  "reportes",
];

// Módulos que todavía no tienen página específica
const modulosPendientes = navSections
  .flatMap((section) => section.items)
  .filter((item) => !rutasImplementadas.includes(item.path));

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="inventario" element={<Productos />} />
          <Route path="productos" element={<Productos />} />
          <Route path="proveedores" element={<Proveedores />} />
          <Route path="movimientos" element={<Movimientos />} />
          <Route path="compras" element={<Movimientos />} />
          <Route path="ingresos" element={<Movimientos />} />
          <Route path="egresos" element={<Movimientos />} />
          <Route path="ventas" element={<Ventas />} />
          <Route path="reportes" element={<Reportes />} />
          {modulosPendientes.map((item) => (
            <Route key={item.id} path={item.path} element={<ComingSoon label={item.label} />} />
          ))}
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
