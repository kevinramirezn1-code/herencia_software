import axiosClient from "./axiosClient";

const proveedorService = {
  obtenerTodos: () => axiosClient.get("/proveedores/proveedores"),
  obtenerPorId: (id) => axiosClient.get(`/proveedores/proveedores/${id}`),
  crear: (datos) => axiosClient.post("/proveedores/proveedores", datos),
  actualizar: (id, datos) => axiosClient.patch(`/proveedores/proveedores/${id}`, datos),
  eliminar: (id) => axiosClient.delete(`/proveedores/proveedores/${id}`),
  restaurar: (id) => axiosClient.patch(`/proveedores/proveedores/${id}/restaurar`),
  asociarProducto: (idProveedor, datos) =>
    axiosClient.post(`/proveedores/proveedores/${idProveedor}/productos`, datos),
  obtenerProductosDeProveedor: (idProveedor) =>
    axiosClient.get(`/proveedores/proveedores/${idProveedor}/productos`),
  obtenerProveedoresDeProducto: (idProducto) =>
    axiosClient.get(`/proveedores/productos/${idProducto}/proveedores`),
  actualizarPrecioCompra: (idAsociacion, datos) =>
    axiosClient.patch(`/proveedores/proveedor-producto/${idAsociacion}`, datos),
  eliminarAsociacion: (idAsociacion) =>
    axiosClient.delete(`/proveedores/proveedor-producto/${idAsociacion}`),
};

export default proveedorService;
