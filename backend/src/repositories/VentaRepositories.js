import Venta from "../models/VentaModel.js";
import Cliente from "../models/clienteModel.js";
import Usuario from "../models/UsuariosModels.js";

class VentaRepository {

    // Crear venta
    async creardatos(datosVenta, transaction = null) {
        return await Venta.create(datosVenta, { transaction });
    }

    async obtenerporid(id_venta) {
        return await Venta.findByPk(id_venta, {
            include: [
                {
                    model: Cliente,
                    as: "cliente"
                },
                {
                    model: Usuario,
                    as: "usuario"
                }
            ]
        });
    }

    async obtenerporcodigo(numero_venta) {
        return await Venta.findOne({
            where: {
                numero_venta: numero_venta
            }
        });
    }

    async actualizartotales(id_venta, subtotal, iva, total, transaction = null) {
        return await Venta.update(
            {
                subtotal,
                iva,
                total
            },
            {
                where: {
                    id_venta: id_venta
                },
                transaction
            }
        );
    }

    async obtenerTodos({ limit, offset, fechaInicio, fechaFin, fk_venta_id_cliente }) {
        const where = {};

        if (fechaInicio && fechaFin) {
            where.fecha = {
                [Op.between]: [fechaInicio, fechaFin]
            };
        } else if (fechaInicio) {
            where.fecha = {
                [Op.gte]: fechaInicio
            };
        } else if (fechaFin) {
            where.fecha = {
                [Op.lte]: fechaFin
            };
        }

        if (fk_venta_id_cliente) {
            where.fk_venta_id_cliente = fk_venta_id_cliente;
        }

        return await Venta.findAndCountAll({
            where,
            limit,
            offset,
            order: [["id_venta", "DESC"]]
        });
    }
     async obtenerUltimoNumeroVenta(transaction = null) {
        return await Venta.findOne({
            order: [["id_venta", "DESC"]],
            transaction
        });
    }
}

export default new VentaRepository();