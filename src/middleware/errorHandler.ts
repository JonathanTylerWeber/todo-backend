import { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import { ExpressError } from "./expressError";

export const errorHandler: ErrorRequestHandler = (
  error: ExpressError | Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Error:", error); // Log the error for debugging

  if (error instanceof ExpressError) {
    res.status(error.status).json({ message: error.message });
  } else {
    // Log unexpected errors with more context
    console.error("Unexpected Error:", {
      message: error.message,
      stack: error.stack,
      path: req.originalUrl,
      method: req.method,
    });

    res.status(500).json({ message: "Internal Server Error" });
  }
};
