import NotificacionService from '../services/NotificacionService.js';

class NotificacionController {

  async notificarStockMinimo(req, res, next) {
    try {
      const { umbral } = req.query;
      const umbralNumerico = umbral ? parseInt(umbral, 10) : undefined;

      const resultado = await NotificacionService.notificarStockMinimo(umbralNumerico);
      return res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  async notificarProductosProximosAVencer(req, res, next) {
    try {
      const { dias } = req.query;
      const diasNumerico = dias ? parseInt(dias, 10) : undefined;

      const resultado = await NotificacionService.notificarProductosProximosAVencer(diasNumerico);
      return res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  async notificarProductosAgotados(req, res, next) {
    try {
      const resultado = await NotificacionService.notificarProductosAgotados();
      return res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }
}

export default new NotificacionController();