import { DataTypes } from "sequelize";
import sequelize from "../configuration/database.js";

const SalidaMercancia = sequelize.define(
    "SalidaMercancia",
    {
        id_salida: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        codigo_salida: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },

        fecha: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },

        subtotal: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
        },

        total: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
        },

        observacion: {
            type: DataTypes.STRING(250),
            allowNull: true,
        },
    },
    {
        tableName: "salida_mercancia",
        timestamps: false,
    }
);

export default SalidaMercancia;