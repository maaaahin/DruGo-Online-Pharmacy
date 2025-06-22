import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from './routes/authRoute.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// App init
const app = express();

// Env config
dotenv.config();

// Connect to DB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/products', productRoutes);

// Serve frontend static files
const buildPath = join(__dirname, './client/build');
app.use(express.static(buildPath));

// Catch-all route (for React Router)
app.get('*', (req, res) => {
  res.sendFile(join(buildPath, 'index.html'));
});

// Server listen
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white);
});
