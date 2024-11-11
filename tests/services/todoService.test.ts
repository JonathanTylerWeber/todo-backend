// tests/services/todoService.test.ts
import * as TodoService from '../../src/services/todoService';
import prisma from '../../src/client';
import { BadRequestError, NotFoundError } from '../../src/middleware/errors/expressError';
import { Todo } from '@prisma/client';

jest.mock('../../src/client', () => ({
  todo: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('TodoService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTodo', () => {
    it('should throw BadRequestError if title is missing', async () => {
      await expect(TodoService.createTodo(1, '', 'Description')).rejects.toThrow(BadRequestError);
    });

    it('should create and return a todo on success', async () => {
      const mockTodo = { id: 1, title: 'Test Todo', description: 'Test Description', userId: 1 };
      (prisma.todo.create as jest.Mock).mockResolvedValueOnce(mockTodo);

      const result = await TodoService.createTodo(1, 'Test Todo', 'Test Description');

      expect(result).toEqual(mockTodo);
      expect(prisma.todo.create).toHaveBeenCalledWith({
        data: {
          title: 'Test Todo',
          description: 'Test Description',
          user: { connect: { id: 1 } },
        },
      });
    });
  });

  describe('getUserTodos', () => {
    it('should return todos for the user', async () => {
      const mockTodos = [
        { id: 1, title: 'Todo 1', description: 'Desc 1', userId: 1 },
        { id: 2, title: 'Todo 2', description: 'Desc 2', userId: 1 },
      ];
      (prisma.todo.findMany as jest.Mock).mockResolvedValueOnce(mockTodos);

      const result = await TodoService.getUserTodos(1);

      expect(result).toEqual(mockTodos);
      expect(prisma.todo.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
      });
    });

    it('should throw NotFoundError if no todos are found', async () => {
      (prisma.todo.findMany as jest.Mock).mockResolvedValueOnce([]);

      await expect(TodoService.getUserTodos(1)).rejects.toThrow(NotFoundError);
      expect(prisma.todo.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
      });
    });
  });

  describe('getTodoById', () => {
    it('should return the todo when found', async () => {
      const mockTodo = { id: 1, title: 'Todo 1', description: 'Desc 1', userId: 1 };
      (prisma.todo.findUnique as jest.Mock).mockResolvedValueOnce(mockTodo);

      const result = await TodoService.getTodoById(1);

      expect(result).toEqual(mockTodo);
      expect(prisma.todo.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundError when todo is not found', async () => {
      (prisma.todo.findUnique as jest.Mock).mockResolvedValueOnce(null);

      await expect(TodoService.getTodoById(1)).rejects.toThrow(NotFoundError);
      expect(prisma.todo.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('updateTodo', () => {
    it('should throw NotFoundError when todo is not found', async () => {
      (prisma.todo.findUnique as jest.Mock).mockResolvedValueOnce(null);

      await expect(TodoService.updateTodo(1, { title: 'Updated' })).rejects.toThrow(NotFoundError);
      expect(prisma.todo.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should update and return the todo when found', async () => {
      const existingTodo = { id: 1, title: 'Todo 1', description: 'Desc 1', userId: 1 };
      const updatedTodo = { id: 1, title: 'Updated', description: 'Desc 1', userId: 1 };

      (prisma.todo.findUnique as jest.Mock).mockResolvedValueOnce(existingTodo);
      (prisma.todo.update as jest.Mock).mockResolvedValueOnce(updatedTodo);

      const result = await TodoService.updateTodo(1, { title: 'Updated' });

      expect(result).toEqual(updatedTodo);
      expect(prisma.todo.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { title: 'Updated' },
      });
    });
  });

  describe('deleteTodo', () => {
    it('should throw NotFoundError when todo is not found', async () => {
      (prisma.todo.findUnique as jest.Mock).mockResolvedValueOnce(null);

      await expect(TodoService.deleteTodo(1)).rejects.toThrow(NotFoundError);
      expect(prisma.todo.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should delete and return the todo when found', async () => {
      const existingTodo = { id: 1, title: 'Todo 1', description: 'Desc 1', userId: 1 };

      (prisma.todo.findUnique as jest.Mock).mockResolvedValueOnce(existingTodo);
      (prisma.todo.delete as jest.Mock).mockResolvedValueOnce(existingTodo);

      const result = await TodoService.deleteTodo(1);

      expect(result).toEqual(existingTodo);
      expect(prisma.todo.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
