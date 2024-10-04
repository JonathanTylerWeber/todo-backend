// src/schemas/userSchema.ts
import { z } from 'zod';

const signupSchema = z.object({
  username: z.string({
    required_error: "Username is required",
    invalid_type_error: "Username must be a string",
  }).min(1, { message: "Username cannot be empty" }),

  email: z.string({
    required_error: "Email is required",
    invalid_type_error: "Email must be a string",
  })
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email cannot be empty" }),

  password: z.string({
    required_error: "Password is required",
    invalid_type_error: "Password must be a string",
  })
    .min(6, { message: "Password must be at least 6 characters long" })
    .min(1, { message: "Password cannot be empty" }),
});

const loginSchema = z.object({
  email: z.string({
    required_error: "Email is required",
    invalid_type_error: "Email must be a string",
  })
    .min(1, { message: "Email cannot be empty" })
    .email({ message: "Invalid email address" }),

  password: z.string({
    required_error: "Password is required",
    invalid_type_error: "Password must be a string",
  })
    .min(6, { message: "Password must be at least 6 characters long" })
    .min(1, { message: "Password cannot be empty" }),
});

export { signupSchema, loginSchema };
