// src/routes/authRoutes.ts
import { Router } from "express";
import rateLimit from "express-rate-limit"; // Import express-rate-limit
import asyncHandler from "../middleware/asyncHandler";
import validateUser from '../middleware/validateUser';
import * as AuthController from "../controllers/authController";

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
router.post("/signup", limiter, validateUser, asyncHandler(AuthController.signup));
router.post("/login", limiter, validateUser, asyncHandler(AuthController.login));

export default router;
