import { DataTypes } from "sequelize";
import sequelize from "../configuration/database.js";

const IngresoMercancia = sequelize.define(
  "IngresoMercancia",
  {
    id_entrada: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    codigo_entrada: {
      type: DataTypes.STRING,
      allowNull: false,
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
    iva: {
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
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "ingreso_mercancia",
    timestamps: false,
  }
);

export default IngresoMercancia;