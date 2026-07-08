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
      // No manejamos el error aqui: lo pasamos al errorHandler global.
      // El controller no decide codigos HTTP de error, solo el de exito (201).
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
}

export default new ProductoController();