import ProductoProveedor from "../models/Producto-ProovedorModel.js";
import Proveedor from "../models/ProovedorModel.js";
import Producto from "../models/ProductModels.js";

class ProductoProveedorRepository {

    // Asociar un producto a un proveedor con su precio de compra
    async crear(datosRelacion) {
        return await ProductoProveedor.create(datosRelacion);
    }

    async obtenerPorId(id_proveedor_producto) {
        return await ProductoProveedor.findByPk(id_proveedor_producto, {
            include: [
                { model: Proveedor, as: "proveedor" },
                { model: Producto, as: "producto" }
            ]
        });
    }

    // Todos los productos que ofrece un proveedor específico
    async obtenerPorProveedor(fk_producto_proveedor_id_proveedor) {
        return await ProductoProveedor.findAll({
            where: { fk_producto_proveedor_id_proveedor },
            include: [{ model: Producto, as: "producto" }]
        });
    }

    // Todos los proveedores que ofrecen un producto específico
    async obtenerPorProducto(fk_producto_proveedor_id_producto) {
        return await ProductoProveedor.findAll({
            where: { fk_producto_proveedor_id_producto },
            include: [{ model: Proveedor, as: "proveedor" }]
        });
    }

    // Verifica si ya existe la relación (para evitar duplicados sin depender solo del UNIQUE de BD)
    async existeRelacion(fk_producto_proveedor_id_proveedor, fk_producto_proveedor_id_producto) {
        return await ProductoProveedor.findOne({
            where: {
                fk_producto_proveedor_id_proveedor,
                fk_producto_proveedor_id_producto
            }
        });
    }

    async actualizarPrecio(id_proveedor_producto, precio_compra) {
        return await ProductoProveedor.update(
            { precio_compra },
            { where: { id_proveedor_producto } }
        );
    }

    async eliminar(id_proveedor_producto) {
        return await ProductoProveedor.destroy({
            where: { id_proveedor_producto }
        });
    }
}

export default new ProductoProveedorRepository();