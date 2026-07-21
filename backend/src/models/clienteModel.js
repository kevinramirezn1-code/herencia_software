import { DataTypes } from "sequelize";
import sequelize from "../configuration/database.js";

const Cliente = sequelize.define('Cliente', {
    id_cliente:{
        type: DataTypes.INTEGER,
        primaryKey,
        autoIncrement: true,
        field: 'id_cliente'
    },
    identificación:{
        type: DataTypes.STRING(45),
        allowNull: false,
        field: 'identificación'
    },
    nombre_cliente:{
        type: DataTypes.STRING(45),
        allowNull: false,
        field: 'nombre_cliente'
    },
    apellido_cliente:{
        type: DataTypes.STRING(45),
        allowNull: false,
        field: 'apellido_cliente'
    },
    telefono_cliente:{
        type: DataTypes.STRING(45),
        allowNull: false,
        field: 'telefono_cliente'
    },
    correo_cliente:{
        type: DataTypes.STRING(45),
        allowNull: false,
        field: 'correo_cliente'
    },
    direccion_cliente:{
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'direccion_cliente'
    },
    
})

export default Cliente;
