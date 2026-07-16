import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';

// Middleware para verificar la validez del token JWT
export const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Verificar si viene el header de autorización y comienza con "Bearer "
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Acceso denegado. No se proporcionó un token válido.', 401));
  }

  // Extraer el token
  const [, token] = authHeader.split(' ');

  try {
    // Verificar token con la clave secreta
    const jwtSecret = process.env.JWT_SECRET || 'secret_key_por_defecto_12345';
    const decoded = jwt.verify(token, jwtSecret);
    
    // Adjuntar la información del usuario desencriptada en la petición (req)
    req.usuario = decoded;
    
    next();
  } catch (error) {
    return next(new AppError('Token inválido o expirado.', 401));
  }
};

// Middleware para autorizar roles específicos (ej. permitirRoles('Administrador', 'Vendedor'))
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

// Middleware compuesto para verificar token y asegurar rol Administrador
export const esAdmin = [verificarToken, permitirRoles('Administrador')];

