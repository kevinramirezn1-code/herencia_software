import ingresoService from "../services/ingresoMercancia.service.js";

async function registrarEntrada(req, res) {
  try {
    const entrada = await ingresoService.registrarEntrada(req.body);

    return res.status(201).json({
      mensaje: "Entrada de mercancía registrada correctamente",
      data: entrada,
    });

  } catch (error) {
    return res.status(400).json({
      mensaje: error.message,
    });
  }
}

async function obtenerEntrada(req, res) {
  try {
    const entrada = await ingresoService.obtenerEntrada(req.params.id);

    return res.status(200).json({
      data: entrada,
    });

  } catch (error) {
    return res.status(404).json({
      mensaje: error.message,
    });
  }
}

async function listarEntradas(req, res) {
  try {
    const entradas = await ingresoService.listarEntradas();

    return res.status(200).json({
      data: entradas,
    });

  } catch (error) {
    return res.status(500).json({
      mensaje: error.message,
    });
  }
}

export default {
  registrarEntrada,
  obtenerEntrada,
  listarEntradas,
};