import request from 'supertest';
import app from '../../src/index'; // Ensure you're importing the app
import * as TodoService from '../../src/services/todoService';
import { authenticateToken, validateUserId, checkTodoOwnership } from '../../src/middleware/auth';
import validateTodo from '../../src/middleware/validation/validateTodo';

jest.mock('../../src/services/todoService');
jest.mock('../../src/middleware/auth', () => ({
  authenticateToken: jest.fn((req, res, next) => {
    req.user = { id: 1 }; // Mocked user ID
    next();
  }),
  validateUserId: jest.fn((req, res, next) => {
    next();
  }),
  checkTodoOwnership: jest.fn((req, res, next) => {
    next();
  }),
}));

jest.mock('../../src/middleware/validation/validateTodo', () => jest.fn((req, res, next) => {
  if (typeof req.body.title !== 'string' || typeof req.body.description !== 'string') {
    res.status(400).json({ message: 'Title and description are required and must be strings.' });
  } else {
    next();
  }
}));

const mockToken = 'validToken';

describe('Todo Route Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /todos', () => {
    it('should retrieve user todos', async () => {
      const mockTodos = [
        { id: 1, title: 'Test Todo 1', description: 'Description 1', userId: 1 },
        { id: 2, title: 'Test Todo 2', description: 'Description 2', userId: 1 },
      ];
      (TodoService.getUserTodos as jest.Mock).mockResolvedValueOnce(mockTodos);

      const response = await request(app)
        .get('/todos')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockTodos);
      expect(TodoService.getUserTodos).toHaveBeenCalledWith(1);
    });

    it('should return 401 if token is missing', async () => {
      // Simulate unauthenticated request
      (authenticateToken as jest.Mock).mockImplementationOnce((req, res, next) => {
        res.status(401).json({ message: 'Unauthorized: Token not provided' });
      });

      const response = await request(app).get('/todos');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized: Token not provided');
      expect(TodoService.getUserTodos).not.toHaveBeenCalled();
    });
  });

  describe('POST /todos', () => {
    it('should create a new todo', async () => {
      const newTodoInput = { title: 'New Todo', description: 'This is a new todo' };
      const newTodoOutput = { id: 3, ...newTodoInput, userId: 1 };
      (TodoService.createTodo as jest.Mock).mockResolvedValueOnce(newTodoOutput);

      const response = await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${mockToken}`)
        .send(newTodoInput);

      expect(response.status).toBe(201);
      expect(response.body.data).toEqual(newTodoOutput);
      expect(response.body.message).toBe('New todo created successfully');
      expect(TodoService.createTodo).toHaveBeenCalledWith(1, newTodoInput.title, newTodoInput.description);
    });

    it('should return 400 for invalid todo data', async () => {
      const invalidTodo = { title: 123 }; // Invalid data type for title

      const response = await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${mockToken}`)
        .send(invalidTodo);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Title and description are required and must be strings.');
      expect(TodoService.createTodo).not.toHaveBeenCalled();
    });
  });

  describe('PATCH /todos/:id', () => {
    it('should update an existing todo', async () => {
      const updatedTodoInput = { title: 'Updated Todo', description: 'Updated description' };
      const updatedTodoOutput = { id: 1, ...updatedTodoInput, userId: 1 };
      (TodoService.updateTodo as jest.Mock).mockResolvedValueOnce(updatedTodoOutput);

      const response = await request(app)
        .patch('/todos/1')
        .set('Authorization', `Bearer ${mockToken}`)
        .send(updatedTodoInput);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(updatedTodoOutput);
      expect(response.body.message).toBe('Todo updated successfully');
      expect(TodoService.updateTodo).toHaveBeenCalledWith(1, updatedTodoInput);
    });

    it('should return 403 if user does not own the todo', async () => {
      // Simulate ownership check failure
      (checkTodoOwnership as jest.Mock).mockImplementationOnce((req, res, next) => {
        res.status(403).json({ message: 'You do not have permission to access this todo' });
      });

      const response = await request(app)
        .patch('/todos/1')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ title: 'Attempted Update' });

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('You do not have permission to access this todo');
      expect(TodoService.updateTodo).not.toHaveBeenCalled();
    });
  });

  describe('DELETE /todos/:id', () => {
    it('should delete a todo', async () => {
      (TodoService.deleteTodo as jest.Mock).mockResolvedValueOnce(undefined);

      const response = await request(app)
        .delete('/todos/1')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.text).toBe('Todo deleted successfully');
      expect(TodoService.deleteTodo).toHaveBeenCalledWith(1);
    });

    it('should return 403 if user does not own the todo', async () => {
      // Simulate ownership check failure
      (checkTodoOwnership as jest.Mock).mockImplementationOnce((req, res, next) => {
        res.status(403).json({ message: 'You do not have permission to access this todo' });
      });

      const response = await request(app)
        .delete('/todos/1')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('You do not have permission to access this todo');
      expect(TodoService.deleteTodo).not.toHaveBeenCalled();
    });
  });
});
