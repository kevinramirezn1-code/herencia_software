import sequelize from "../configuration/database.js";
import IngresoMercanciaRepository from "../repositories/IngresoMercancia.repository.js";

class IngresoMercanciaService {

    /**
     * Registrar una entrada de mercancía
     */
    async registrarEntrada(payload) {

        const { codigo_entrada, fecha, observacion, detalles } = payload;

        // Validar encabezado
        if (!codigo_entrada) {
            throw new Error("El código de entrada es obligatorio.");
        }

        // Validar detalles
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

        }

        return await sequelize.transaction(async (transaction) => {

            // Crear encabezado
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

            // Registrar detalles
            for (const detalle of detalles) {

                const porcentajeIVA = detalle.iva ?? 0;

                const subtotalLinea =
                    Number(detalle.cantidad) *
                    Number(detalle.precio_unitario);

                const ivaLinea =
                    subtotalLinea * (Number(porcentajeIVA) / 100);

                const totalLinea =
                    subtotalLinea + ivaLinea;

                await IngresoMercanciaRepository.crearDetalle(
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

                // Actualizar stock
                await IngresoMercanciaRepository.incrementarStock(
                    detalle.fk_det_entrada_id_producto,
                    detalle.cantidad,
                    transaction
                );

                subtotalGeneral += subtotalLinea;
                ivaGeneral += ivaLinea;

            }

            const totalGeneral = subtotalGeneral + ivaGeneral;

            // Actualizar totales
            await IngresoMercanciaRepository.actualizarTotalesEntrada(
                entrada.id_entrada,
                {
                    subtotal: subtotalGeneral,
                    iva: ivaGeneral,
                    total: totalGeneral
                },
                transaction
            );

            // Retornar la entrada con sus detalles
            return await IngresoMercanciaRepository.obtenerEntradaPorId(
                entrada.id_entrada
            );

        });

    }

    /**
     * Obtener una entrada por ID
     */
    async obtenerEntrada(id_entrada) {

        const entrada = await IngresoMercanciaRepository.obtenerEntradaPorId(
            id_entrada
        );

        if (!entrada) {
            throw new Error("Entrada no encontrada.");
        }

        return entrada;

    }

    /**
     * Listar todas las entradas
     */
    async listarEntradas() {
        return await IngresoMercanciaRepository.listarEntradas();
    }

}

export default new IngresoMercanciaService();