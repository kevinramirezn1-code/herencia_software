import Categoria from '../models/CategoriesModels.js';

class CategoriaRepository {

  async obtenerPorId(id_categoria) {
    return await Categoria.findByPk(id_categoria);
  }

  async obtenerTodos() {
    return await Categoria.findAll();
  }
}

export default new CategoriaRepository();