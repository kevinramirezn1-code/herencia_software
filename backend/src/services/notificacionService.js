import ProductoService from '../services/ProductoService.js';
import AppError from '../utils/AppError.js';

class NotificacionService {
  async notificarStockMinimo() {
    try {
      const productos = await ProductoService.obtenerProductosConStockBajo();

      if (productos.length === 0) {
        return { message: 'No hay productos con stock mínimo.' };
      }

      // Aquí puedes implementar la lógica para enviar notificaciones, por ejemplo, enviar un correo electrónico o un mensaje a un sistema de mensajería.
      // Por ahora, simplemente retornamos los productos con stock mínimo.
      return { message: 'Productos con stock mínimo encontrados.', data: productos };
    } catch (error) {
      throw new AppError('Error al notificar sobre productos con stock mínimo.', 500);
    }
  }
  //notificar productos proximos a vencer
  async notificarProductosProximosAVencer(dias = 30) {
    try {
      const productos = await ProductoService.obtenerProductosProximosAVencer(dias);

      if (productos.length === 0) {
        return { message: `No hay productos próximos a vencer en los próximos ${dias} días.` };
      }

      // Aquí puedes implementar la lógica para enviar notificaciones, por ejemplo, enviar un correo electrónico o un mensaje a un sistema de mensajería.
      // Por ahora, simplemente retornamos los productos próximos a vencer.
      return { message: `Productos próximos a vencer en los próximos ${dias} días encontrados.`, data: productos };
    } catch (error) {
      throw new AppError('Error al notificar sobre productos próximos a vencer.', 500);
    }
  }

  //consultar productos agotdados
  async notificarProductosAgotados() {
    try {
      const productos = await ProductoService.obtenerProductosSinStock();

      if (productos.length === 0) {
        return { message: 'No hay productos agotados.' };
      }

      // Aquí puedes implementar la lógica para enviar notificaciones, por ejemplo, enviar un correo electrónico o un mensaje a un sistema de mensajería.
      // Por ahora, simplemente retornamos los productos agotados.
      return { message: 'Productos agotados encontrados.', data: productos };
    } catch (error) {
      throw new AppError('Error al notificar sobre productos agotados.', 500);
    }
  }
}

export default new NotificacionService();

