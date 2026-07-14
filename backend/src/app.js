import express from 'express';
import cors from "cors";
import "./models/associations-ingreso.js"; // fuerza el registro de relaciones antes de cualquier ruta

import productoRoutes from './routes/ProductoRoutes.js';
import authRoutes from './routes/authRoutes.js';
import ingresoMercanciaRoutes from "./routes/IngresoMercancia.routes.js";
import salidaMercanciaRoutes from "./routes/SalidaMercancia.routes.js";
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(express.json());

// Configurar CORS
app.use(cors({
    origin: 'http://localhost:5173', // Puerto del frontend
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}));

// Rutas de la API
app.use('/api/productos', productoRoutes);
app.use('/api/ingreso-mercancia', ingresoMercanciaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/salida-mercancia', salidaMercanciaRoutes);

// Manejo de rutas no encontradas (404)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
    });
});

// Middleware de manejo de errores global
app.use(errorHandler);

export default app;