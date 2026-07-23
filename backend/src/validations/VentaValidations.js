import { body } from "express-validator";

export const crearVentaValidation = [
    body("fecha")
        .notEmpty().withMessage("La fecha es obligatoria")
        .isISO8601().withMessage("La fecha debe tener formato válido (YYYY-MM-DD)"),

    body("fk_venta_id_cliente")
        .optional({ nullable: true })
        .isInt({ min: 1 }).withMessage("El id del cliente debe ser un entero positivo"),

    body("fk_venta_id_usuario")
        .optional({ nullable: true })
        .isInt({ min: 1 }).withMessage("El id del usuario debe ser un entero positivo"),

    body("descuento")
        .optional({ nullable: true })
        .isFloat({ min: 0 }).withMessage("El descuento no puede ser negativo"),

    body("detalles")
        .isArray({ min: 1 }).withMessage("La venta debe incluir al menos un producto"),

    body("detalles.*.fk_det_venta_id_producto")
        .notEmpty().withMessage("Cada detalle debe incluir el id del producto")
        .isInt({ min: 1 }).withMessage("El id del producto debe ser un entero positivo"),

    body("detalles.*.cantidad")
        .notEmpty().withMessage("Cada detalle debe incluir la cantidad")
        .isInt({ min: 1 }).withMessage("La cantidad debe ser un entero mayor a 0"),
];

import { query } from "express-validator";

export const listarVentasValidation = [
    query("pagina")
        .optional()
        .isInt({ min: 1 }).withMessage("La página debe ser un entero positivo"),

    query("limite")
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage("El límite debe estar entre 1 y 100"),

    query("fechaInicio")
        .optional()
        .isISO8601().withMessage("fechaInicio debe tener formato válido (YYYY-MM-DD)"),

    query("fechaFin")
        .optional()
        .isISO8601().withMessage("fechaFin debe tener formato válido (YYYY-MM-DD)"),

    query("fk_venta_id_cliente")
        .optional()
        .isInt({ min: 1 }).withMessage("El id del cliente debe ser un entero positivo"),
];