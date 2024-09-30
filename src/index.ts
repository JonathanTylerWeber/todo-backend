// index.ts
import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan'
import prisma from './prisma/client';
import helmet from 'helmet';
import todoRoutes from './routes/todoRoutes';
import authRoutes from './routes/authRoutes';
import { errorHandler } from "./middleware/errorHandler";
import { NotFoundError } from "./middleware/expressError";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

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

// Listen for termination signals
process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing Prisma Client');
  await prisma.$disconnect(); // Gracefully disconnect from the database
  process.exit(0); // Exit the process
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing Prisma Client');
  await prisma.$disconnect(); // Gracefully disconnect from the database
  process.exit(0); // Exit the process
});

// start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
