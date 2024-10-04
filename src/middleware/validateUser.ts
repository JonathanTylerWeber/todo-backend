// src/middleware/validateUser.ts

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { signupSchema, loginSchema } from '../schemas/userSchema';

const validateUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.originalUrl.includes('/signup')) {
      signupSchema.parse(req.body);
    } else if (req.originalUrl.includes('/login')) {
      loginSchema.parse(req.body);
    }
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      console.log('Validation error:', error.errors);
      const messages = error.errors.map(err => err.message).join(', ');
      res.status(400).json({ message: messages });
      return;
    }
    console.error('Unexpected error:', error);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};


export default validateUser;

