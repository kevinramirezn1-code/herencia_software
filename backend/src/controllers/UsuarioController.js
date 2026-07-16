import usuarioService from '../services/UsuarioService.js';

class UsuarioController {
  // Registrar un nuevo usuario
  async registrarUsuario(req, res, next) {
    try {
      const { token, usuario } = await usuarioService.registrarUsuario(req.body);

      return res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente.',
        token,
        data: usuario
      });
    } catch (error) {
      next(error);
    }
  }

  // Iniciar sesión
  async login(req, res, next) {
    try {
      const { correo_usuario, contraseña_usuario } = req.body;
      const { token, usuario } = await usuarioService.loginUsuario(correo_usuario, contraseña_usuario);

      return res.status(200).json({
        success: true,
        message: 'Sesión iniciada exitosamente.',
        token,
        data: usuario
      });
    } catch (error) {
      next(error);
    }
  }

  // Actualizar un usuario
  async updateUsuario(req, res, next) {
    try {
      const { id } = req.params;
      const usuarioActualizado = await usuarioService.actualizarUsuario(id, req.body);

      return res.status(200).json({
        success: true,
        message: 'Usuario actualizado exitosamente.',
        data: usuarioActualizado
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UsuarioController();

