import IngresoMercancia from "./ingresoMercancia.model.js";
import DetIngreso from "./detIngreso.model.js";
import SalidaMercancia from "./SalidaMercanciaModel.js";
import DetlSalida from "./DetlSalidaModel.js";
import Producto from "./ProductModels.js";
import Venta from "./VentaModel.js";
import DetVenta from "./DetVentaModel.js";
import Cliente from "./clienteModel.js";
import Usuario from "./UsuariosModels.js";
import Proveedor from "./ProovedorModel.js";
import ProductoProveedor from "./Producto-ProovedorModel.js";
import Lote from "./loteModel.js";
import DetVentaLote from "./DetVentaLoteModel.js";

// --- Relaciones: Ingreso <-> Detalle ---
IngresoMercancia.hasMany(DetIngreso, {
  foreignKey: "fk_det_entrada_id_entrada",
  as: "detalles",
});

DetIngreso.belongsTo(IngresoMercancia, {
  foreignKey: "fk_det_entrada_id_entrada",
  as: "entrada",
});

DetIngreso.belongsTo(Producto, {
  foreignKey: "fk_det_entrada_id_producto",
  as: "producto",
});

Producto.hasMany(DetIngreso, {
  foreignKey: "fk_det_entrada_id_producto",
  as: "detalles_ingreso",
});

// --- Relaciones: Salida <-> Detalle ---
SalidaMercancia.hasMany(DetlSalida, {
  foreignKey: "fk_det_salida_id_salida",
  as: "detalles",
});

DetlSalida.belongsTo(SalidaMercancia, {
  foreignKey: "fk_det_salida_id_salida",
  as: "salida",
});

DetlSalida.belongsTo(Producto, {
  foreignKey: "fk_det_salida_id_producto",
  as: "producto",
});

Producto.hasMany(DetlSalida, {
  foreignKey: "fk_det_salida_id_producto",
  as: "detalles_salida",
});

// --- Relaciones: Venta <-> Detalle ---
Venta.hasMany(DetVenta, {
  foreignKey: "fk_det_venta_id_venta",
  as: "detalles_venta",
});

DetVenta.belongsTo(Venta, {
  foreignKey: "fk_det_venta_id_venta",
  as: "venta",
});

DetVenta.belongsTo(Producto, {
  foreignKey: "fk_det_venta_id_producto",
  as: "producto",
});

Producto.hasMany(DetVenta, {
  foreignKey: "fk_det_venta_id_producto",
  as: "detalles_venta",
});


// --- Relación: Venta <-> Cliente ---
Venta.belongsTo(Cliente, {
  foreignKey: "fk_venta_id_cliente",
  as: "cliente",
});

Cliente.hasMany(Venta, {
  foreignKey: "fk_venta_id_cliente",
  as: "ventas",
});

// --- Relación: Venta <-> Usuario ---
Venta.belongsTo(Usuario, {
  foreignKey: "fk_venta_id_usuario",
  as: "usuario",
});

Usuario.hasMany(Venta, {
  foreignKey: "fk_venta_id_usuario",
  as: "ventas",
});

// --- Relación: Proveedor <-> ProductoProveedor ---
Proveedor.hasMany(ProductoProveedor, {
  foreignKey: "fk_producto_proveedor_id_proveedor",
  as: "productos_proveedor",
});

ProductoProveedor.belongsTo(Proveedor, {
  foreignKey: "fk_producto_proveedor_id_proveedor",
  as: "proveedor",
});

// --- Relación: Producto <-> ProductoProveedor ---
Producto.hasMany(ProductoProveedor, {
  foreignKey: "fk_producto_proveedor_id_producto",
  as: "proveedores_producto",
});

ProductoProveedor.belongsTo(Producto, {
  foreignKey: "fk_producto_proveedor_id_producto",
  as: "producto",
});

// Relación: un producto tiene muchos lotes, cada lote pertenece a un producto
Lote.belongsTo(Producto, { foreignKey: 'fk_lote_id_producto', as: 'producto' });
Producto.hasMany(Lote, { foreignKey: 'fk_lote_id_producto', as: 'lotes' });

//relaciones lotes con detalle venta

DetVenta.hasMany(DetVentaLote, { foreignKey: 'fk_det_venta_lote_id_detalleventa', as: 'lotes_consumidos' });
DetVentaLote.belongsTo(DetVenta, { foreignKey: 'fk_det_venta_lote_id_detalleventa', as: 'detalle_venta' });

Lote.hasMany(DetVentaLote, { foreignKey: 'fk_det_venta_lote_id_lote', as: 'ventas' });
DetVentaLote.belongsTo(Lote, { foreignKey: 'fk_det_venta_lote_id_lote', as: 'lote' });


export {
  IngresoMercancia,
  DetIngreso,
  SalidaMercancia,
  DetlSalida,
  Producto,
  Venta,
  DetVenta,
  Cliente,
  Usuario,
  Proveedor,
  ProductoProveedor,
  Lote,
  DetVentaLote,
};