import axiosClient from "./axiosClient";

const productoService = {
  obtenerTodos: () => axiosClient.get("/productos"),
  obtenerConStock: () => axiosClient.get("/productos/con-stock"),
  obtenerSinStock: () => axiosClient.get("/productos/sin-stock"),
  obtenerStockBajo: (umbral = 5) => axiosClient.get(`/productos/stock-bajo?umbral=${umbral}`),
  obtenerProximosAVencer: (dias = 30) => axiosClient.get(`/productos/proximos-vencer?dias=${dias}`),
  obtenerPorCodigo: (codigo) => axiosClient.get(`/productos/codigo/${codigo}`),
  obtenerPorId: (id) => axiosClient.get(`/productos/${id}`),
  crear: (datos) => axiosClient.post("/productos", datos),
  actualizar: (id, datos) => axiosClient.put(`/productos/${id}`, datos),
  eliminar: (id) => axiosClient.delete(`/productos/${id}`),
};

export default productoService;
