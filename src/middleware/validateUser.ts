import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import userSchema from '../schemas/userSchema';

const validateUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    userSchema.parse(req.body);
    next(); // Call next() if validation passes
  } catch (error) {
    if (error instanceof ZodError) {
      // Return a response if validation fails
      res.status(400).json({ message: error.errors });
      return;
    }

    // Handle other errors (optional)
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

export default validateUser;
