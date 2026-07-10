import sequelize from "../configuration/database.js";
import ingresoRepository from "../repositories/ingresoMercancia.repository.js";

/**
 * Registra una entrada de mercancía con sus detalles y actualiza
 * automáticamente el stock de cada producto.
 */
async function registrarEntrada(payload) {
  const { codigo_entrada, fecha, observacion, detalles } = payload;

  if (!codigo_entrada) {
    throw new Error("El código de entrada es obligatorio");
  }

  if (!Array.isArray(detalles) || detalles.length === 0) {
    throw new Error("Debe incluir al menos un producto en el detalle");
  }

  for (const d of detalles) {
    if (
      !d.fk_det_entrada_id_producto ||
      !d.cantidad ||
      d.cantidad <= 0 ||
      d.precio_unitario == null
    ) {
      throw new Error(
        "Cada detalle requiere producto, cantidad (>0) y precio_unitario"
      );
    }
  }

  return sequelize.transaction(async (t) => {
    const entrada = await ingresoRepository.crearEntrada(
      {
        codigo_entrada,
        fecha: fecha || new Date(),
        observacion: observacion || null,
        subtotal: 0,
        iva: 0,
        total: 0,
      },
      t
    );

    let subtotalGeneral = 0;
    let ivaGeneral = 0;

    for (const d of detalles) {
      const ivaProducto = d.iva != null ? Number(d.iva) : 0;
      const subtotalLinea = Number(d.cantidad) * Number(d.precio_unitario);
      const ivaLinea = subtotalLinea * (ivaProducto / 100);
      const totalLinea = subtotalLinea + ivaLinea;

      await ingresoRepository.crearDetalle(
        {
          fk_det_entrada_id_entrada: entrada.id_entrada,
          fk_det_entrada_id_producto: d.fk_det_entrada_id_producto,
          cantidad: d.cantidad,
          precio_unitario: d.precio_unitario,
          subtotal: subtotalLinea,
          iva: ivaLinea,
          total: totalLinea,
        },
        t
      );

      await ingresoRepository.incrementarStock(
        d.fk_det_entrada_id_producto,
        d.cantidad,
        t
      );

      subtotalGeneral += subtotalLinea;
      ivaGeneral += ivaLinea;
    }

    const totalGeneral = subtotalGeneral + ivaGeneral;

    await ingresoRepository.actualizarTotalesEntrada(
      entrada.id_entrada,
      {
        subtotal: subtotalGeneral,
        iva: ivaGeneral,
        total: totalGeneral,
      },
      t
    );

    return ingresoRepository.obtenerEntradaPorId(entrada.id_entrada);
  });
}

async function obtenerEntrada(id_entrada) {
  const entrada = await ingresoRepository.obtenerEntradaPorId(id_entrada);

  if (!entrada) {
    throw new Error("Entrada no encontrada");
  }

  return entrada;
}

async function listarEntradas() {
  return ingresoRepository.listarEntradas();
}

export default {
  registrarEntrada,
  obtenerEntrada,
  listarEntradas,
};