import { DataTypes } from "sequelize";
import sequelize from "../configuration/database.js";

const DetVentaLote = sequelize.define('DetVentaLote', {
    id_det_venta_lote: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_det_venta_lote'
    },
    fk_det_venta_lote_id_detalleventa: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'fk_det_venta_lote_id_detalleventa'
    },
    fk_det_venta_lote_id_lote: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'fk_det_venta_lote_id_lote'
    },
    cantidad_tomada: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'cantidad_tomada'
    }
}, {
    tableName: 'det_venta_lote',
    timestamps: false
});

export default DetVentaLote;