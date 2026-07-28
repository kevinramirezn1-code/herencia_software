import { Router } from "express";
import {
    crearProveedorValidation,
    actualizarProveedorValidation,
    obtenerProveedorValidation,
    eliminarProveedorValidation
} from "../validations/ProveedorValidation.js";
import {
    asociarProductoProveedorValidation,
    actualizarPrecioCompraValidation,
    obtenerProductosDeProveedorValidation,
    obtenerProveedoresDeProductoValidation,
    eliminarAsociacionValidation
} from "../validations/ProductoProveedorValidation.js";
import { validarCampos } from "../middleware/validarCampos.middleware.js";
import ProveedorController from "../controllers/ProveedorController.js";

const router = Router();

// ============================================================
// CRUD DE PROVEEDOR
// Gestión básica de la información de cada proveedor: registrar,
// consultar, actualizar y eliminar (lógicamente) proveedores.
// ============================================================

/**
 * POST /api/proveedores
 * Registra un nuevo proveedor en el sistema.
 * Valida que el NIT no esté duplicado antes de crear el registro.
 * Body esperado: { nit, razon_social, telefono_proveedor, direccion, ciudad }
 */
router.post(
    "/proveedores",
    crearProveedorValidation,
    validarCampos,
    ProveedorController.registrarProveedor
);

/**
 * GET /api/proveedores
 * Lista todos los proveedores activos (los eliminados con soft delete
 * no aparecen aquí, ya que Sequelize los excluye automáticamente
 * gracias a "paranoid: true").
 */
router.get(
    "/proveedores",
    ProveedorController.listarProveedores
);

/**
 * GET /api/proveedores/:id_proveedor
 * Obtiene el detalle de un proveedor específico por su ID.
 * Útil para mostrar la ficha completa del proveedor en el frontend.
 */
router.get(
    "/proveedores/:id_proveedor",
    obtenerProveedorValidation,
    validarCampos,
    ProveedorController.obtenerProveedorPorId
);

/**
 * PATCH /api/proveedores/:id_proveedor
 * Actualiza uno o varios campos de un proveedor existente.
 * Si se envía un nuevo NIT, valida que no choque con otro proveedor.
 * Body esperado: cualquier combinación de los campos del proveedor.
 */
router.patch(
    "/proveedores/:id_proveedor",
    actualizarProveedorValidation,
    validarCampos,
    ProveedorController.actualizarProveedor
);

/**
 * DELETE /api/proveedores/:id_proveedor
 * Elimina un proveedor de forma LÓGICA (soft delete).
 * No borra el registro físicamente: llena la columna deleted_at.
 * Esto preserva el historial de compras/asociaciones ya realizadas
 * con ese proveedor, aunque ya no aparezca en los listados activos.
 */
router.delete(
    "/proveedores/:id_proveedor",
    eliminarProveedorValidation,
    validarCampos,
    ProveedorController.eliminarProveedor
);

/**
 * PATCH /api/proveedores/:id_proveedor/restaurar
 * Reactiva un proveedor que había sido eliminado lógicamente
 * (revierte el soft delete, limpia deleted_at).
 * Útil si el proveedor fue desactivado por error o vuelve a operar.
 */
router.patch(
    "/proveedores/:id_proveedor/restaurar",
    obtenerProveedorValidation,
    validarCampos,
    ProveedorController.restaurarProveedor
);

// ============================================================
// ASOCIACIÓN PROVEEDOR <-> PRODUCTO
// Gestiona qué productos (ya existentes en el catálogo) ofrece
// cada proveedor, y a qué precio de compra. NO crea productos
// nuevos, solo vincula productos y proveedores ya registrados.
// ============================================================

/**
 * POST /api/proveedores/:id_proveedor/productos
 * Asocia un producto existente a un proveedor existente, definiendo
 * el precio de compra pactado para esa combinación específica.
 * Valida que: el proveedor exista, el producto exista, y que la
 * asociación no exista ya previamente (evita duplicados).
 * Body esperado: { fk_producto_proveedor_id_producto, precio_compra }
 */
router.post(
    "/proveedores/:id_proveedor/productos",
    asociarProductoProveedorValidation,
    validarCampos,
    ProveedorController.asociarProducto
);

/**
 * GET /api/proveedores/:id_proveedor/productos
 * Lista todos los productos que un proveedor específico tiene
 * asociados, junto con el precio de compra pactado para cada uno.
 * Útil para ver el "catálogo" completo de un proveedor.
 */
router.get(
    "/proveedores/:id_proveedor/productos",
    obtenerProductosDeProveedorValidation,
    validarCampos,
    ProveedorController.obtenerProductosDeProveedor
);

/**
 * GET /api/productos/:id_producto/proveedores
 * Lista todos los proveedores que ofrecen un producto específico,
 * junto con el precio de compra de cada uno.
 * Útil para comparar precios entre proveedores antes de comprar
 * o generar una orden de compra/ingreso de mercancía.
 */
router.get(
    "/productos/:id_producto/proveedores",
    obtenerProveedoresDeProductoValidation,
    validarCampos,
    ProveedorController.obtenerProveedoresDeProducto
);

/**
 * PATCH /api/proveedor-producto/:id_proveedor_producto
 * Actualiza únicamente el precio de compra de una asociación
 * proveedor-producto ya existente (por ejemplo, si el proveedor
 * sube o baja sus precios).
 * Body esperado: { precio_compra }
 */
router.patch(
    "/proveedor-producto/:id_proveedor_producto",
    actualizarPrecioCompraValidation,
    validarCampos,
    ProveedorController.actualizarPrecioCompra
);

/**
 * DELETE /api/proveedor-producto/:id_proveedor_producto
 * Elimina la asociación entre un proveedor y un producto
 * (eliminación física de la tabla puente, ya que no maneja
 * soft delete). El proveedor deja de ofrecer ese producto,
 * pero ni el proveedor ni el producto se ven afectados.
 */
router.delete(
    "/proveedor-producto/:id_proveedor_producto",
    eliminarAsociacionValidation,
    validarCampos,
    ProveedorController.eliminarAsociacion
);

export default router;