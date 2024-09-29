import { Request, Response, NextFunction } from "express";

const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the error for debugging

  if (err instanceof Error) {
    // If the error is an instance of the Error class, send the error message
    res.status(500).json({ message: err.message });
    return;
  }

  // For any other type of error, send a generic message
  res.status(500).json({ message: "Something went wrong" });
};

export default errorHandler;