import {
  IngresoMercancia,
  DetIngreso,
  Producto,
} from "../models/associations-ingreso.js";

/**
 * Crea el encabezado de la entrada (ingreso_mercancia).
 */
async function crearEntrada(datosEntrada, transaction) {
  return IngresoMercancia.create(datosEntrada, { transaction });
}

/**
 * Crea un renglón de detalle (det_ingreso).
 */
async function crearDetalle(datosDetalle, transaction) {
  return DetIngreso.create(datosDetalle, { transaction });
}

/**
 * Incrementa el stock de un producto.
 */
async function incrementarStock(id_producto, cantidad, transaction) {
  const producto = await Producto.findByPk(id_producto, { transaction });

  if (!producto) {
    throw new Error(`Producto con id ${id_producto} no existe`);
  }

  producto.stock = Number(producto.stock) + Number(cantidad);
  await producto.save({ transaction });

  return producto;
}

/**
 * Actualiza los totales del encabezado de la entrada.
 */
async function actualizarTotalesEntrada(id_entrada, totales, transaction) {
  return IngresoMercancia.update(totales, {
    where: { id_entrada },
    transaction,
  });
}

/**
 * Obtiene una entrada con sus detalles y producto asociado.
 */
async function obtenerEntradaPorId(id_entrada) {
  return IngresoMercancia.findByPk(id_entrada, {
    include: [
      {
        model: DetIngreso,
        as: "detalles",
        include: [
          {
            model: Producto,
            as: "producto",
          },
        ],
      },
    ],
  });
}

async function listarEntradas() {
  return IngresoMercancia.findAll({
    include: [
      {
        model: DetIngreso,
        as: "detalles",
      },
    ],
    order: [["fecha", "DESC"]],
  });
}

export default {
  crearEntrada,
  crearDetalle,
  incrementarStock,
  actualizarTotalesEntrada,
  obtenerEntradaPorId,
  listarEntradas,
};