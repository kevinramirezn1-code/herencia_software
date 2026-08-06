import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute() {
  const { usuario, cargando } = useAuth();

  // Mientras se revisa localStorage al cargar la app, no decidimos nada todavía
  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Cargando...
      </div>
    );
  }

  if (!usuario) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
