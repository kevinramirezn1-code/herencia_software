import ProductoRepository from "../repositories/ProductoRepositories.js";

class ReporteInventarioService {

    // Generar reporte completo de inventario
    async generarReporteInventario(umbral = 15, dias = 30) {

        const productos = await ProductoRepository.obtenerTodos();

        const fechaActual = new Date();
        fechaActual.setHours(0, 0, 0, 0);

        const fechaLimite = new Date(fechaActual);
        fechaLimite.setDate(fechaLimite.getDate() + dias);

        let totalProductos = productos.length;
        let productosConStock = 0;
        let productosSinStock = 0;
        let productosConStockBajo = 0;
        let productosProximosAVencer = 0;

        let costoTotalInventario = 0;
        let valorPotencialVentas = 0;
        let gananciaPotencial = 0;

        const inventario = productos.map(producto => {

            // Contadores
            if (producto.stock > 0) {
                productosConStock++;
            } else {
                productosSinStock++;
            }

            if (producto.stock > 0 && producto.stock <= umbral) {
                productosConStockBajo++;
            }

            const fechaVencimiento = producto.fecha_vencimiento
                ? new Date(producto.fecha_vencimiento)
                : null;

            if (
                fechaVencimiento &&
                fechaVencimiento >= fechaActual &&
                fechaVencimiento <= fechaLimite
            ) {
                productosProximosAVencer++;
            }

            // Cálculos financieros
            const costoTotalProducto =
                Number(producto.stock) * Number(producto.costo_produccion);

            const valorPotencialVenta =
                Number(producto.stock) * Number(producto.precio_venta);

            const gananciaProducto =
                valorPotencialVenta - costoTotalProducto;

            costoTotalInventario += costoTotalProducto;
            valorPotencialVentas += valorPotencialVenta;
            gananciaPotencial += gananciaProducto;

            // Estado del producto
            let estado = "Disponible";

            if (producto.stock === 0) {
                estado = "Agotado";
            } else if (producto.stock <= umbral) {
                estado = "Stock bajo";
            }

            if (
                fechaVencimiento &&
                fechaVencimiento >= fechaActual &&
                fechaVencimiento <= fechaLimite
            ) {
                estado = "Próximo a vencer";
            }

            return {
                ...producto.toJSON(),

                estado,

                costoTotalInventario: costoTotalProducto,

                valorPotencialVenta,

                gananciaPotencial: gananciaProducto
            };
        });

        return {
            resumen: {
                totalProductos,
                productosConStock,
                productosSinStock,
                productosConStockBajo,
                productosProximosAVencer,
                costoTotalInventario,
                valorPotencialVentas,
                gananciaPotencial
            },

            inventario
        };
    }

}

export default new ReporteInventarioService();