import Usuario from '../models/UsuariosModels.js';
import Rol from '../models/RolesModels.js';

class UsuarioRepository {
  // Crear un nuevo usuario
  async crear(datosUsuario) {
    return await Usuario.create(datosUsuario);
  }

  // Buscar un usuario por su correo electrónico (útil para login y validación de duplicados)
  async obtenerPorCorreo(correo_usuario) {
    return await Usuario.findOne({
      where: { correo_usuario },
      include: { model: Rol, as: 'rol' }
    });
  }

  // Buscar un usuario por su ID
  async obtenerPorId(idusuario) {
    return await Usuario.findByPk(idusuario, {
      include: { model: Rol, as: 'rol' }
    });
  }

  // Actualizar un usuario existente
  async actualizar(idusuario, datosActualizados) {
    const usuario = await Usuario.findByPk(idusuario);
    if (!usuario) return null;
    return await usuario.update(datosActualizados);
  }
}

export default new UsuarioRepository();

