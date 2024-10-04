// src/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import * as TodoService from "../services/todoService";
import { ForbiddenError, NotFoundError, UnauthorizedError } from "./expressError";

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new UnauthorizedError("Unauthorized: Token not provided"));
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) {
      return next(new ForbiddenError("Forbidden: Invalid Token"));
    }

    if (user && typeof user === 'object') {
      req.userId = (user as JwtPayload).userId; // Ensure userId is set
    }

    next(); // Proceed to the next middleware
  });
};

export const validateUserId = (req: Request, res: Response, next: NextFunction): void => {
  const userId = req.userId;
  if (typeof userId !== 'number') {
    return next(new UnauthorizedError("Unauthorized: Invalid user ID"));
  }
  next();
};

export const checkTodoOwnership = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.userId;
  const todoId = parseInt(req.params.id);
  const todo = await TodoService.getTodoById(todoId);

  if (!todo) {
    return next(new NotFoundError("Todo does not exist"));
  }

  if (todo.userId !== userId) {
    return next(new ForbiddenError("You do not have permission to access this todo"));
  }

  next();
};