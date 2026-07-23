import IngresoMercancia from "./ingresoMercancia.model.js";
import DetIngreso from "./detIngreso.model.js";
import SalidaMercancia from "./SalidaMercanciaModel.js";
import DetlSalida from "./DetlSalidaModel.js";
import Producto from "./ProductModels.js";
import Venta from "./VentaModel.js";
import DetVenta from "./DetVentaModel.js";
import Cliente from "./ClienteModel.js";
import Usuario from "./UsuariosModels.js";

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
};