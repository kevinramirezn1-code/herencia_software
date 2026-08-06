import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { Dashboard } from "./pages/Dashboard";
import { ComingSoon } from "./pages/ComingSoon";
import { navSections } from "./config/navSections";
import "./App.css";

// Módulos que todavía no tienen página real: los resolvemos con un placeholder
const modulosPendientes = navSections
  .flatMap((section) => section.items)
  .filter((item) => item.path !== "");

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          {modulosPendientes.map((item) => (
            <Route key={item.id} path={item.path} element={<ComingSoon label={item.label} />} />
          ))}
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
