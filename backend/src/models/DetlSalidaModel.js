import { DataTypes } from "sequelize";
import sequelize from "../configuration/database.js";

const DetlSalida = sequelize.define(
    "DetlSalida",
    {
        id_det_salida: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        fk_det_salida_id_salida: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        fk_det_salida_id_producto: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        precio_unitario: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        },
        subtotal: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
        total: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
    },
    {
        tableName: "det_salida",
        timestamps: false,
    }
);

export default DetlSalida;