import express from "express";
import todoRoutes from './routes/todoRoutes';
import authRoutes from './routes/authRoutes'
import cors from 'cors';
import errorHandler from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use('/todos', todoRoutes);
app.use('/auth', authRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
