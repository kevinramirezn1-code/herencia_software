import { body } from 'express-validator';

export const registrarSalidaValidation = [
  body('codigo_salida')
    .exists({ checkFalsy: true })
    .withMessage('codigo_salida es obligatorio')
    .isString()
    .withMessage('codigo_salida debe ser texto'),

  body('observacion')
    .optional({ nullable: true })
    .isString()
    .withMessage('observacion debe ser texto'),

  body('fecha')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('fecha debe ser una fecha válida'),

  // subtotal y total NO se validan: los calcula el backend a partir de los detalles

  body('detalles')
    .exists()
    .withMessage('detalles es obligatorio')
    .isArray({ min: 1 })
    .withMessage('detalles debe ser un arreglo con al menos un elemento'),

  body('detalles.*.fk_det_salida_id_producto')
    .exists({ checkFalsy: true })
    .withMessage('cada detalle debe indicar el producto (fk_det_salida_id_producto)')
    .isInt({ min: 1 })
    .withMessage('fk_det_salida_id_producto debe ser un número entero válido'),

  body('detalles.*.cantidad')
    .exists({ checkFalsy: true })
    .withMessage('cada detalle debe indicar la cantidad')
    .isInt({ min: 1 })
    .withMessage('cantidad debe ser un número entero mayor a 0'),
];