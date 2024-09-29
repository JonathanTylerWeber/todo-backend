import { PrismaClient, Todo } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const createUser = async (username: string, password: string, email: string) => {
  // Hash the password before saving it
  const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
  return await prisma.user.create({
    data: {
      username,
      password: hashedPassword, // Save the hashed password
      email,
    },
  });
};

export const checkUser = async (email: string, password: string) => {
  // Find the user by email
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  // If the user is found, check the password
  if (user && await bcrypt.compare(password, user.password)) {
    return user; // Return user if password is correct
  }

  return null; // Return null if user not found or password is incorrect
};

export const createTodo = async (userId: number, title: string, description: string) => {
  return await prisma.todo.create({
    data: {
      title,
      description,
      user: { connect: { id: userId } }
    },
  });
};

export const getAllTodos = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    include: {
      todos: true
    }
  });

  if (!user) {
    throw new Error(`User with username ${userId} not found`);
  }

  return user.todos;
};

export const updateTodo = async (todoId: number, data: Partial<Todo>) => {
  return await prisma.todo.update({
    where: { id: todoId },
    data,
  });
};

export const deleteTodo = async (todoId: number) => {
  return await prisma.todo.delete({
    where: { id: todoId },
  });
};

export default prisma;
