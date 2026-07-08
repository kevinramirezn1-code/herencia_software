import { body } from 'express-validator';

export const registerValidation = [
  body('nombre_usuario')
    .notEmpty().withMessage('El campo nombre_usuario es obligatorio.')
    .isLength({ max: 100 }).withMessage('El campo nombre_usuario no puede exceder los 100 caracteres.'),

  body('apellido_usuario')
    .notEmpty().withMessage('El campo apellido_usuario es obligatorio.')
    .isLength({ max: 100 }).withMessage('El campo apellido_usuario no puede exceder los 100 caracteres.'),

  body('correo_usuario')
    .notEmpty().withMessage('El campo correo_usuario es obligatorio.')
    .isEmail().withMessage('El campo correo_usuario debe ser un correo electrónico válido.')
    .isLength({ max: 150 }).withMessage('El campo correo_usuario no puede exceder los 150 caracteres.'),

  body('contraseña_usuario')
    .notEmpty().withMessage('El campo contraseña_usuario es obligatorio.')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.')
    .isLength({ max: 255 }).withMessage('La contraseña no puede exceder los 255 caracteres.'),

  body('telefono_usuario')
    .optional()
    .isLength({ max: 20 }).withMessage('El campo telefono_usuario no puede exceder los 20 caracteres.'),

  body('fk_usuario_id_rol')
    .notEmpty().withMessage('El campo fk_usuario_id_rol es obligatorio.')
    .isInt({ min: 1 }).withMessage('El campo fk_usuario_id_rol debe ser un número entero válido y mayor a 0.')
];

export const loginValidation = [
  body('correo_usuario')
    .notEmpty().withMessage('El campo correo_usuario es obligatorio.')
    .isEmail().withMessage('El campo correo_usuario debe ser un correo electrónico válido.'),

  body('contraseña_usuario')
    .notEmpty().withMessage('El campo contraseña_usuario es obligatorio.')
];
