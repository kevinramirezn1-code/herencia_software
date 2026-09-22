import axiosClient from "./axiosClient";
import axios from "axios";

const ventaService = {
  listarVentas: (params = {}) => axiosClient.get("/ventas/ventas", { params }),
  obtenerPorId: (id) => axiosClient.get(`/ventas/ventas/${id}`),
  obtenerPorCodigo: (numeroVenta) => axiosClient.get(`/ventas/ventas/codigo/${numeroVenta}`),
  crearVenta: (datos) => axiosClient.post("/ventas/ventas", datos),
  recalcular: (id) => axiosClient.patch(`/ventas/ventas/${id}/recalcular`),
  descargarFacturaPDF: async (idVenta, numeroVenta = "factura") => {
    const token = localStorage.getItem("token");
    const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
    const response = await axios.get(`${baseURL}/ventas/ventas/${idVenta}/factura-pdf`, {
      responseType: "blob",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Factura-${numeroVenta}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export default ventaService;
