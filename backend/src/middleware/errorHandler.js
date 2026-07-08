// Middleware de manejo de errores GLOBAL.
// Express lo reconoce como "error handler" porque tiene 4 parametros (err, req, res, next).
// Debe registrarse en app.js DESPUES de todas las rutas: app.use(errorHandler)
export const errorHandler = (err, req, res, next) => {

  // Si el error viene de AppError, ya trae su propio statusCode.
  // Si es un error inesperado (bug, fallo de conexion, etc.), usamos 500 por defecto.
  const statusCode = err.statusCode || 500;
  const message = err.statusCode ? err.message : 'Error interno del servidor.';

  // Log completo en consola para depurar (nunca se envia al cliente)
  console.error(`[${new Date().toISOString()}] ${err.name || 'Error'}: ${err.message}`);
  if (!err.statusCode) {
    console.error(err.stack);
  }

  const respuesta = {
    success: false,
    message
  };

  // Si el error trae detalles de validacion (los agregamos en validarCampos.js), los incluimos
  if (err.detalles) {
    respuesta.detalles = err.detalles;
  }

  return res.status(statusCode).json(respuesta);
};