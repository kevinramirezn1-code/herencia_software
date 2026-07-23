import VentaService from "../services/VentaService.js";
import PdfGenerator from "../utils/PdfGenerator.js";

class VentaController {

    // POST /ventas - Crear una venta completa (cabecera + detalles + descuento de stock)
    async crear(req, res) {
        try {
            const { fecha, fk_venta_id_cliente, fk_venta_id_usuario, descuento, detalles } = req.body;

            const datosVenta = {
                fecha,
                fk_venta_id_cliente,
                fk_venta_id_usuario,
                descuento
            };

            const resultado = await VentaService.crearVentaCompleta(datosVenta, detalles);

            return res.status(201).json({
                success: true,
                message: "Venta creada exitosamente",
                data: resultado
            });

        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message || "Error al crear la venta"
            });
        }
    }

    // GET /ventas/:id_venta - Obtener una venta con sus detalles
    async obtenerPorId(req, res) {
        try {
            const { id_venta } = req.params;

            const resultado = await VentaService.obtenerVentaConDetalles(id_venta);

            return res.status(200).json({
                success: true,
                data: resultado
            });

        } catch (error) {
            return res.status(404).json({
                success: false,
                message: error.message || "Venta no encontrada"
            });
        }
    }

    // GET /ventas/codigo/:numero_venta - Obtener una venta por su código (VEN-001)
    async obtenerPorCodigo(req, res) {
        try {
            const { numero_venta } = req.params;

            const venta = await VentaService.obtenerPorCodigo(numero_venta);

            return res.status(200).json({
                success: true,
                data: venta
            });

        } catch (error) {
            return res.status(404).json({
                success: false,
                message: error.message || "Venta no encontrada"
            });
        }
    }

    // GET /ventas - Listar todas las ventas con paginación y filtros opcionales
    async listar(req, res) {
        try {
            const { pagina, limite, fechaInicio, fechaFin, fk_venta_id_cliente } = req.query;

            const resultado = await VentaService.listarVentas({
                pagina,
                limite,
                fechaInicio,
                fechaFin,
                fk_venta_id_cliente
            });

            return res.status(200).json({
                success: true,
                data: resultado
            });

        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message || "Error al listar las ventas"
            });
        }
    }



    // PATCH /ventas/:id_venta/recalcular - Recalcular totales de una venta existente
    async recalcularTotales(req, res) {
        try {
            const { id_venta } = req.params;

            const resultado = await VentaService.recalcularTotales(id_venta);

            return res.status(200).json({
                success: true,
                message: "Totales recalculados exitosamente",
                data: resultado
            });

        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message || "Error al recalcular los totales"
            });
        }
    }



    //controlador para crear factura en pdf

    async generarFacturaPDF(req, res, next) {
        try {
            const { id_venta } = req.params;

            const { venta, detalles } = await VentaService.obtenerVentaConDetalles(id_venta);

        PdfGenerator.generarFacturaVenta(res, venta, detalles);

    } catch (error) {
        next(error);
    }
}
}

export default new VentaController();