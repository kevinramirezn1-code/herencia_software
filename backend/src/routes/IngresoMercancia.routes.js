import { Router } from "express";
import ingresoController from "../controllers/ingresoMercancia.controller.js";
import { registrarEntradaValidation } from "../validations/ingresoMercancia.validation.js";
import { validarCampos } from "../middleware/validarCampos.middleware.js";

const router = Router();

// POST /api/ingresos-mercancia
router.post(
    "/",
    registrarEntradaValidation,
    validarCampos,
    ingresoController.registrarEntrada
);

// GET /api/ingresos-mercancia
router.get("/", ingresoController.listarEntradas);

// GET /api/ingresos-mercancia/:id
router.get("/:id", ingresoController.obtenerEntrada);

export default router;