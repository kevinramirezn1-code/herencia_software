import IngresoMercancia from "./ingresoMercancia.model.js";
import DetIngreso from "./detIngreso.model.js";
import Producto from "./ProductModels.js";

// Relaciones
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

export {
  IngresoMercancia,
  DetIngreso,
  Producto,
};