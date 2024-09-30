import { BadRequestError, NotFoundError } from '../middleware/expressError';
import prisma from '../prisma/client';
import { Todo } from '@prisma/client';


export const createTodo = async (userId: number, title: string, description: string) => {
  if (!title || !description) throw new BadRequestError("Title and description are required.");

  return await prisma.todo.create({
    data: {
      title,
      description,
      user: { connect: { id: userId } }
    },
  });
};


export const getUserTodos = async (userId: number) => {
  const todos = await prisma.todo.findMany({
    where: { userId },
  });

  if (!todos) throw new NotFoundError("No todos found for this user.");
  return todos;
};


export const getTodoById = async (todoId: number) => {
  const todo = await prisma.todo.findUnique({
    where: { id: todoId },
  });

  if (!todo) throw new NotFoundError("Todo not found.");
  return todo;
};


export const updateTodo = async (todoId: number, data: Partial<Todo>) => {
  const todo = await prisma.todo.findUnique({
    where: { id: todoId },
  });

  if (!todo) throw new NotFoundError("Todo not found.");

  return await prisma.todo.update({
    where: { id: todoId },
    data,
  });
};


export const deleteTodo = async (todoId: number) => {
  const todo = await prisma.todo.findUnique({
    where: { id: todoId },
  });

  if (!todo) throw new NotFoundError("Todo not found.");

  return await prisma.todo.delete({
    where: { id: todoId },
  });
};
