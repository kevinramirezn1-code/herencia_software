import { Router } from 'express';
import { createProductValidation, updateProductValidation, deleteProductValidation } from '../validations/ProductoValidations.js';
import { validarCampos } from '../middleware/validarCampos.middleware.js';
import { validarCampos } from '../middleware/validarCampos.js';
import { verificarToken } from '../middleware/authMiddleware.js';
import productoController from '../controllers/ProductoController.js';

const router = Router();

// HU-INV-01: Registrar producto
router.post(
  '/',
  verificarToken,
  createProductValidation,
  validarCampos,
  productoController.registrarProducto
);

// HU-INV-02: Actualizar producto
router.put(
  '/:id',
  verificarToken,
  updateProductValidation,
  validarCampos,
  productoController.actualizarProducto
);

// HU-INV-03: Eliminar producto
router.delete(
  '/:id',
  verificarToken,
  deleteProductValidation,
  validarCampos,
  productoController.eliminarProducto
);

export default router;