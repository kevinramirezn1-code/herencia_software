import { DataTypes } from "sequelize";
import sequelize from "../configuration/database.js";

const Cliente = sequelize.define('Cliente', {
    id_cliente: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_clientes'
    },
    identificacion: {
        type: DataTypes.INTEGER, // ⚠️ es INT en la BD, no STRING
        allowNull: false,
        field: 'identificacion'
    },
    nombre_cliente: {
        type: DataTypes.STRING(45),
        allowNull: false,
        field: 'nombre_cliente'
    },
    apellido_cliente: {
        type: DataTypes.STRING(45),
        allowNull: true, // en la BD permite NULL
        field: 'apellido_cliente'
    },
    telefono_cliente: {
        type: DataTypes.STRING(45),
        allowNull: true, // en la BD permite NULL
        field: 'telefono_clientes'
    },
    correo_cliente: {
        type: DataTypes.STRING(45),
        allowNull: true, // en la BD permite NULL
        field: 'correo_clientes'
    },
    direccion_cliente: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'direccion_clientes' // una sola "r", sin el typo que asumí antes
    },
    ciudad_cliente: {
        type: DataTypes.STRING(45),
        allowNull: true,
        field: 'ciudad_clientes' // plural, no singular
    },
}, {
    tableName: 'clientes',
    timestamps: false
});

export default Cliente;