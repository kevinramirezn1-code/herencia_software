import Producto from '../models/ProductModels.js';
import Categoria from '../models/CategoriesModels.js';

class ProductoRepository {

  // HU-INV-01: Registrar producto
  async crear(datosProducto) {
    return await Producto.create(datosProducto);
  }

  // Util para validar duplicados antes de crear (lo usara el service)
  async obtenerPorCodigo(codigo_producto) {
    return await Producto.findOne({ where: { codigo_producto } });
  }

  async obtenerPorId(id_producto) {
    return await Producto.findByPk(id_producto, {
      include: { model: Categoria, as: 'categoria' }
    });
  }

  async obtenerTodos() {
    return await Producto.findAll({
      include: { model: Categoria, as: 'categoria' }
    });
  }

  // HU-INV-02: Actualizar producto
  async actualizar(id_producto, datosActualizados) {
    const producto = await Producto.findByPk(id_producto);
    if (!producto) return null;

    return await producto.update(datosActualizados);
  }

  // HU-INV-03: Eliminar producto (soft delete gracias a "paranoid" en el modelo)
  async eliminar(id_producto) {
    const producto = await Producto.findByPk(id_producto);
    if (!producto) return null;

    await producto.destroy();
    return producto;
  }
}

// Se exporta una unica instancia (singleton): toda la app comparte el mismo repository
export default new ProductoRepository();