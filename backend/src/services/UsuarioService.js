import usuarioRepository from '../repositories/UsuarioRepositories.js';
import rolesRepository from '../repositories/RolesRepositories.js';
import AppError from '../utils/AppError.js';
import { generarToken } from '../utils/jwt.js';
import bcrypt from 'bcryptjs';

class UsuarioService {
  // Registrar un nuevo usuario
  async registrarUsuario(datos) {
    const {
      nombre_usuario,
      apellido_usuario,
      correo_usuario,
      contraseña_usuario,
      telefono_usuario,
      fk_usuario_id_rol
    } = datos;

    // 1. Verificar si el rol existe
    const rolExistente = await rolesRepository.obtenerPorId(fk_usuario_id_rol);
    if (!rolExistente) {
      throw new AppError(`El rol con id ${fk_usuario_id_rol} no existe.`, 404);
    }

    // 2. Verificar si el correo ya está registrado
    const usuarioExistente = await usuarioRepository.obtenerPorCorreo(correo_usuario);
    if (usuarioExistente) {
      throw new AppError(`El correo '${correo_usuario}' ya está registrado.`, 409);
    }

    // 3. Encriptar la contraseña del usuario
    const saltRounds = 10;
    const passwordEncriptado = await bcrypt.hash(contraseña_usuario, saltRounds);

    // 4. Crear el usuario en la base de datos
    const nuevoUsuario = await usuarioRepository.crear({
      nombre_usuario,
      apellido_usuario,
      correo_usuario,
      contraseña_usuario: passwordEncriptado,
      telefono_usuario: telefono_usuario || null,
      fk_usuario_id_rol
    });

    // Generar el token para dejarlo logeado inmediatamente
    const token = generarToken(nuevoUsuario, rolExistente.nombre_rol);

    // 5. Formatear la respuesta del usuario (sin contraseña)
    const usuarioFormateado = nuevoUsuario.toJSON();
    delete usuarioFormateado.contraseña_usuario;
    usuarioFormateado.rol = rolExistente.toJSON();

    return {
      token,
      usuario: usuarioFormateado
    };
  }

  // Iniciar sesión
  async loginUsuario(correo_usuario, contraseña_usuario) {
    // 1. Buscar al usuario por correo
    const usuario = await usuarioRepository.obtenerPorCorreo(correo_usuario);
    if (!usuario) {
      throw new AppError('Credenciales incorrectas.', 401);
    }

    // 2. Comparar la contraseña ingresada con la encriptada en la BD
    const passwordValido = await bcrypt.compare(contraseña_usuario, usuario.contraseña_usuario);
    if (!passwordValido) {
      throw new AppError('Credenciales incorrectas.', 401);
    }

    // 3. Generar token JWT usando la utilidad importada
    const token = generarToken(usuario);

    // 4. Formatear la respuesta del usuario (sin contraseña)
    const usuarioFormateado = usuario.toJSON();
    delete usuarioFormateado.contraseña_usuario;

    return {
      token,
      usuario: usuarioFormateado
    };
  }

  // Actualizar un usuario existente
  async actualizarUsuario(idUsuario, datos) {
    // 1. Verificar si el usuario existe
    const usuario = await usuarioRepository.obtenerPorId(idUsuario);
    if (!usuario) {
      throw new AppError(`El usuario con id ${idUsuario} no existe.`, 404);
    }

    // 2. Si se actualiza el rol, verificar que el rol exista
    if (datos.fk_usuario_id_rol) {
      const rolExistente = await rolesRepository.obtenerPorId(datos.fk_usuario_id_rol);
      if (!rolExistente) {
        throw new AppError(`El rol con id ${datos.fk_usuario_id_rol} no existe.`, 404);
      }
    }

    // 3. Si se actualiza el correo, verificar que no esté registrado por otro usuario
    if (datos.correo_usuario) {
      const usuarioExistente = await usuarioRepository.obtenerPorCorreo(datos.correo_usuario);
      if (usuarioExistente && usuarioExistente.idusuario !== parseInt(idUsuario)) {
        throw new AppError(`El correo '${datos.correo_usuario}' ya está registrado.`, 409);
      }
    }

    // 4. Si se actualiza la contraseña, encriptarla
    if (datos.contraseña_usuario) {
      const saltRounds = 10;
      datos.contraseña_usuario = await bcrypt.hash(datos.contraseña_usuario, saltRounds);
    }

    // 5. Filtrar campos permitidos y preparar objeto para actualizar
    const camposPermitidos = [
      'nombre_usuario',
      'apellido_usuario',
      'correo_usuario',
      'contraseña_usuario',
      'telefono_usuario',
      'fk_usuario_id_rol'
    ];

    const datosAActualizar = {};
    camposPermitidos.forEach(campo => {
      if (datos[campo] !== undefined) {
        datosAActualizar[campo] = datos[campo];
      }
    });

    // 6. Ejecutar la actualización en el repositorio
    await usuarioRepository.actualizar(idUsuario, datosAActualizar);

    // 7. Volver a obtener el usuario por ID para asegurar que cargue las relaciones actualizadas (como el rol)
    const usuarioActualizado = await usuarioRepository.obtenerPorId(idUsuario);

    // 8. Formatear la respuesta del usuario (sin contraseña)
    const usuarioFormateado = usuarioActualizado.toJSON();
    delete usuarioFormateado.contraseña_usuario;

    return usuarioFormateado;
  }
}

export default new UsuarioService();


