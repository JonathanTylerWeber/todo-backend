// src/middleware/validation/validateTodo.ts

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import todoSchema from '../../validationSchema/todoSchema';

const validateTodo = (req: Request, res: Response, next: NextFunction) => {
  try {
    todoSchema.parse(req.body);
    next(); // Call next() if validation passes
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ message: error.errors });
      return;
    }
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

export default validateTodo;
