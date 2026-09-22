import { DataTypes } from "sequelize";
import sequelize from "../configuration/database.js";

const Proveedor = sequelize.define('Proveedor', {
    id_proveedor: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        field: 'id_proovedores'
    },
    nit: {
        type: DataTypes.STRING(45),
        allowNull: false,
        field: 'nit'
    },
    razon_social: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'razon_social'
    },
    telefono_proveedor: {
        type: DataTypes.STRING(45),
        allowNull: false,
        field: 'telefono_proovedor'
    },
    direccion: {
        type: DataTypes.STRING(45),
        allowNull: false,
        field: 'dirreccion'
    },
    ciudad: {
        type: DataTypes.STRING(45),
        allowNull: true,
        field: 'ciudad'
    }
}, {
    tableName: 'proovedores',
    timestamps: false,
    paranoid: true,
    deletedAt: 'deleted_at'
});

export default Proveedor;