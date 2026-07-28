import { body, param } from "express-validator";

export const crearProveedorValidation = [
    body("nit")
        .notEmpty().withMessage("El NIT es obligatorio")
        .isLength({ max: 20 }).withMessage("El NIT no puede exceder los 20 caracteres")
        .matches(/^\d{5,10}-?\d?$/).withMessage("El NIT debe tener un formato válido (ej. 900123456-7)"),

    body("razon_social")
        .notEmpty().withMessage("La razón social es obligatoria")
        .isLength({ max: 100 }).withMessage("La razón social no puede exceder los 100 caracteres"),

    body("telefono_proveedor")
        .notEmpty().withMessage("El teléfono del proveedor es obligatorio")
        .isLength({ max: 45 }).withMessage("El teléfono no puede exceder los 45 caracteres")
        .matches(/^[0-9+\-\s()]+$/).withMessage("El teléfono solo puede contener números, espacios, +, - y paréntesis"),

    body("direccion")
        .notEmpty().withMessage("La dirección es obligatoria")
        .isLength({ max: 45 }).withMessage("La dirección no puede exceder los 45 caracteres"),

    body("ciudad")
        .optional({ nullable: true })
        .isLength({ max: 45 }).withMessage("La ciudad no puede exceder los 45 caracteres"),
];

export const actualizarProveedorValidation = [
    param("id_proveedor")
        .notEmpty().withMessage("El id del proveedor es obligatorio")
        .isInt({ min: 1 }).withMessage("El id del proveedor debe ser un entero positivo"),

    body("nit")
        .optional()
        .isLength({ max: 20 }).withMessage("El NIT no puede exceder los 20 caracteres")
        .matches(/^\d{5,10}-?\d?$/).withMessage("El NIT debe tener un formato válido (ej. 900123456-7)"),

    body("razon_social")
        .optional()
        .notEmpty().withMessage("La razón social no puede estar vacía")
        .isLength({ max: 100 }).withMessage("La razón social no puede exceder los 100 caracteres"),

    body("telefono_proveedor")
        .optional()
        .notEmpty().withMessage("El teléfono no puede estar vacío")
        .isLength({ max: 45 }).withMessage("El teléfono no puede exceder los 45 caracteres")
        .matches(/^[0-9+\-\s()]+$/).withMessage("El teléfono solo puede contener números, espacios, +, - y paréntesis"),

    body("direccion")
        .optional()
        .notEmpty().withMessage("La dirección no puede estar vacía")
        .isLength({ max: 45 }).withMessage("La dirección no puede exceder los 45 caracteres"),

    body("ciudad")
        .optional({ nullable: true })
        .isLength({ max: 45 }).withMessage("La ciudad no puede exceder los 45 caracteres"),
];

export const obtenerProveedorValidation = [
    param("id_proveedor")
        .notEmpty().withMessage("El id del proveedor es obligatorio")
        .isInt({ min: 1 }).withMessage("El id del proveedor debe ser un entero positivo"),
];

export const eliminarProveedorValidation = [
    param("id_proveedor")
        .notEmpty().withMessage("El id del proveedor es obligatorio")
        .isInt({ min: 1 }).withMessage("El id del proveedor debe ser un entero positivo"),
];