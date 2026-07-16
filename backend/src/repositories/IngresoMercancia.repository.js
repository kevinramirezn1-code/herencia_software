import {
    IngresoMercancia,
    DetIngreso,
    Producto,
} from "../models/associations-ingreso.js";

class IngresoMercanciaRepository {

    /**
     * Crear el encabezado de la entrada de mercancía.
     */
    async crearEntrada(datosEntrada, transaction = null) {
        return await IngresoMercancia.create(datosEntrada, { transaction });
    }

    /**
     * Crear un detalle de la entrada.
     */
    async crearDetalle(datosDetalle, transaction = null) {
        return await DetIngreso.create(datosDetalle, { transaction });
    }

    /**
     * Incrementar el stock de un producto.
     */
    async incrementarStock(id_producto, cantidad, transaction = null) {

        const producto = await Producto.findByPk(id_producto, { transaction });

        if (!producto) {
            throw new Error(`Producto con id ${id_producto} no existe.`);
        }

        producto.stock = Number(producto.stock) + Number(cantidad);

        await producto.save({ transaction });

        return producto;
    }

    /**
     * Actualizar los totales de la entrada.
     */
    async actualizarTotalesEntrada(id_entrada, totales, transaction = null) {

        await IngresoMercancia.update(totales, {
            where: { id_entrada },
            transaction
        });

        return this.obtenerEntradaPorId(id_entrada);
    }

    /**
     * Obtener una entrada por su ID con sus detalles.
     */
    async obtenerEntradaPorId(id_entrada, options = {}) {

        return await IngresoMercancia.findByPk(id_entrada, {
            include: [
                {
                    model: DetIngreso,
                    as: "detalles",
                    include: [
                        {
                            model: Producto,
                            as: "producto"
                        }
                    ]
                }
            ],
            ...options
        });

    }

    /**
     * Listar todas las entradas de mercancía.
     */
    async listarEntradas(options = {}) {

        return await IngresoMercancia.findAll({
            include: [
                {
                    model: DetIngreso,
                    as: "detalles"
                }
            ],
            order: [["fecha", "DESC"]],
            ...options
        });

    }

}

export default new IngresoMercanciaRepository();