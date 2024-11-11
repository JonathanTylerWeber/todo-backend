import { createTodo, getUserTodos, updateTodo, deleteTodo } from '../../src/controllers/todoController';
import * as TodoService from '../../src/services/todoService';
import { Request, Response } from 'express';

jest.mock('../../src/services/todoService');

describe('TodoController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = { params: { id: '1' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  describe('create a todo', () => {
    it('should return 201, success message, and new todo data', async () => {
      const mockTodo = { id: 1, title: 'test', description: 'this is a test' };
      (TodoService.createTodo as jest.Mock).mockResolvedValueOnce(mockTodo);

      req.body = { title: 'test', description: 'this is a test' };

      await createTodo(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'New todo created successfully', data: mockTodo });
    });
  });

  describe('get user todos', () => {
    it('should return 200, success message, and user todos data', async () => {
      const mockTodos = [
        { id: 1, title: 'test', description: 'this is a test' },
        { id: 2, title: 'test', description: 'this is a test' }
      ];
      (TodoService.getUserTodos as jest.Mock).mockResolvedValueOnce(mockTodos);

      await getUserTodos(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'User Todos', data: mockTodos });
    });
  });

  describe('update a todo', () => {
    it('should return 200, success message, and updated todo data', async () => {
      const mockTodo = { id: 1, title: 'test', description: 'this is a test' };
      (TodoService.updateTodo as jest.Mock).mockResolvedValueOnce(mockTodo);

      req.body = { title: 'test', description: 'this is a test' };

      await updateTodo(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Todo updated successfully', data: mockTodo });
    });
  });

  describe('delete a todo', () => {
    it('should return 200 and success message', async () => {

      req.body = { title: 'test', description: 'this is a test' };

      await deleteTodo(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith('Todo deleted successfully');
    });
  });

});