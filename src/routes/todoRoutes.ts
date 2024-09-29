import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import {
  createTodoHandler,
  updateTodoHandler,
  getAllTodosHandler,
  deleteTodoHandler,
} from "../controllers/todoController";

const router = Router();

router.post("/", authenticateToken, createTodoHandler);
router.patch("/:id", authenticateToken, updateTodoHandler);
router.get("/", authenticateToken, getAllTodosHandler);
router.delete("/:id", authenticateToken, deleteTodoHandler);

export default router;
