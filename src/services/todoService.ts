import prisma from '../prisma/client';
import { Todo } from '@prisma/client';

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
  return await prisma.todo.findMany({
    where: { userId },
  });
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
