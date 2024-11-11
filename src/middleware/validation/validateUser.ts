// src/middleware/validateUser.ts

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { signupSchema, loginSchema } from '../../validationSchema/userSchema';

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
      const messages = error.errors.map(err => err.message).join(', ');
      res.status(400).json({ message: messages });
      return;
    }
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};


export default validateUser;

