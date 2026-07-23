import DetVenta from "../models/DetVentaModel.js";
import Producto from "../models/ProductModels.js";

class DetVentaRepository {

    // Crear un detalle de venta
    async creardatos(datosDetVenta, transaction = null) {
        return await DetVenta.create(datosDetVenta, { transaction });
    }

    // Crear varios detalles de venta a la vez (bulk)
    async crearVarios(detallesArray, transaction = null) {
        return await DetVenta.bulkCreate(detallesArray, { transaction });
    }

    async obtenerporid(id_detalleventa) {
        return await DetVenta.findByPk(id_detalleventa);
    }

    // Obtener todos los detalles de una venta, incluyendo el producto relacionado
    async obtenerporventa(fk_det_venta_id_venta) {
        return await DetVenta.findAll({
            where: {
                fk_det_venta_id_venta
            },
            include: [
                {
                    model: Producto,
                    as: "producto"
                }
            ]
        });
    }

    async actualizardatos(id_detalleventa, datosActualizados, transaction = null) {
        return await DetVenta.update(
            datosActualizados,
            {
                where: {
                    id_detalleventa
                },
                transaction
            }
        );
    }

    async eliminar(id_detalleventa, transaction = null) {
        return await DetVenta.destroy({
            where: {
                id_detalleventa
            },
            transaction
        });
    }

    // Eliminar todos los detalles de una venta (útil si vas a reemplazar todo el detalle)
    async eliminarporventa(fk_det_venta_id_venta, transaction = null) {
        return await DetVenta.destroy({
            where: {
                fk_det_venta_id_venta
            },
            transaction
        });
    }
}

export default new DetVentaRepository();