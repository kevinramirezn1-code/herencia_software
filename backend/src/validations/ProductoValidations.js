import { body, param } from "express-validator";

export const createProductValidation = [

    body('codigo_producto').notEmpty().withMessage('El campo codigo_producto es obligatorio.'),
    body('nombre_producto').notEmpty().withMessage('El campo nombre_producto es obligatorio.'),
    body('fk_producto_id_categoria').notEmpty().withMessage('El campo fk_producto_id_categoria es obligatorio.'),

    body('costo_produccion')
        .notEmpty().withMessage('El campo costo_produccion es obligatorio.')
        .isFloat({ min: 0 }).withMessage('El campo costo_produccion debe ser un número mayor o igual a 0.'),

    body('precio_venta')
        .notEmpty().withMessage('El campo precio_venta es obligatorio.')
        .isFloat({ min: 0 }).withMessage('El campo precio_venta debe ser un número mayor o igual a 0.'),

    body('stock').optional().isInt({ min: 0 }).withMessage('El campo stock debe ser un número entero mayor o igual a 0.'),
    body('iva').optional().isFloat({ min: 0 }).withMessage('El campo iva debe ser un número mayor o igual a 0.'),
    body('fecha_produccion').optional().isISO8601().toDate().withMessage('El campo fecha_produccion debe ser una fecha válida.'),
    body('fecha_vencimiento').optional().isISO8601().toDate().withMessage('El campo fecha_vencimiento debe ser una fecha válida.'),

];

// HU-INV-02: Actualizar producto
// Todos los campos son opcionales (update parcial), EXCEPTO que si vienen, deben ser validos.
export const updateProductValidation = [

    param('id').isInt({ min: 1 }).withMessage('El id del producto debe ser un número entero válido.'),

    body('codigo_producto').optional().notEmpty().withMessage('El campo codigo_producto no puede estar vacío.'),
    body('nombre_producto').optional().notEmpty().withMessage('El campo nombre_producto no puede estar vacío.'),
    body('fk_producto_id_categoria').optional().isInt({ min: 1 }).withMessage('El campo fk_producto_id_categoria debe ser un número entero válido.'),

    body('costo_produccion').optional().isFloat({ min: 0 }).withMessage('El campo costo_produccion debe ser un número mayor o igual a 0.'),
    body('precio_venta').optional().isFloat({ min: 0 }).withMessage('El campo precio_venta debe ser un número mayor o igual a 0.'),
    body('stock').optional().isInt({ min: 0 }).withMessage('El campo stock debe ser un número entero mayor o igual a 0.'),
    body('iva').optional().isFloat({ min: 0 }).withMessage('El campo iva debe ser un número mayor o igual a 0.'),
    body('fecha_produccion').optional().isISO8601().toDate().withMessage('El campo fecha_produccion debe ser una fecha válida.'),
    body('fecha_vencimiento').optional().isISO8601().toDate().withMessage('El campo fecha_vencimiento debe ser una fecha válida.'),

];

// HU-INV-03: Eliminar producto
// Solo se valida el id que viene en la URL, no hay body que revisar
export const deleteProductValidation = [
    param('id').isInt({ min: 1 }).withMessage('El id del producto debe ser un número entero válido.'),
];