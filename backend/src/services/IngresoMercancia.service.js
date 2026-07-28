import sequelize from "../configuration/database.js";
import IngresoMercanciaRepository from "../repositories/IngresoMercancia.repository.js";

class IngresoMercanciaService {

    async registrarEntrada(payload) {

        const { codigo_entrada, fecha, observacion, detalles } = payload;

        if (!codigo_entrada) {
            throw new Error("El código de entrada es obligatorio.");
        }

        if (!Array.isArray(detalles) || detalles.length === 0) {
            throw new Error("Debe incluir al menos un producto en el detalle.");
        }

        for (const detalle of detalles) {

            if (
                !detalle.fk_det_entrada_id_producto ||
                !detalle.cantidad ||
                detalle.cantidad <= 0 ||
                detalle.precio_unitario == null
            ) {
                throw new Error(
                    "Cada detalle requiere producto, cantidad (> 0) y precio_unitario."
                );
            }

            // 🆕 Validación de datos de lote (obligatorios para trazabilidad de alimentos)
            if (!detalle.numero_lote) {
                throw new Error(
                    `El detalle del producto ${detalle.fk_det_entrada_id_producto} requiere un número de lote.`
                );
            }

            if (!detalle.fecha_vencimiento) {
                throw new Error(
                    `El detalle del producto ${detalle.fk_det_entrada_id_producto} requiere fecha de vencimiento del lote.`
                );
            }
        }

        return await sequelize.transaction(async (transaction) => {

            const entrada = await IngresoMercanciaRepository.crearEntrada(
                {
                    codigo_entrada,
                    fecha: fecha || new Date(),
                    observacion: observacion || null,
                    subtotal: 0,
                    iva: 0,
                    total: 0
                },
                transaction
            );

            let subtotalGeneral = 0;
            let ivaGeneral = 0;

            for (const detalle of detalles) {

                const porcentajeIVA = detalle.iva ?? 0;

                const subtotalLinea =
                    Number(detalle.cantidad) *
                    Number(detalle.precio_unitario);

                const ivaLinea =
                    subtotalLinea * (Number(porcentajeIVA) / 100);

                const totalLinea =
                    subtotalLinea + ivaLinea;

                const detIngreso = await IngresoMercanciaRepository.crearDetalle(
                    {
                        fk_det_entrada_id_entrada: entrada.id_entrada,
                        fk_det_entrada_id_producto:
                            detalle.fk_det_entrada_id_producto,
                        cantidad: detalle.cantidad,
                        precio_unitario: detalle.precio_unitario,
                        subtotal: subtotalLinea,
                        iva: ivaLinea,
                        total: totalLinea
                    },
                    transaction
                );

                // 🆕 Crear el lote correspondiente a esta línea de entrada
                await IngresoMercanciaRepository.crearLoteDeIngreso(
                    {
                        fk_lote_id_producto: detalle.fk_det_entrada_id_producto,
                        numero_lote: detalle.numero_lote,
                        cantidad_inicial: detalle.cantidad,
                        fecha_produccion: detalle.fecha_produccion || null,
                        fecha_vencimiento: detalle.fecha_vencimiento,
                        fk_lote_id_ingreso: detIngreso.id_det_entrada
                    },
                    transaction
                );

                // Actualizar stock (caché sincronizado del total)
                await IngresoMercanciaRepository.incrementarStock(
                    detalle.fk_det_entrada_id_producto,
                    detalle.cantidad,
                    transaction
                );

                subtotalGeneral += subtotalLinea;
                ivaGeneral += ivaLinea;
            }

            const totalGeneral = subtotalGeneral + ivaGeneral;

            await IngresoMercanciaRepository.actualizarTotalesEntrada(
                entrada.id_entrada,
                {
                    subtotal: subtotalGeneral,
                    iva: ivaGeneral,
                    total: totalGeneral
                },
                transaction
            );

            return await IngresoMercanciaRepository.obtenerEntradaPorId(
                entrada.id_entrada
            );
        });
    }

    async obtenerEntrada(id_entrada) {
        const entrada = await IngresoMercanciaRepository.obtenerEntradaPorId(id_entrada);

        if (!entrada) {
            throw new Error("Entrada no encontrada.");
        }

        return entrada;
    }

    async listarEntradas() {
        return await IngresoMercanciaRepository.listarEntradas();
    }
}

export default new IngresoMercanciaService();