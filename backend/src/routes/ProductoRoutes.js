import { Router } from 'express';
import { createProductValidation, updateProductValidation, deleteProductValidation } from '../validations/ProductoValidations.js';
import { validarCampos } from '../middleware/validarCampos.middleware.js';
import { verificarToken } from '../middleware/authMiddleware.js';
import productoController from '../controllers/ProductoController.js';

const router = Router();

// ============================================
// HU-INV-006: Consultar existencias
// (rutas específicas van ANTES de /:id para que Express no las confunda)
// ============================================

router.get(
  '/con-stock',
  productoController.listarProductosConStock
);

router.get(
  '/sin-stock',
  productoController.listarProductosSinStock
);

router.get(
  '/stock-bajo',
  productoController.listarProductosStockBajo
);

router.get(
  '/codigo/:codigo',
  productoController.obtenerProductoPorCodigo
);

router.get(
  '/',
  productoController.listarProductos
);

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