// authRoutes.ts
import { Router } from "express";
import * as AuthController from "../controllers/authController";
import asyncHandler from "../middleware/asyncHandler";
import rateLimit from "express-rate-limit"; // Import express-rate-limit

const router = Router();

// Set up the rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    message: "Too many requests from this IP, please try again later."
  },
});

// Apply the rate limiter to the authentication routes
router.post("/signup", limiter, asyncHandler(AuthController.signup));
router.post("/login", limiter, asyncHandler(AuthController.login));

export default router;
