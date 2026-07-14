import { Router } from 'express';
import { registerValidation, loginValidation } from '../validations/UsuarioValidations.js';
import { validarCampos } from '../middleware/validarCampos.middleware.js';
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

export default router;
