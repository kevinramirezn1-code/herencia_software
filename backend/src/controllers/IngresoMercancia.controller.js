import IngresoMercanciaService from "../services/IngresoMercancia.service.js";

class IngresoMercanciaController {

    /**
     * Registrar una nueva entrada de mercancía
     */
    async registrarEntrada(req, res, next) {

        try {

            const entrada = await IngresoMercanciaService.registrarEntrada(req.body);

            return res.status(201).json({
                success: true,
                message: "Entrada de mercancía registrada correctamente.",
                data: entrada
            });

        } catch (error) {
            next(error);
        }

    }

    /**
     * Obtener una entrada por su ID
     */
    async obtenerEntradaPorId(req, res, next) {

        try {

            const { id } = req.params;

            const entrada = await IngresoMercanciaService.obtenerEntrada(id);

            if (!entrada) {
                return res.status(404).json({
                    success: false,
                    message: "La entrada de mercancía no existe."
                });
            }

            return res.status(200).json({
                success: true,
                data: entrada
            });

        } catch (error) {
            next(error);
        }

    }

    /**
     * Listar todas las entradas de mercancía
     */
    async listarEntradas(req, res, next) {

        try {

            const entradas = await IngresoMercanciaService.listarEntradas();

            return res.status(200).json({
                success: true,
                total: entradas.length,
                data: entradas
            });

        } catch (error) {
            next(error);
        }

    }

}

export default new IngresoMercanciaController();