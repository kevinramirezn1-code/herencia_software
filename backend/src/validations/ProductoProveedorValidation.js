import { body, param } from "express-validator";

export const asociarProductoProveedorValidation = [
    param("id_proveedor")
        .notEmpty().withMessage("El id del proveedor es obligatorio")
        .isInt({ min: 1 }).withMessage("El id del proveedor debe ser un entero positivo"),

    body("fk_producto_proveedor_id_producto")
        .notEmpty().withMessage("El id del producto es obligatorio")
        .isInt({ min: 1 }).withMessage("El id del producto debe ser un entero positivo"),

    body("precio_compra")
        .notEmpty().withMessage("El precio de compra es obligatorio")
        .isFloat({ min: 0.01 }).withMessage("El precio de compra debe ser mayor a 0"),
];

export const actualizarPrecioCompraValidation = [
    param("id_proveedor_producto")
        .notEmpty().withMessage("El id de la asociación es obligatorio")
        .isInt({ min: 1 }).withMessage("El id de la asociación debe ser un entero positivo"),

    body("precio_compra")
        .notEmpty().withMessage("El precio de compra es obligatorio")
        .isFloat({ min: 0.01 }).withMessage("El precio de compra debe ser mayor a 0"),
];

export const obtenerProductosDeProveedorValidation = [
    param("id_proveedor")
        .notEmpty().withMessage("El id del proveedor es obligatorio")
        .isInt({ min: 1 }).withMessage("El id del proveedor debe ser un entero positivo"),
];

export const obtenerProveedoresDeProductoValidation = [
    param("id_producto")
        .notEmpty().withMessage("El id del producto es obligatorio")
        .isInt({ min: 1 }).withMessage("El id del producto debe ser un entero positivo"),
];

export const eliminarAsociacionValidation = [
    param("id_proveedor_producto")
        .notEmpty().withMessage("El id de la asociación es obligatorio")
        .isInt({ min: 1 }).withMessage("El id de la asociación debe ser un entero positivo"),
];