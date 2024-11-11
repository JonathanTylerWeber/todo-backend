// src/index.ts
import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan'
import helmet from 'helmet';
import todoRoutes from './routes/todoRoutes';
import authRoutes from './routes/authRoutes';
import { errorHandler } from "./middleware/errors/errorHandler";
import { NotFoundError } from "./middleware/errors/expressError";

dotenv.config();
const app = express();

app.use(cors());
app.use(helmet()); // Use helmet for security headers
app.use(express.json());
app.use(morgan('tiny')); //logging

app.use('/todos', todoRoutes);
app.use('/auth', authRoutes);

// Catch-all for 404 errors
app.use((req, res, next) => {
  next(new NotFoundError("Route Not Found"));
});

// Error handler
app.use(errorHandler);

export default app; 