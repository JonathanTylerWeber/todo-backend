// src/controllers/authController.ts
import { Request, Response } from "express";
import * as AuthService from "../services/authService";


export const signup = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const { token } = await AuthService.signup(username, email, password);
  res.status(201).json({ message: "User created successfully", token });
};


export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { token } = await AuthService.login(email, password);
  res.status(200).json({ token, message: "Logged in successfully" });
};
