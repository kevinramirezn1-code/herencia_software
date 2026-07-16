import { Router } from 'express';
import { registerValidation, loginValidation, updateValidations } from '../validations/UsuarioValidations.js';
import { validarCampos } from '../middleware/validarCampos.middleware.js';
import { esAdmin } from '../middleware/authMiddleware.js';
import usuarioController from '../controllers/UsuarioController.js';

const router = Router();

// Ruta para registrar un nuevo usuario (Crear Usuario)
router.post(
  '/register',
  registerValidation,
  validarCampos,
  usuarioController.registrarUsuario
);

// Ruta para iniciar sesión (Login)
router.post(
  '/login',
  loginValidation,
  validarCampos,
  usuarioController.login
);

// Ruta para actualizar un usuario por su ID (solo administradores)
router.patch(
  '/update/user/:id',
  esAdmin,
  updateValidations,
  validarCampos,
  usuarioController.updateUsuario
);

export default router;

