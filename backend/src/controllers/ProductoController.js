import productoService from '../services/ProductoService.js';

class ProductoController {

  // HU-INV-01: Registrar producto
  async registrarProducto(req, res, next) {
    try {
      const nuevoProducto = await productoService.registrarProducto(req.body);

      return res.status(201).json({
        success: true,
        message: 'Producto registrado exitosamente.',
        data: nuevoProducto
      });

    } catch (error) {
      next(error);
    }
  }

  // HU-INV-02: Actualizar producto
  async actualizarProducto(req, res, next) {
    try {
      const { id } = req.params;
      const productoActualizado = await productoService.actualizarProducto(id, req.body);

      return res.status(200).json({
        success: true,
        message: 'Producto actualizado exitosamente.',
        data: productoActualizado
      });

    } catch (error) {
      next(error);
    }
  }

  // HU-INV-03: Eliminar producto
  async eliminarProducto(req, res, next) {
    try {
      const { id } = req.params;
      const productoEliminado = await productoService.eliminarProducto(id);

      return res.status(200).json({
        success: true,
        message: 'Producto eliminado exitosamente.',
        data: productoEliminado
      });

    } catch (error) {
      next(error);
    }
  }

  // ============================================
  // HU-INV-006: Consultar existencias
  // ============================================

  async listarProductos(req, res, next) {
    try {
      const productos = await productoService.obtenerTodos();

      return res.status(200).json({
        success: true,
        total: productos.length,
        data: productos
      });

    } catch (error) {
      next(error);
    }
  }

  async obtenerProductoPorCodigo(req, res, next) {
    try {
      const { codigo } = req.params;
      const producto = await productoService.obtenerPorCodigo(codigo);

      if (!producto) {
        return res.status(404).json({
          success: false,
          message: `No existe un producto con el código '${codigo}'.`
        });
      }

      return res.status(200).json({
        success: true,
        data: producto
      });

    } catch (error) {
      next(error);
    }
  }

  async obtenerProductoPorId(req, res, next) {
    try {
      const { id } = req.params;
      const producto = await productoService.obtenerPorId(id);

      if (!producto) {
        return res.status(404).json({
          success: false,
          message: `No existe un producto con el id ${id}.`
        });
      }

      return res.status(200).json({
        success: true,
        data: producto
      });

    } catch (error) {
      next(error);
    }
  }

  async listarProductosConStock(req, res, next) {
    try {
      const productos = await productoService.obtenerProductosConStock();

      return res.status(200).json({
        success: true,
        total: productos.length,
        data: productos
      });

    } catch (error) {
      next(error);
    }
  }

  async listarProductosSinStock(req, res, next) {
    try {
      const productos = await productoService.obtenerProductosSinStock();

      return res.status(200).json({
        success: true,
        total: productos.length,
        data: productos
      });

    } catch (error) {
      next(error);
    }
  }

  async listarProductosStockBajo(req, res, next) {
    try {
      const { umbral } = req.query;
      const umbralNumerico = umbral ? parseInt(umbral, 10) : undefined;

      const productos = await productoService.obtenerProductosConStockBajo(umbralNumerico);

      return res.status(200).json({
        success: true,
        total: productos.length,
        data: productos
      });

    } catch (error) {
      next(error);
    }
  }
}

export default new ProductoController();