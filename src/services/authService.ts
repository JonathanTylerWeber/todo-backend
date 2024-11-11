// src/services/authService.ts
import jwt from "jsonwebtoken";
import prisma from '../client';
import bcrypt from 'bcrypt';
import { BadRequestError, ConflictError, UnauthorizedError } from "../middleware/errors/expressError";

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 13;


export const signup = async (username: string, email: string, password: string) => {
  if (!username || !email || !password) throw new BadRequestError("All fields are required.");

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new ConflictError("User with this email already exists.");

  const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
  const newUser = await prisma.user.create({
    data: { username, password: hashedPassword, email },
  });

  const token = jwt.sign({ username, id: newUser.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
  return { user: newUser, token };
};


export const login = async (email: string, password: string) => {
  if (!email || !password) throw new BadRequestError("All fields are required.");

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new UnauthorizedError("Invalid email");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new UnauthorizedError("Invalid password.");
  }

  const token = jwt.sign({ email, id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
  return { user, token };
};
