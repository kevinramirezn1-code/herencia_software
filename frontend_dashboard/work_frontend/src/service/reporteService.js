import axiosClient from "./axiosClient";
import axios from "axios";

const reporteService = {
  obtenerReporteInventario: () => axiosClient.get("/reportes/inventario"),
  descargarReporteInventarioPDF: async () => {
    const token = localStorage.getItem("token");
    const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
    const response = await axios.get(`${baseURL}/reportes/inventario/pdf`, {
      responseType: "blob",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Reporte-Inventario-${new Date().toISOString().slice(0, 10)}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export default reporteService;
