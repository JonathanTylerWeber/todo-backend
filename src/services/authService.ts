import jwt from "jsonwebtoken";
import prisma from '../prisma/client';
import bcrypt from 'bcrypt';

export const signup = async (username: string, email: string, password: string) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("User with this email already exists.");

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: { username, password: hashedPassword, email },
  });

  const token = jwt.sign({ username, userId: newUser.id }, process.env.JWT_SECRET as string);
  return { user: newUser, token };
};

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email, userId: user.id }, process.env.JWT_SECRET as string);
    return { user, token };
  }
  return { user: null };
};
