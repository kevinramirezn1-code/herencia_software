import { Op } from "sequelize";
import Producto from '../models/ProductModels.js';
import Categoria from '../models/CategoriesModels.js';

class ProductoRepository {

  async crear(datosProducto) {
    return await Producto.create(datosProducto);
  }

  async obtenerPorCodigo(codigo_producto) {
    return await Producto.findOne({ where: { codigo_producto } });
  }

  async obtenerPorId(id_producto, options = {}) {
    return await Producto.findByPk(id_producto, {
      include: { model: Categoria, as: 'categoria' },
      ...options
    });
  }

  async obtenerTodos() {
    return await Producto.findAll({
      include: { model: Categoria, as: 'categoria' }
    });
  }

  async actualizar(id_producto, datosActualizados) {
    const producto = await Producto.findByPk(id_producto);
    if (!producto) return null;
    return await producto.update(datosActualizados);
  }

  async eliminar(id_producto) {
    const producto = await Producto.findByPk(id_producto);
    if (!producto) return null;
    await producto.destroy();
    return producto;
  }

  // Se mantiene por si ya se usa en otras funcionalidades (ej. ajuste manual de stock)
  async actualizarStock(id_producto, nuevoStock, transaction = null) {
    return await Producto.update({ stock: nuevoStock }, { where: { id_producto }, transaction });
  }

  // Usado por Ingreso de mercancía (suma stock de forma atómica)
  async incrementarStock(id_producto, cantidad, transaction = null) {
    return await Producto.increment("stock", { by: cantidad, where: { id_producto }, transaction });
  }

  // Usado por Salida de mercancía (resta stock de forma atómica)
  async decrementarStock(id_producto, cantidad, transaction = null) {
    return await Producto.decrement("stock", { by: cantidad, where: { id_producto }, transaction });
  }

  // ============================================
  // HISTORIA DE USUARIO: CONSULTAR EXISTENCIAS INV-006
  // ============================================

  
  // Obtener productos sin stock (stock <= 0)
  async obtenerProductosSinStock() {
    return await Producto.findAll({
      where: { stock: { [Op.lte]: 0 } },
      include: { model: Categoria, as: 'categoria' }
    });
  }

  // Obtener productos con stock (stock > 0)
  async obtenerProductosConStock() {
    return await Producto.findAll({
      where: { stock: { [Op.gt]: 0 } },
      include: { model: Categoria, as: 'categoria' }
    });
  }

  // Obtener productos con stock bajo (stock <= umbral, por defecto 10)
  async obtenerProductosConStockBajo(umbral = 10) {
    return await Producto.findAll({
      where: { stock: { [Op.lte]: umbral } },
      include: { model: Categoria, as: 'categoria' }
    });
  }
}

export default new ProductoRepository();