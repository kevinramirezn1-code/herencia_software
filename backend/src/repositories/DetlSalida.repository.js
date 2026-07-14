import { DetlSalida } from "../models/associations-ingreso.js";
import sequelize from "../configuration/database.js";

class DetSalidaRepository {

    async crearDetalle(datosDetalle, transaction = null) {
        return await DetlSalida.create(datosDetalle, { transaction });
    }

    async crearDetalles(arrayDetalles, transaction = null) {
        return await DetlSalida.bulkCreate(arrayDetalles, { transaction });
    }

    async obtenerDetallePorId(id_det_salida, options = {}) {
        return await DetlSalida.findByPk(id_det_salida, options);
    }

    async obtenerDetallesPorSalida(id_salida, options = {}) {
        return await DetlSalida.findAll({
            where: {
                fk_det_salida_id_salida: id_salida,
            },
            ...options,
        });
    }

    async actualizarDetalle(id_det_salida, datosDetalle, transaction = null) {
        await DetlSalida.update(datosDetalle, {
            where: { id_det_salida },
            transaction,
        });

        return this.obtenerDetallePorId(id_det_salida, { transaction });
    }

    async eliminarDetalle(id_det_salida, transaction = null) {
        return await DetlSalida.destroy({
            where: { id_det_salida },
            transaction,
        });
    }

    async eliminarDetallesPorSalida(id_salida, transaction = null) {
        return await DetlSalida.destroy({
            where: { fk_det_salida_id_salida: id_salida },
            transaction,
        });
    }

    /**
     * Calcula la suma de subtotal y total de todos los detalles
     * de una salida específica. Usado por el service para actualizar
     * los totales de la cabecera (SalidaMercancia).
     */
    async calcularTotalesSalida(id_salida, transaction = null) {
        const resultado = await DetlSalida.findOne({
            attributes: [
                [sequelize.fn("SUM", sequelize.col("subtotal")), "subtotal"],
                [sequelize.fn("SUM", sequelize.col("total")), "total"],
            ],
            where: {
                fk_det_salida_id_salida: id_salida,
            },
            raw: true,
            transaction,
        });

        return {
            subtotal: parseFloat(resultado.subtotal) || 0,
            total: parseFloat(resultado.total) || 0,
        };
    }

}

export default new DetSalidaRepository();