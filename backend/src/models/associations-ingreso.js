import IngresoMercancia from "./ingresoMercancia.model.js";
import DetIngreso from "./detIngreso.model.js";
import SalidaMercancia from "./SalidaMercanciaModel.js";
import DetlSalida from "./DetlSalidaModel.js";
import Producto from "./ProductModels.js";

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

export {
  IngresoMercancia,
  DetIngreso,
  SalidaMercancia,
  DetlSalida,
  Producto,
};