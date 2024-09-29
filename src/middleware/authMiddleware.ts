import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).send("Unauthorized: Token not provided");
    return; // End the function here
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) {
      res.status(403).send("Forbidden: Invalid Token");
      return; // End the function here
    }

    if (user && typeof user === 'object') {
      req.userId = (user as JwtPayload).userId; // Ensure userId is set
    }

    next(); // Proceed to the next middleware
  });
};