import ProveedorRepository from "../repositories/ProveedorRepository.js";
import ProductoProveedorRepository from "../repositories/ProductoProveedorRepository.js";
import ProductoRepository from "../repositories/ProductoRepositories.js";

class ProveedorService {

    // ==========================
    // CRUD de Proveedor
    // ==========================

    async registrarProveedor(datosProveedor) {
        const existente = await ProveedorRepository.obtenerPorNit(datosProveedor.nit);

        if (existente) {
            throw new Error(`Ya existe un proveedor registrado con el NIT ${datosProveedor.nit}`);
        }

        return await ProveedorRepository.crear(datosProveedor);
    }

    async listarProveedores() {
        return await ProveedorRepository.obtenerTodos();
    }

    async obtenerProveedorPorId(id_proveedor) {
        const proveedor = await ProveedorRepository.obtenerPorId(id_proveedor);

        if (!proveedor) {
            throw new Error("Proveedor no encontrado");
        }

        return proveedor;
    }

    async actualizarProveedor(id_proveedor, datosActualizados) {
        // Si están actualizando el NIT, verificar que no choque con otro proveedor existente
        if (datosActualizados.nit) {
            const existente = await ProveedorRepository.obtenerPorNit(datosActualizados.nit);

            if (existente && existente.id_proveedor !== Number(id_proveedor)) {
                throw new Error(`Ya existe otro proveedor registrado con el NIT ${datosActualizados.nit}`);
            }
        }

        const proveedorActualizado = await ProveedorRepository.actualizar(id_proveedor, datosActualizados);

        if (!proveedorActualizado) {
            throw new Error("Proveedor no encontrado");
        }

        return proveedorActualizado;
    }

    async eliminarProveedor(id_proveedor) {
        const proveedor = await ProveedorRepository.eliminar(id_proveedor);

        if (!proveedor) {
            throw new Error("Proveedor no encontrado");
        }

        return proveedor;
    }

    async restaurarProveedor(id_proveedor) {
        const proveedor = await ProveedorRepository.restaurar(id_proveedor);

        if (!proveedor) {
            throw new Error("Proveedor no encontrado o ya está activo");
        }

        return proveedor;
    }

    // ==========================
    // Asociación Proveedor <-> Producto (ya existentes)
    // ==========================

    // Asocia un producto YA EXISTENTE con un proveedor YA EXISTENTE, definiendo el precio de compra
    async asociarProductoAProveedor(fk_producto_proveedor_id_proveedor, fk_producto_proveedor_id_producto, precio_compra) {

        // 1. Validar que el proveedor exista
        const proveedor = await ProveedorRepository.obtenerPorId(fk_producto_proveedor_id_proveedor);
        if (!proveedor) {
            throw new Error("El proveedor especificado no existe");
        }

        // 2. Validar que el producto exista
        const producto = await ProductoRepository.obtenerPorIdSimple(fk_producto_proveedor_id_producto);
        if (!producto) {
            throw new Error("El producto especificado no existe");
        }

        // 3. Validar que la relación no exista ya (evita duplicados, incluso antes de chocar con el UNIQUE de BD)
        const relacionExistente = await ProductoProveedorRepository.existeRelacion(
            fk_producto_proveedor_id_proveedor,
            fk_producto_proveedor_id_producto
        );

        if (relacionExistente) {
            throw new Error("Este proveedor ya tiene asociado este producto. Si deseas cambiar el precio, usa la opción de actualizar.");
        }

        // 4. Validar que el precio de compra sea válido
        if (!precio_compra || precio_compra <= 0) {
            throw new Error("El precio de compra debe ser mayor a 0");
        }

        // 5. Crear la asociación
        return await ProductoProveedorRepository.crear({
            fk_producto_proveedor_id_proveedor,
            fk_producto_proveedor_id_producto,
            precio_compra
        });
    }

    // Listar todos los productos que ofrece un proveedor
    async obtenerProductosDeProveedor(id_proveedor) {
        const proveedor = await ProveedorRepository.obtenerPorId(id_proveedor);
        if (!proveedor) {
            throw new Error("Proveedor no encontrado");
        }

        return await ProductoProveedorRepository.obtenerPorProveedor(id_proveedor);
    }

    // Listar todos los proveedores que ofrecen un producto (útil para comparar precios de compra)
    async obtenerProveedoresDeProducto(id_producto) {
        const producto = await ProductoRepository.obtenerPorIdSimple(id_producto);
        if (!producto) {
            throw new Error("Producto no encontrado");
        }

        return await ProductoProveedorRepository.obtenerPorProducto(id_producto);
    }

    // Actualizar el precio de compra de una asociación existente
    async actualizarPrecioCompra(id_proveedor_producto, precio_compra) {
        if (!precio_compra || precio_compra <= 0) {
            throw new Error("El precio de compra debe ser mayor a 0");
        }

        const relacion = await ProductoProveedorRepository.obtenerPorId(id_proveedor_producto);
        if (!relacion) {
            throw new Error("La asociación proveedor-producto no existe");
        }

        return await ProductoProveedorRepository.actualizarPrecio(id_proveedor_producto, precio_compra);
    }

    // Eliminar la asociación (el proveedor deja de ofrecer ese producto)
    async desasociarProducto(id_proveedor_producto) {
        const relacion = await ProductoProveedorRepository.obtenerPorId(id_proveedor_producto);
        if (!relacion) {
            throw new Error("La asociación proveedor-producto no existe");
        }

        return await ProductoProveedorRepository.eliminar(id_proveedor_producto);
    }
}

export default new ProveedorService();