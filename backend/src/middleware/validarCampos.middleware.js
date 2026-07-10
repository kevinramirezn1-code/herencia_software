import { validationResult } from 'express-validator';
import AppError from '../utils/AppError.js';

// Middleware generico y reutilizable: se coloca despues de cualquier arreglo
// de reglas de express-validator (createProductValidation, etc.)
export const validarCampos = (req, res, next) => {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    const erroresFormateados = errores.array().reduce((acc, err) => {
      acc[err.path] = err.msg;
      return acc;
    }, {});

    const error = new AppError('Error de validacion en los datos enviados.', 400);
    error.detalles = erroresFormateados;
    return next(error);
  }

  next();
};