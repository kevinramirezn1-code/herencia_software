import { Router } from "express";
import salidaMercanciaController from "../controllers/SalidaMercancia.controller.js";
import { registrarSalidaValidation } from "../validations/SalidaMercanciaValidations.js";
import { validarCampos } from "../middleware/validarCampos.middleware.js";

const router = Router();

// POST /api/salidas-mercancia
router.post(
    "/",
    registrarSalidaValidation,
    validarCampos,
    salidaMercanciaController.crearSalida
);

// GET /api/salidas-mercancia
router.get("/", salidaMercanciaController.listarSalidas);

// GET /api/salidas-mercancia/:id
router.get("/:id", salidaMercanciaController.obtenerSalidaPorId);

export default router;