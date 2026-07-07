import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import sequelize from "./configuration/database.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Base de datos conectada correctamente");

        app.listen(PORT, () => {
            console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`);
        });

    } catch (error) {
        console.error("❌ Error conectando la base de datos:", error);
        process.exit(1);
    }
};

startServer();