import sequelize from "../configuration/database.js";
import VentaRepository from "../repositories/VentaRepositories.js";
import DetVentaRepository from "../repositories/DetVentaRepository.js";
import ProductoRepository from "../repositories/ProductoRepositories.js";

class VentaService {

    async generarNumeroVenta(transaction = null) {
        const ultimaVenta = await VentaRepository.obtenerUltimoNumeroVenta(transaction);

        let siguienteNumero = 1;

        if (ultimaVenta && ultimaVenta.numero_venta) {
            const partes = ultimaVenta.numero_venta.split("-");
            const numeroActual = parseInt(partes[1], 10);

            if (!isNaN(numeroActual)) {
                siguienteNumero = numeroActual + 1;
            }
        }

        const numeroFormateado = String(siguienteNumero).padStart(3, "0");
        return `VEN-${numeroFormateado}`;
    }

    async crearVentaCompleta(datosVenta, detallesProductos) {
        // detallesProductos ahora solo necesita: [{ fk_det_venta_id_producto, cantidad }]
        // El precio y el IVA ya NO se reciben del frontend, se toman del producto en BD

        if (!detallesProductos || detallesProductos.length === 0) {
            throw new Error("La venta debe contener al menos un producto");
        }

        const transaction = await sequelize.transaction();

        try {
            let subtotalVenta = 0;
            let ivaVenta = 0;
            const detallesCalculados = [];

            for (const detalle of detallesProductos) {
                const { fk_det_venta_id_producto, cantidad } = detalle;

                if (!cantidad || cantidad <= 0) {
                    throw new Error(`Cantidad inválida para el producto ${fk_det_venta_id_producto}`);
                }

                // Bloqueo de fila para evitar condiciones de carrera en stock
                const producto = await ProductoRepository.obtenerPorIdSimple(fk_det_venta_id_producto, {
                    transaction,
                    lock: transaction.LOCK.UPDATE
                });

                if (!producto) {
                    throw new Error(`Producto con id ${fk_det_venta_id_producto} no existe`);
                }

                if (producto.stock < cantidad) {
                    throw new Error(
                        `Stock insuficiente para "${producto.nombre_producto}". Disponible: ${producto.stock}, solicitado: ${cantidad}`
                    );
                }

                // 🔑 Precio y IVA se toman SIEMPRE del producto en BD, nunca del body
                const precioVenta = Number(producto.precio_venta);
                const ivaProducto = Number(producto.iva);

                const subtotalLinea = cantidad * precioVenta;
                const ivaLinea = subtotalLinea * (ivaProducto / 100);
                const totalLinea = subtotalLinea + ivaLinea;

                subtotalVenta += subtotalLinea;
                ivaVenta += ivaLinea;

                detallesCalculados.push({
                    fk_det_venta_id_producto,
                    cantidad,
                    precio_venta: precioVenta,
                    iva_producto: ivaProducto,
                    subtotal: subtotalLinea,
                    total: totalLinea
                });
            }

            const descuento = datosVenta.descuento || 0;
            const totalVenta = (subtotalVenta + ivaVenta) - descuento;

            const numeroVentaGenerado = await this.generarNumeroVenta(transaction);

            const nuevaVenta = await VentaRepository.creardatos(
                {
                    numero_venta: numeroVentaGenerado,
                    fecha: datosVenta.fecha,
                    fk_venta_id_cliente: datosVenta.fk_venta_id_cliente,
                    fk_venta_id_usuario: datosVenta.fk_venta_id_usuario,
                    subtotal: subtotalVenta,
                    iva: ivaVenta,
                    descuento,
                    total: totalVenta
                },
                transaction
            );

            const detallesConVenta = detallesCalculados.map((detalle) => ({
                ...detalle,
                fk_det_venta_id_venta: nuevaVenta.id_venta
            }));

            await DetVentaRepository.crearVarios(detallesConVenta, transaction);

            for (const detalle of detallesCalculados) {
                await ProductoRepository.decrementarStock(
                    detalle.fk_det_venta_id_producto,
                    detalle.cantidad,
                    transaction
                );
            }

            await transaction.commit();

            return await this.obtenerVentaConDetalles(nuevaVenta.id_venta);

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async obtenerVentaConDetalles(id_venta) {
        const venta = await VentaRepository.obtenerporid(id_venta);
        if (!venta) throw new Error("Venta no encontrada");
        const detalles = await DetVentaRepository.obtenerporventa(id_venta);
        return { venta, detalles };
    }

    async obtenerPorCodigo(numero_venta) {
        const venta = await VentaRepository.obtenerporcodigo(numero_venta);
        if (!venta) throw new Error("Venta no encontrada");
        return venta;
    }

    async recalcularTotales(id_venta) {
        const detalles = await DetVentaRepository.obtenerporventa(id_venta);
        const subtotal = detalles.reduce((acc, d) => acc + Number(d.subtotal), 0);
        const iva = detalles.reduce(
            (acc, d) => acc + Number(d.subtotal) * (Number(d.iva_producto) / 100),
            0
        );
        const venta = await VentaRepository.obtenerporid(id_venta);
        const descuento = Number(venta.descuento) || 0;
        const total = (subtotal + iva) - descuento;

        return await VentaRepository.actualizartotales(id_venta, subtotal, iva, total);
    }

    async listarVentas(filtros) {
        const { pagina = 1, limite = 10, fechaInicio, fechaFin, fk_venta_id_cliente } = filtros;

        const paginaNum = Math.max(parseInt(pagina, 10) || 1, 1);
        const limiteNum = Math.max(parseInt(limite, 10) || 10, 1);
        const offset = (paginaNum - 1) * limiteNum;

        const resultado = await VentaRepository.obtenerTodos({
            limit: limiteNum,
            offset,
            fechaInicio,
            fechaFin,
            fk_venta_id_cliente
        });

        return {
            ventas: resultado.rows,
            total: resultado.count,
            paginaActual: paginaNum,
            totalPaginas: Math.ceil(resultado.count / limiteNum)
        };
    }
}

export default new VentaService();