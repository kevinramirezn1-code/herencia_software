import express from 'express';

const app = express();

app.use(express.json());

// Configurar CORS
app.use(cors({
    origin: 'http://localhost:5173', // Puerto del frontend
    methods: 'GET,POST,PUT,DELETE', // Metodos permitidos
    allowedHeaders: 'Content-Type,Authorization' // Encabezados permitidos
}));


// Rutas de la API, solo como ejemplo
// app.use('/api/auth', authRoutes);

export default app;
