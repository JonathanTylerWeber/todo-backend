import { Request, Response } from "express";
import * as AuthService from "../services/authService";

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const { user, token } = await AuthService.signup(username, email, password);
    res.status(200).json({ message: "User Created Successfully!!!", token });
  } catch (error: unknown) {
    console.error("Error signing up:", error);
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Unknown error occurred" });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await AuthService.login(email, password);

    if (!user) {
      res.status(401).send("Unauthorized !!!");
      return;
    }

    res.status(200).json({ token, message: "Logged in Successfully!!!" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
