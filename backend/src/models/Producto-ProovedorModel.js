import { DataTypes } from "sequelize";
import sequelize from "../configuration/database.js";

const ProductoProveedor = sequelize.define('ProductoProveedor', {
    id_proveedor_producto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        field: 'id_proveedor_producto'
    },
    fk_producto_proveedor_id_proveedor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'fk_producto_proovedor_id_proovedor' // ⚠️ coincide con el typo real de la BD
    },
    fk_producto_proveedor_id_producto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'fk_producto_proovedor_id_producto' // ⚠️ coincide con el typo real de la BD
    },
    precio_compra: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'precio_compra'
    }
}, {
    tableName: 'proveedor_producto',
    timestamps: false
});

export default ProductoProveedor;