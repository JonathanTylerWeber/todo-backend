// src/routes/todoRoutes.ts

import { Router } from "express";
import asyncHandler from "../middleware/asyncHandler";
import {
  createTodo,
  updateTodo,
  deleteTodo,
  getUserTodos,
} from "../controllers/todoController";
import { validateUserId, checkTodoOwnership, authenticateToken } from "../middleware/auth";
import validateTodo from "../middleware/validation/validateTodo";

const router = Router();

router.get("/", authenticateToken, validateUserId, asyncHandler(getUserTodos));
router.post("/", authenticateToken, validateUserId, validateTodo, asyncHandler(createTodo));
router.patch("/:id", authenticateToken, validateUserId, asyncHandler(checkTodoOwnership), validateTodo, asyncHandler(updateTodo));
router.delete("/:id", authenticateToken, validateUserId, asyncHandler(checkTodoOwnership), asyncHandler(deleteTodo));


export default router;
