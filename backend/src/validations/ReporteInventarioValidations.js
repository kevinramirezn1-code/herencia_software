import { query } from "express-validator";

export const generarReporteInventarioValidation = [

    query("umbral")
        .optional()
        .isInt({ min: 1 })
        .withMessage("El umbral debe ser un número entero mayor a 0.")
        .toInt(),

    query("dias")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Los días deben ser un número entero mayor a 0.")
        .toInt()

];