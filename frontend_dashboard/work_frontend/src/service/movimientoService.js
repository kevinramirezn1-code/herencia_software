import axiosClient from "./axiosClient";

const movimientoService = {
  // Ingresos de Mercancía
  listarIngresos: () => axiosClient.get("/ingreso-mercancia"),
  obtenerIngresoPorId: (id) => axiosClient.get(`/ingreso-mercancia/${id}`),
  registrarIngreso: (datos) => axiosClient.post("/ingreso-mercancia", datos),

  // Salidas de Mercancía
  listarSalidas: () => axiosClient.get("/salida-mercancia"),
  obtenerSalidaPorId: (id) => axiosClient.get(`/salida-mercancia/${id}`),
  registrarSalida: (datos) => axiosClient.post("/salida-mercancia", datos),
};

export default movimientoService;
