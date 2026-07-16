import { Router } from "express";
import IngresoMercanciaController from "../controllers/IngresoMercancia.controller.js";
import { registrarEntradaValidation } from "../validations/IngresoMercancia.validation.js";
import { validarCampos } from "../middleware/validarCampos.middleware.js";

const router = Router();

/**
 * POST /api/ingreso-mercancia
 * Registrar una nueva entrada de mercancía
 */
router.post(
    "/",
    registrarEntradaValidation,
    validarCampos,
    IngresoMercanciaController.registrarEntrada
);

/**
 * GET /api/ingreso-mercancia
 * Listar todas las entradas
 */
router.get(
    "/",
    IngresoMercanciaController.listarEntradas
);

/**
 * GET /api/ingreso-mercancia/:id
 * Obtener una entrada por su ID
 */
router.get(
    "/:id",
    IngresoMercanciaController.obtenerEntradaPorId
);

export default router;