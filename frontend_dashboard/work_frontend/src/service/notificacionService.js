import axiosClient from "./axiosClient";

const notificacionService = {
  obtenerStockMinimo: () => axiosClient.get("/notificaciones/stock-minimo"),
  obtenerProximosAVencer: () => axiosClient.get("/notificaciones/productos-proximos-vencer"),
  obtenerAgotados: () => axiosClient.get("/notificaciones/productos-agotados"),
  obtenerTodas: async () => {
    try {
      const [stockMinimo, proximosVencer, agotados] = await Promise.allSettled([
        axiosClient.get("/notificaciones/stock-minimo"),
        axiosClient.get("/notificaciones/productos-proximos-vencer"),
        axiosClient.get("/notificaciones/productos-agotados"),
      ]);

      return {
        stockMinimo: stockMinimo.status === "fulfilled" ? stockMinimo.value?.data || [] : [],
        proximosVencer: proximosVencer.status === "fulfilled" ? proximosVencer.value?.data || [] : [],
        agotados: agotados.status === "fulfilled" ? agotados.value?.data || [] : [],
      };
    } catch {
      return { stockMinimo: [], proximosVencer: [], agotados: [] };
    }
  },
};

export default notificacionService;
