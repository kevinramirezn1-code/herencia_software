import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';

// Middleware para verificar el token de jsonwebtoken
export const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Verificar si viene el header de autorización 
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Acceso denegado. No se proporcionó un token válido.', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verificar token 
    const jwtSecret = process.env.JWT_SECRET || 'secret_key_por_defecto_12345';
    const decoded = jwt.verify(token, jwtSecret);
    
    req.usuario = decoded;
    

    next();
  } catch (error) {
    return next(new AppError('Token inválido o expirado.', 401));
  }
};

// Middleware para autorizar roles específicos aun no se usara, sera para despues
//sera como Admin,Encargado,Vendedor
export const esAdmin = (req, res, next) => {
  if (!req.usuario) {
    return next(new AppError('No autenticado.', 401));
  }

  if (req.usuario.rol !== 'Admin') {
    return next(new AppError('No tienes permisos para realizar esta acción.', 403));
  }

  next();
};  

export const permitirRoles = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return next(new AppError('No autenticado.', 401));
    }

    // Verificar si el rol del usuario está dentro de los permitidos
    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return next(new AppError('No tienes permisos para realizar esta acción.', 403));
    }

    next();
  };
};
