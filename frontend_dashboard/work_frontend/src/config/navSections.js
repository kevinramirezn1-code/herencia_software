import {
  LayoutDashboard, Package, Tags, Award, ArrowLeftRight,
  ShoppingCart, TrendingUp, Users, Truck, Wallet,
  ArrowUpCircle, ArrowDownCircle, BookOpen, FileText,
  BarChart3, UserCog, Settings, ShoppingBag,
} from "lucide-react";

// Cada item define su ruta (path) dentro de /dashboard/*.
// Por ahora solo "dashboard" tiene una página real; el resto
// muestra un placeholder "Próximamente" hasta que construyamos ese módulo.
export const navSections = [
  {
    label: "Principal",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "" },
    ],
  },
  {
    label: "Inventario",
    items: [
      { id: "inventario", label: "Inventario", icon: Package, path: "inventario" },
      { id: "productos", label: "Productos", icon: ShoppingBag, path: "productos" },
      { id: "categorias", label: "Categorías", icon: Tags, path: "categorias" },
      { id: "marcas", label: "Marcas", icon: Award, path: "marcas" },
      { id: "movimientos", label: "Movimientos", icon: ArrowLeftRight, path: "movimientos" },
    ],
  },
  {
    label: "Comercial",
    items: [
      { id: "compras", label: "Compras", icon: ShoppingCart, path: "compras" },
      { id: "ventas", label: "Ventas", icon: TrendingUp, path: "ventas" },
      { id: "clientes", label: "Clientes", icon: Users, path: "clientes" },
      { id: "proveedores", label: "Proveedores", icon: Truck, path: "proveedores" },
    ],
  },
  {
    label: "Finanzas",
    items: [
      { id: "caja", label: "Caja", icon: Wallet, path: "caja" },
      { id: "ingresos", label: "Ingresos", icon: ArrowUpCircle, path: "ingresos" },
      { id: "egresos", label: "Egresos", icon: ArrowDownCircle, path: "egresos" },
      { id: "contabilidad", label: "Contabilidad", icon: BookOpen, path: "contabilidad" },
      { id: "facturacion", label: "Facturación", icon: FileText, path: "facturacion" },
    ],
  },
  {
    label: "Sistema",
    items: [
      { id: "reportes", label: "Reportes", icon: BarChart3, path: "reportes" },
      { id: "usuarios", label: "Usuarios", icon: UserCog, path: "usuarios" },
      { id: "configuracion", label: "Configuración", icon: Settings, path: "configuracion" },
    ],
  },
];
