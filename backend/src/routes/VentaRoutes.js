import { Router } from "express";
import {
    crearVentaValidation,
    listarVentasValidation
} from "../validations/VentaValidations.js";
import { errorHandler } from "../middleware/errorHandler.js";
import VentaController from "../controllers/VentaController.js";

const router = Router();

router.post(
    "/ventas",
    crearVentaValidation,
    errorHandler,
    VentaController.crear
);

router.get(
    "/ventas",
    listarVentasValidation,
    errorHandler,
    VentaController.listar
);

router.get(
    "/ventas/:id_venta",
    crearVentaValidation,
    errorHandler,
    VentaController.obtenerPorId
);

router.get(
    "/ventas/codigo/:numero_venta",
    crearVentaValidation,
    errorHandler,
    VentaController.obtenerPorCodigo
);

router.patch(
    "/ventas/:id_venta/recalcular",
    crearVentaValidation,
    errorHandler,
    VentaController.recalcularTotales
);

router.get(
    "/ventas/:id_venta/factura-pdf",
    crearVentaValidation,
    errorHandler,
    VentaController.generarFacturaPDF
);



export default router;