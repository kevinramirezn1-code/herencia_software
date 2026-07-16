import {Router} from "express";
import { generarReporteInventarioValidation } from "../validations/ReporteInventarioValidations.js";
import { validarCampos } from "../middleware/validarCampos.middleware.js";
import ReporteInventarioController from "../controllers/ReporteInventarioController.js";

const router = Router();

// Ruta para generar el reporte de inventario
router.get("/inventario",
     generarReporteInventarioValidation,
      validarCampos,
       ReporteInventarioController.generarReporteInventario);

router.get(
    "/inventario/pdf",
    generarReporteInventarioValidation,
    validarCampos,
    ReporteInventarioController.generarReporteInventarioPDF
);

export default router;