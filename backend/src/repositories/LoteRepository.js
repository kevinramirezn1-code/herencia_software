import { Op } from "sequelize";
import Lote from "../models/LoteModel.js";

class LoteRepository {

    // Crear un nuevo lote (se usará en el ingreso de mercancía — Fase 2)
    async crear(datosLote, transaction = null) {
        return await Lote.create(
            {
                ...datosLote,
                cantidad_actual: datosLote.cantidad_inicial
            },
            { transaction }
        );
    }

    async obtenerPorId(id_lote) {
        return await Lote.findByPk(id_lote);
    }

    // Todos los lotes de un producto (para mostrar historial completo, con o sin stock)
    async obtenerPorProducto(fk_lote_id_producto) {
        return await Lote.findAll({
            where: { fk_lote_id_producto },
            order: [["fecha_vencimiento", "ASC"]]
        });
    }

    // Lotes disponibles de un producto, ordenados FEFO (vence primero = sale primero)
    async obtenerLotesDisponiblesFEFO(fk_lote_id_producto, transaction = null) {
        return await Lote.findAll({
            where: {
                fk_lote_id_producto,
                cantidad_actual: { [Op.gt]: 0 }
            },
            order: [["fecha_vencimiento", "ASC"], ["id_lote", "ASC"]],
            transaction,
            lock: transaction ? transaction.LOCK.UPDATE : undefined
        });
    }

    // Suma el stock total disponible de un producto (a través de todos sus lotes)
    async obtenerStockTotalPorProducto(fk_lote_id_producto) {
        const resultado = await Lote.sum("cantidad_actual", {
            where: { fk_lote_id_producto }
        });
        return resultado || 0;
    }

    // Descuenta cantidad de un lote específico de forma atómica
    async descontarCantidad(id_lote, cantidad, transaction = null) {
        return await Lote.decrement("cantidad_actual", {
            by: cantidad,
            where: { id_lote },
            transaction
        });
    }

    // Suma cantidad a un lote específico (por ejemplo, si llega más stock del mismo lote exacto)
    async incrementarCantidad(id_lote, cantidad, transaction = null) {
        return await Lote.increment("cantidad_actual", {
            by: cantidad,
            where: { id_lote },
            transaction
        });
    }

    // ⭐ Núcleo FEFO: consume "cantidadRequerida" unidades de un producto,
    // repartiendo entre los lotes disponibles empezando por el que vence antes.
    // Devuelve el detalle de qué lotes se usaron y cuánto se tomó de cada uno.
    async consumirStockFEFO(fk_lote_id_producto, cantidadRequerida, transaction) {
        const lotesDisponibles = await this.obtenerLotesDisponiblesFEFO(fk_lote_id_producto, transaction);

        const stockTotal = lotesDisponibles.reduce((acc, lote) => acc + lote.cantidad_actual, 0);

        if (stockTotal < cantidadRequerida) {
            throw new Error(
                `Stock insuficiente en lotes. Disponible: ${stockTotal}, solicitado: ${cantidadRequerida}`
            );
        }

        let restante = cantidadRequerida;
        const consumoPorLote = [];

        for (const lote of lotesDisponibles) {
            if (restante <= 0) break;

            const cantidadATomar = Math.min(lote.cantidad_actual, restante);

            await this.descontarCantidad(lote.id_lote, cantidadATomar, transaction);

            consumoPorLote.push({
                id_lote: lote.id_lote,
                numero_lote: lote.numero_lote,
                fecha_vencimiento: lote.fecha_vencimiento,
                cantidad_tomada: cantidadATomar
            });

            restante -= cantidadATomar;
        }

        return consumoPorLote;
    }

    // Lotes próximos a vencer (para el reporte de inventario — Fase 4)
    async obtenerLotesProximosAVencer(dias = 30) {
        const hoy = new Date();
        const limite = new Date();
        limite.setDate(limite.getDate() + dias);

        return await Lote.findAll({
            where: {
                fecha_vencimiento: {
                    [Op.between]: [
                        hoy.toISOString().split("T")[0],
                        limite.toISOString().split("T")[0]
                    ]
                },
                cantidad_actual: { [Op.gt]: 0 }
            },
            order: [["fecha_vencimiento", "ASC"]]
        });
    }

    // Lotes ya vencidos con stock aún disponible (para dar de baja o alertar)
    async obtenerLotesVencidos() {
        const hoy = new Date().toISOString().split("T")[0];

        return await Lote.findAll({
            where: {
                fecha_vencimiento: { [Op.lt]: hoy },
                cantidad_actual: { [Op.gt]: 0 }
            },
            order: [["fecha_vencimiento", "ASC"]]
        });
    }
}

export default new LoteRepository();