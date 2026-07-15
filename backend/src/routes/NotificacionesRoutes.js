import {Router} from 'express';
import NotificacionController from '../controllers/NotificacionController.js';

const router = Router();

// ============================================
// HU-INV-007: Consultar productos próximos a vencer
// ============================================
router.get(
  '/stock-minimo',
  NotificacionController.notificarStockMinimo
);

router.get(
  '/productos-proximos-vencer',
  NotificacionController.notificarProductosProximosAVencer
);

router.get(
  '/productos-agotados',
  NotificacionController.notificarProductosAgotados
);

export default router;