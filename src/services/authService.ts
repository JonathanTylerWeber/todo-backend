import jwt from "jsonwebtoken";
import prisma from '../prisma/client';
import bcrypt from 'bcrypt';
import { BadRequestError, ConflictError, UnauthorizedError } from "../middleware/expressError";


export const signup = async (username: string, email: string, password: string) => {
  if (!username || !email || !password) throw new BadRequestError("All fields are required.");

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new ConflictError("User with this email already exists.");

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: { username, password: hashedPassword, email },
  });

  const token = jwt.sign({ username, userId: newUser.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
  return { user: newUser, token };
};


export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new UnauthorizedError("Invalid email or password.");
  }

  const token = jwt.sign({ email, userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
  return { user, token };
};
