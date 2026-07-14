import sequelize from "../configuration/database.js";
import DetSalidaRepository from "../repositories/DetlSalida.repository.js";
import SalidaMercanciaRepository from "../repositories/SalidaMercancia.repository.js";
import ProductoRepository from "../repositories/Productorepositories.js";

class SalidaMercanciaServices {

    async crearSalida(datosSalida, detallesSalida) {

        if (!Array.isArray(detallesSalida) || detallesSalida.length === 0) {
            throw new Error("La salida debe tener al menos un detalle");
        }

        const idsProductos = detallesSalida.map(d => d.fk_det_salida_id_producto);
        const idsDuplicados = idsProductos.filter((id, i) => idsProductos.indexOf(id) !== i);
        if (idsDuplicados.length > 0) {
            throw new Error(`Hay productos duplicados en el detalle de la salida: ${[...new Set(idsDuplicados)].join(", ")}`);
        }

        const transaction = await sequelize.transaction();

        try {
            // Validar que el código de salida sea único
            const salidaExistente = await SalidaMercanciaRepository.obtenerSalidaPorCodigo(datosSalida.codigo_salida);
            if (salidaExistente) {
                throw new Error(`Ya existe una salida con el código ${datosSalida.codigo_salida}`);
            }

            // Validar que la fecha no sea mayor a la fecha actual
            const fechaActual = new Date();
            if (datosSalida.fecha && new Date(datosSalida.fecha) > fechaActual) {
                throw new Error(`La fecha de salida no puede ser mayor a la fecha actual`);
            }

            if (!datosSalida.observacion) {
                datosSalida.observacion = "Sin observación";
            }

            // Crear salida (cabecera)
            const salidaCreada = await SalidaMercanciaRepository.crearSalida(datosSalida, transaction);

            for (const detalle of detallesSalida) {

                if (!detalle.cantidad || detalle.cantidad <= 0) {
                    throw new Error(`La cantidad debe ser mayor a 0 para el producto ${detalle.fk_det_salida_id_producto}`);
                }

                const producto = await ProductoRepository.obtenerPorId(
                    detalle.fk_det_salida_id_producto,
                    { transaction }
                );
                if (!producto) {
                    throw new Error(`Producto con id ${detalle.fk_det_salida_id_producto} no existe`);
                }

                if (producto.stock < detalle.cantidad) {
                    throw new Error(`No hay suficiente stock para el producto ${producto.nombre_producto}. Stock disponible: ${producto.stock}, cantidad solicitada: ${detalle.cantidad}`);
                }

                const subtotal = detalle.cantidad * producto.costo_produccion;
                const total = subtotal;

                await DetSalidaRepository.crearDetalle({
                    fk_det_salida_id_salida: salidaCreada.id_salida,
                    fk_det_salida_id_producto: detalle.fk_det_salida_id_producto,
                    cantidad: detalle.cantidad,
                    precio_unitario: producto.costo_produccion,
                    subtotal,
                    total,
                }, transaction);

                await ProductoRepository.decrementarStock(
                    producto.id_producto,
                    detalle.cantidad,
                    transaction
                );
            }

            const totales = await DetSalidaRepository.calcularTotalesSalida(salidaCreada.id_salida, transaction);
            await SalidaMercanciaRepository.actualizarTotalesSalida(salidaCreada.id_salida, totales, transaction);

            await transaction.commit();

            return await SalidaMercanciaRepository.obtenerSalidaConDetalles(salidaCreada.id_salida);

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    /**
     * Obtener una salida por su ID, incluyendo sus detalles
     */
    async obtenerSalidaPorId(id_salida) {
        return await SalidaMercanciaRepository.obtenerSalidaConDetalles(id_salida);
    }

    /**
     * Listar todas las salidas, incluyendo sus detalles
     */
    async listarSalidas() {
        return await SalidaMercanciaRepository.obtenerTodasConDetalles();
    }
}

export default new SalidaMercanciaServices();