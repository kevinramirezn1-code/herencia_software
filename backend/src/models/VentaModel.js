import { DataTypes } from "sequelize";
import sequelize from "../configuration/database.js";

const Venta = sequelize.define('Venta', {
    id_venta: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true
    },
    numero_venta: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    fk_venta_id_cliente: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    fk_venta_id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    iva: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    descuento: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null
    }
}, {
    tableName: 'venta',
    timestamps: false
});

export default Venta;