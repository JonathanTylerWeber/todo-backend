// src/middleware/errors/errorHandler.ts
import { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import { ExpressError } from "./expressError";
import morgan from "morgan";

// Create a custom logger for errors using Morgan
const errorLogger = morgan('combined', {
  skip: (req, res) => res.statusCode < 400, // Only log errors
});

export const errorHandler: ErrorRequestHandler = (
  error: ExpressError | Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Use Morgan to log errors
  errorLogger(req, res, () => { });

  if (error instanceof ExpressError) {
    console.error("Error:", error);
    res.status(error.status).json({ message: error.message });
  } else {
    // Log unexpected errors with more context
    console.error("Error:", error);
    console.error("Unexpected Error:", {
      message: error.message,
      stack: error.stack,
      path: req.originalUrl,
      method: req.method,
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};
