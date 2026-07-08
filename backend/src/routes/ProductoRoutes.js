import { Router } from 'express';
import { createProductValidation, updateProductValidation, deleteProductValidation } from '../validations/ProductoValidations.js';
import { validarCampos } from '../middleware/validarCampos.js';
import productoController from '../controllers/ProductoController.js';

const router = Router();

// HU-INV-01: Registrar producto
// Orden de la cadena: 1) reglas de formato -> 2) revisar si hubo errores -> 3) controller
router.post(
  '/',
  createProductValidation,
  validarCampos,
  productoController.registrarProducto
);

// HU-INV-02: Actualizar producto
router.put(
  '/:id',
  updateProductValidation,
  validarCampos,
  productoController.actualizarProducto
);

// HU-INV-03: Eliminar producto
router.delete(
  '/:id',
  deleteProductValidation,
  validarCampos,
  productoController.eliminarProducto
);

export default router;