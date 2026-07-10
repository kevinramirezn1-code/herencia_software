import { body } from "express-validator";

/**
 * Reglas de validación para POST /api/ingresos-mercancia
 */
export const registrarEntradaValidation = [
  body("codigo_entrada")
    .exists({ checkFalsy: true })
    .withMessage("codigo_entrada es obligatorio")
    .isString()
    .withMessage("codigo_entrada debe ser texto"),

  body("observacion")
    .optional({ nullable: true })
    .isString()
    .withMessage("observacion debe ser texto"),

  body("detalles")
    .isArray({ min: 1 })
    .withMessage("detalles debe ser un arreglo con al menos un producto"),

  body("detalles.*.fk_det_entrada_id_producto")
    .exists()
    .withMessage("fk_det_entrada_id_producto es obligatorio")
    .isInt({ gt: 0 })
    .withMessage("fk_det_entrada_id_producto debe ser un id válido"),

  body("detalles.*.cantidad")
    .exists()
    .withMessage("cantidad es obligatoria")
    .isFloat({ gt: 0 })
    .withMessage("cantidad debe ser mayor a 0"),

  body("detalles.*.precio_unitario")
    .exists()
    .withMessage("precio_unitario es obligatorio")
    .isFloat({ min: 0 })
    .withMessage("precio_unitario no puede ser negativo"),

  body("detalles.*.iva")
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage("iva no puede ser negativo"),
];