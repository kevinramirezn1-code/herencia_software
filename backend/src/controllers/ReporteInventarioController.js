import ReporteInventarioService from "../services/ReporteInventarioService.js";
import PdfGenerator from "../utils/PdfGenerator.js";

class ReporteInventarioController {

    async generarReporteInventario(req, res, next) {

        try {

            const umbral = req.query.umbral || 15;
            const dias = req.query.dias || 30;

            const reporte = await ReporteInventarioService.generarReporteInventario(
                umbral,
                dias
            );

            return res.status(200).json({
                success: true,
                message: "Reporte de inventario generado correctamente.",
                data: reporte
            });

        } catch (error) {
            next(error);
        }

    }

    async generarReporteInventarioPDF(req, res, next) {

    try {

        const umbral = Number(req.query.umbral) || 15;
        const dias = Number(req.query.dias) || 30;

        const reporte = await ReporteInventarioService.generarReporteInventario(
            umbral,
            dias
        );

        PdfGenerator.generarReporteInventario(res, reporte);

    } catch (error) {
        next(error);
    }

}
}
    


export default new ReporteInventarioController();