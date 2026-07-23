import { DataTypes } from "sequelize";
import sequelize from "../configuration/database.js";

const DetVenta = sequelize.define('DetVenta', {

    id_detalleventa: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    precio_venta: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    iva_producto: {
        type: DataTypes.DECIMAL(5,2),
        allowNull: false
    },
    subtotal: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    total: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    fk_det_venta_id_venta: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fk_det_venta_id_producto: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},{
    tableName: 'det_venta',
    timestamps: false
}
)
export default DetVenta;