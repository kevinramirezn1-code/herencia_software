import { DataTypes } from "sequelize";
import sequelize from "../configuration/database.js";
import Producto from "./ProductModels.js";

const Lote = sequelize.define('Lote', {
    id_lote: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        field: 'id_lote'
    },
    fk_lote_id_producto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'fk_lote_id_producto'
    },
    numero_lote: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'numero_lote'
    },
    cantidad_inicial: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'cantidad_inicial'
    },
    cantidad_actual: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'cantidad_actual'
    },
    fecha_produccion: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: 'fecha_produccion'
    },
    fecha_vencimiento: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'fecha_vencimiento'
    },
    fk_lote_id_ingreso: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'fk_lote_id_ingreso'
    }
}, {
    tableName: 'lote',
    createdAt: 'created_at',
    updatedAt: false
});


export default Lote;