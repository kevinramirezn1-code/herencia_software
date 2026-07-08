import { DataTypes } from 'sequelize';
import sequelize from '../configuration/database.js';

const Categoria = sequelize.define('Categoria', {
  id_categoria: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_categoria'
  },
  nombre_categoria: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'nombre_categoria'
  },
  descripcion: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'descripcion'
  }
}, {
  tableName: 'categoria',
  timestamps: false
});

export default Categoria;