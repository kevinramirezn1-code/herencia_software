import { DataTypes } from 'sequelize';
import sequelize from '../configuration/database.js';
import Rol from './RolesModels.js';

const Usuario = sequelize.define('Usuario', {
  idusuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'idusuario'
  },
  nombre_usuario: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'nombre_usuario'
  },
  apellido_usuario: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'apellido_usuario'
  },
  correo_usuario: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    field: 'correo_usuario'
  },
  contraseña_usuario: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'contraseña_usuario'
  },
  telefono_usuario: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'telefono_usuario'
  },
  fk_usuario_id_rol: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'fk_usuario_id_rol',
    references: {
      model: Rol,
      key: 'idrol'
    }
  }
}, {
  tableName: 'usuario',
  timestamps: false
});

// Relaciones: un usuario pertenece a un rol, un rol tiene muchos usuarios
Usuario.belongsTo(Rol, { foreignKey: 'fk_usuario_id_rol', as: 'rol' });
Rol.hasMany(Usuario, { foreignKey: 'fk_usuario_id_rol', as: 'usuarios' });

export default Usuario;
