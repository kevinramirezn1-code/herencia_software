import productoRepository from '../repositories/ProductoRepositories.js';
import categoriaRepository from '../repositories/CategoriaRepositories.js';
import AppError from '../utils/AppError.js';
class ProductoService {
  // HU-INV-001: Registrar producto
  async registrarProducto(datos) {
    const {
      codigo_producto,
      nombre_producto,
      stock,
      costo_produccion,
      precio_venta,
      iva,
      fecha_produccion,
      fecha_vencimiento,
      fk_producto_id_categoria
    } = datos;
    // 1. Regla de negocio: la fecha de vencimiento no puede ser anterior a la fecha de producción
    if (
      fecha_produccion &&
      fecha_vencimiento &&
      new Date(fecha_vencimiento) < new Date(fecha_produccion)
    ) {
      throw new AppError(
        'La fecha de vencimiento no puede ser anterior a la fecha de producción.',
        400
      );
    }
    // 2. Regla de negocio: verificar que la categoría exista
    const categoriaExistente = await categoriaRepository.obtenerPorId(fk_producto_id_categoria);
    if (!categoriaExistente) {
      throw new AppError(
        `La categoría con id ${fk_producto_id_categoria} no existe.`,
        404
      );
    }
    // 3. Regla de negocio: verificar que el código del producto no esté registrado
    const productoExistente = await productoRepository.obtenerPorCodigo(codigo_producto);
    if (productoExistente) {
      throw new AppError(
        `Ya existe un producto con el código '${codigo_producto}'.`,
        409
      );
    }
    // 4. Construir el objeto del producto
    const producto = {
      codigo_producto,
      nombre_producto,
      stock: stock ?? 0,
      costo_produccion,
      precio_venta,
      iva: iva ?? 0,
      fecha_produccion: fecha_produccion ?? null,
      fecha_vencimiento: fecha_vencimiento ?? null,
      fk_producto_id_categoria
    };
    // 5. Registrar el producto
    const nuevoProducto = await productoRepository.crear(producto);
    return nuevoProducto;
  }

  // HU-INV-02: Actualizar producto
  async actualizarProducto(id_producto, datos) {
    // 1. Verificar que el producto exista
    const productoExistente = await productoRepository.obtenerPorId(id_producto);
    if (!productoExistente) {
      throw new AppError(`El producto con id ${id_producto} no existe.`, 404);
    }

    const {
      codigo_producto,
      fk_producto_id_categoria,
      fecha_produccion,
      fecha_vencimiento
    } = datos;

    // 2. Si viene una nueva categoria, verificar que exista
    if (fk_producto_id_categoria) {
      const categoriaExistente = await categoriaRepository.obtenerPorId(fk_producto_id_categoria);
      if (!categoriaExistente) {
        throw new AppError(`La categoría con id ${fk_producto_id_categoria} no existe.`, 404);
      }
    }

    // 3. Si viene un nuevo codigo_producto y es distinto al actual, verificar que no choque
    //    con el codigo de OTRO producto (por eso NO comparamos contra si mismo)
    if (codigo_producto && codigo_producto !== productoExistente.codigo_producto) {
      const productoConMismoCodigo = await productoRepository.obtenerPorCodigo(codigo_producto);
      if (productoConMismoCodigo) {
        throw new AppError(`Ya existe un producto con el código '${codigo_producto}'.`, 409);
      }
    }

    // 4. Validar fechas: como el update puede ser parcial, si solo mandan una fecha
    //    hay que compararla contra la que el producto YA tenia guardada
    const fechaProduccionFinal = fecha_produccion ?? productoExistente.fecha_produccion;
    const fechaVencimientoFinal = fecha_vencimiento ?? productoExistente.fecha_vencimiento;

    if (
      fechaProduccionFinal &&
      fechaVencimientoFinal &&
      new Date(fechaVencimientoFinal) < new Date(fechaProduccionFinal)
    ) {
      throw new AppError(
        'La fecha de vencimiento no puede ser anterior a la fecha de producción.',
        400
      );
    }

    // 5. Actualizar (update parcial: solo se sobrescriben los campos enviados)
    const productoActualizado = await productoRepository.actualizar(id_producto, datos);
    return productoActualizado;
  }

  // HU-INV-03: Eliminar producto (soft delete)
  async eliminarProducto(id_producto) {
    // Verificar que el producto exista antes de intentar eliminarlo
    const productoExistente = await productoRepository.obtenerPorId(id_producto);
    if (!productoExistente) {
      throw new AppError(`El producto con id ${id_producto} no existe.`, 404);
    }

    // El repository ya se encarga del soft delete (paranoid) via producto.destroy()
    const productoEliminado = await productoRepository.eliminar(id_producto);
    return productoEliminado;
  }

  // HU-INV-006 consultar existencias
  async obtenerPorCodigo(codigo_producto) {
    return await productoRepository.obtenerPorCodigo(codigo_producto);
  }
  async obtenerTodos() {
    return await productoRepository.obtenerTodos();
  }
  async obtenerProductosConStock() {
    return await productoRepository.obtenerProductosConStock();
  }
  async obtenerProductosSinStock() {
    return await productoRepository.obtenerProductosSinStock();
  }
    async obtenerProductosConStockBajo(umbral){
      return await productoRepository.obtenerProductosConStockBajo(umbral);
  }
  async obtenerProductosProximosAVencer(dias) {
    return await productoRepository.obtenerProductosProximosAVencer(dias);
  }

}
export default new ProductoService();