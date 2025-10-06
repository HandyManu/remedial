// app.js
import express from "express"
import cors from "cors"

// Importar rutas
import transactionRoutes from './src/routes/TransactionRoutes.js'
import categoryRoutes from './src/routes/CategoryRoutes.js'

const app = express();

// Middlewares
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:1573",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// Usar rutas
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);

export default app;