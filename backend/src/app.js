import express from 'express';
import cors from "cors";
import productoRoutes from './routes/ProductoRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import ingresoMercanciaRoutes from "./routes/IngresoMercancia.routes.js";

const app = express();

app.use(express.json());

// Configurar CORS
app.use(cors({
    origin: 'http://localhost:5173', // Puerto del frontend
    methods: 'GET,POST,PUT,DELETE', // Metodos permitidos
    allowedHeaders: 'Content-Type,Authorization' // Encabezados permitidos
}));


// Rutas de la API
app.use('/api/productos', productoRoutes);
app.use('/api/ingreso-mercancia', ingresoMercanciaRoutes);
app.use('/api/auth', authRoutes);

//este es el middleware de manejo de errores global bro
app.use(errorHandler);

export default app;