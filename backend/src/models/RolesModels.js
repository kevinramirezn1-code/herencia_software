import { DataTypes } from 'sequelize';
import sequelize from '../configuration/database.js';

const Rol = sequelize.define('Rol', {
  idrol: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'idrol'
  },
  nombre_rol: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'nombre_rol'
  },
  descripcion: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'descripcion'
  }
}, {
  tableName: 'rol',
  timestamps: false
});

export default Rol;
