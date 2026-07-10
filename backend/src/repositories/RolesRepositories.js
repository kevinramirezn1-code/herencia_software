import Rol from '../models/RolesModels.js';

class RolesRepository {
  async obtenerPorId(idrol) {
    return await Rol.findByPk(idrol);
  }

  async obtenerTodos() {
    return await Rol.findAll();
  }
}

export default new RolesRepository();
