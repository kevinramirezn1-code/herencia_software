import jwt from 'jsonwebtoken';

// Generar un token JWT con la información del usuario
export const generarToken = (usuario, nombreRol = null) => {
  const jwtSecret = process.env.JWT_SECRET || 'secret_key_por_defecto_12345';
  
  return jwt.sign(
    {
      idusuario: usuario.idusuario,
      correo_usuario: usuario.correo_usuario,
      fk_usuario_id_rol: usuario.fk_usuario_id_rol,
      rol: nombreRol || usuario.rol?.nombre_rol
    },
    jwtSecret,
    { expiresIn: '8h' }
  );
};
