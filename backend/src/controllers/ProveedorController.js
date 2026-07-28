import ProveedorService from "../services/ProveedorService.js";

class ProveedorController {

    // ==========================
    // CRUD de Proveedor
    // ==========================

    async registrarProveedor(req, res, next) {
        try {
            const proveedor = await ProveedorService.registrarProveedor(req.body);

            return res.status(201).json({
                success: true,
                message: "Proveedor registrado exitosamente.",
                data: proveedor
            });
        } catch (error) {
            next(error);
        }
    }

    async listarProveedores(req, res, next) {
        try {
            const proveedores = await ProveedorService.listarProveedores();

            return res.status(200).json({
                success: true,
                data: proveedores
            });
        } catch (error) {
            next(error);
        }
    }

    async obtenerProveedorPorId(req, res, next) {
        try {
            const { id_proveedor } = req.params;
            const proveedor = await ProveedorService.obtenerProveedorPorId(id_proveedor);

            return res.status(200).json({
                success: true,
                data: proveedor
            });
        } catch (error) {
            next(error);
        }
    }

    async actualizarProveedor(req, res, next) {
        try {
            const { id_proveedor } = req.params;
            const proveedor = await ProveedorService.actualizarProveedor(id_proveedor, req.body);

            return res.status(200).json({
                success: true,
                message: "Proveedor actualizado exitosamente.",
                data: proveedor
            });
        } catch (error) {
            next(error);
        }
    }

    async eliminarProveedor(req, res, next) {
        try {
            const { id_proveedor } = req.params;
            await ProveedorService.eliminarProveedor(id_proveedor);

            return res.status(200).json({
                success: true,
                message: "Proveedor eliminado exitosamente."
            });
        } catch (error) {
            next(error);
        }
    }

    async restaurarProveedor(req, res, next) {
        try {
            const { id_proveedor } = req.params;
            const proveedor = await ProveedorService.restaurarProveedor(id_proveedor);

            return res.status(200).json({
                success: true,
                message: "Proveedor restaurado exitosamente.",
                data: proveedor
            });
        } catch (error) {
            next(error);
        }
    }

    // ==========================
    // Asociación Proveedor <-> Producto
    // ==========================

    async asociarProducto(req, res, next) {
        try {
            const { id_proveedor } = req.params;
            const { fk_producto_proveedor_id_producto, precio_compra } = req.body;

            const relacion = await ProveedorService.asociarProductoAProveedor(
                id_proveedor,
                fk_producto_proveedor_id_producto,
                precio_compra
            );

            return res.status(201).json({
                success: true,
                message: "Producto asociado al proveedor exitosamente.",
                data: relacion
            });
        } catch (error) {
            next(error);
        }
    }

    async obtenerProductosDeProveedor(req, res, next) {
        try {
            const { id_proveedor } = req.params;
            const productos = await ProveedorService.obtenerProductosDeProveedor(id_proveedor);

            return res.status(200).json({
                success: true,
                data: productos
            });
        } catch (error) {
            next(error);
        }
    }

    async obtenerProveedoresDeProducto(req, res, next) {
        try {
            const { id_producto } = req.params;
            const proveedores = await ProveedorService.obtenerProveedoresDeProducto(id_producto);

            return res.status(200).json({
                success: true,
                data: proveedores
            });
        } catch (error) {
            next(error);
        }
    }

    async actualizarPrecioCompra(req, res, next) {
        try {
            const { id_proveedor_producto } = req.params;
            const { precio_compra } = req.body;

            const relacion = await ProveedorService.actualizarPrecioCompra(id_proveedor_producto, precio_compra);

            return res.status(200).json({
                success: true,
                message: "Precio de compra actualizado exitosamente.",
                data: relacion
            });
        } catch (error) {
            next(error);
        }
    }

    async eliminarAsociacion(req, res, next) {
        try {
            const { id_proveedor_producto } = req.params;
            await ProveedorService.desasociarProducto(id_proveedor_producto);

            return res.status(200).json({
                success: true,
                message: "Asociación eliminada exitosamente."
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new ProveedorController();