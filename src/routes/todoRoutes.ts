import { Router } from "express";
import asyncHandler from "../middleware/asyncHandler";
import {
  createTodoHandler,
  updateTodoHandler,
  deleteTodoHandler,
  getUserTodosHandler,
} from "../controllers/todoController";
import { validateUserId, checkTodoOwnership, authenticateToken } from "../middleware/auth";

const router = Router();

router.get("/", authenticateToken, validateUserId, asyncHandler(getUserTodosHandler));
router.post("/", authenticateToken, validateUserId, asyncHandler(createTodoHandler));
router.patch("/:id", authenticateToken, validateUserId, checkTodoOwnership, asyncHandler(updateTodoHandler));
router.delete("/:id", authenticateToken, validateUserId, checkTodoOwnership, asyncHandler(deleteTodoHandler));


export default router;
