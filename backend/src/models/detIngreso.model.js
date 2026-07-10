import { DataTypes } from "sequelize";
import sequelize from "../configuration/database.js";

const DetIngreso = sequelize.define(
  "DetIngreso",
  {
    id_det_entrada: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fk_det_entrada_id_entrada: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fk_det_entrada_id_producto: {
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
    iva: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
  },
  {
    tableName: "det_entrada",
    timestamps: false,
  }
);

export default DetIngreso;