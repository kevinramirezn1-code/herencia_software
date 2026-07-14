import { SalidaMercancia } from "../models/associations-ingreso.js";

class SalidaMercanciaRepository {

    /**
     * Crear una nueva salida de mercancía
     */
    async crearSalida(datosSalida, transaction = null) {
        return await SalidaMercancia.create(datosSalida, { transaction });
    }

    /**
     * Obtener una salida por su ID
     */
    async obtenerSalidaPorId(id_salida, options = {}) {
        return await SalidaMercancia.findByPk(id_salida, options);
    }

    /**
     * Obtener una salida por su ID, incluyendo sus detalles
     */
    async obtenerSalidaConDetalles(id_salida, options = {}) {
        return await SalidaMercancia.findByPk(id_salida, {
            include: [{ association: "detalles" }],
            ...options,
        });
    }

    /**
     * Obtener todas las salidas, incluyendo sus detalles
     */
    async obtenerTodasConDetalles(options = {}) {
        return await SalidaMercancia.findAll({
            include: [{ association: "detalles" }],
            order: [["fecha", "DESC"]],
            ...options,
        });
    }

    /**
     * Obtener una salida por su código
     */
    async obtenerSalidaPorCodigo(codigo_salida, options = {}) {
        return await SalidaMercancia.findOne({
            where: {
                codigo_salida,
            },
            ...options,
        });
    }

    /**
     * Actualizar los totales de la salida
     */
    async actualizarTotalesSalida(id_salida, totales, transaction = null) {
        await SalidaMercancia.update(
            {
                subtotal: totales.subtotal,
                total: totales.total,
            },
            {
                where: {
                    id_salida,
                },
                transaction,
            }
        );

        return this.obtenerSalidaPorId(id_salida, { transaction });
    }

}

export default new SalidaMercanciaRepository();