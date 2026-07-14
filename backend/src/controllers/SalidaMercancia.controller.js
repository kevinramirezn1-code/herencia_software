import SalidaMercanciaService from "../services/SalidaMercanciaServices.js";

class SalidaMercanciaController {

    /**
     * Registrar una nueva salida de mercancía
     */
    async crearSalida(req, res) {
        try {

            const { detalles, ...datosSalida } = req.body;

            const salida = await SalidaMercanciaService.crearSalida(
                datosSalida,
                detalles
            );

            return res.status(201).json({
                success: true,
                message: "Salida de mercancía registrada correctamente.",
                data: salida
            });

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }
    }

    /**
     * Obtener una salida por su ID
     */
    async obtenerSalidaPorId(req, res) {

        try {

            const { id } = req.params;

            const salida = await SalidaMercanciaService.obtenerSalidaPorId(id);

            if (!salida) {
                return res.status(404).json({
                    success: false,
                    message: "La salida de mercancía no existe."
                });
            }

            return res.status(200).json({
                success: true,
                data: salida
            });

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }

    }

    /**
     * Listar todas las salidas
     */
    async listarSalidas(req, res) {

        try {

            const salidas = await SalidaMercanciaService.listarSalidas();

            return res.status(200).json({
                success: true,
                total: salidas.length,
                data: salidas
            });

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }

    }

}

export default new SalidaMercanciaController();
