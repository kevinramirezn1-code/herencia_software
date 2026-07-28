import DetVentaLote from "../models/DetVentaLoteModel.js";

class DetVentaLoteRepository {

    async crear(datosRegistro, transaction = null) {
        return await DetVentaLote.create(datosRegistro, { transaction });
    }

    async crearVarios(registrosArray, transaction = null) {
        return await DetVentaLote.bulkCreate(registrosArray, { transaction });
    }

    async obtenerPorDetalleVenta(fk_det_venta_lote_id_detalleventa) {
        return await DetVentaLote.findAll({
            where: { fk_det_venta_lote_id_detalleventa }
        });
    }
}

export default new DetVentaLoteRepository();