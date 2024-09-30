import { Router } from "express";
import asyncHandler from "../middleware/asyncHandler";
import {
  createTodoHandler,
  updateTodoHandler,
  deleteTodoHandler,
  getUserTodosHandler,
} from "../controllers/todoController";
import { validateUserId, checkTodoOwnership, authenticateToken } from "../middleware/auth";
import validateTodo from "../middleware/validateTodo";

const router = Router();

router.get("/", authenticateToken, validateUserId, asyncHandler(getUserTodosHandler));
router.post("/", authenticateToken, validateUserId, validateTodo, asyncHandler(createTodoHandler));
router.patch("/:id", authenticateToken, validateUserId, checkTodoOwnership, validateTodo, asyncHandler(updateTodoHandler));
router.delete("/:id", authenticateToken, validateUserId, checkTodoOwnership, asyncHandler(deleteTodoHandler));


export default router;
