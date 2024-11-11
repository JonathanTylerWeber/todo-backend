import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authenticateToken, validateUserId, checkTodoOwnership } from '../../src/middleware/auth';
import * as TodoService from '../../src/services/todoService';
import { ForbiddenError, NotFoundError, UnauthorizedError } from '../../src/middleware/errors/expressError';

jest.mock('jsonwebtoken');
jest.mock('../../src/services/todoService');

interface CustomRequest extends Request {
  user?: {
    id: number;
  };
}

describe('Auth Middleware Tests', () => {
  let mockReq: Partial<CustomRequest>; // Use CustomRequest to include userId
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockReq = { headers: {} }; // Ensure headers is defined as an empty object
    mockRes = {};
    mockNext = jest.fn();
  });

  describe('authenticateToken', () => {
    it('should return UnauthorizedError if no token is provided', () => {
      authenticateToken(mockReq as CustomRequest, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalledWith(new UnauthorizedError("Unauthorized: Token not provided"));
    });

    it('should return ForbiddenError for invalid token', () => {
      (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
        callback(new Error('Invalid Token'), null);
      });

      mockReq.headers!.authorization = 'Bearer invalidtoken';
      authenticateToken(mockReq as CustomRequest, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalledWith(new ForbiddenError("Forbidden: Invalid Token"));
    });

    it('should set user on req if token is valid', () => {
      const mockUser = { id: 1 };
      (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
        callback(null, mockUser);
      });

      mockReq.headers!.authorization = 'Bearer validtoken';
      authenticateToken(mockReq as CustomRequest, mockRes as Response, mockNext);
      expect(mockReq.user?.id).toBe(1);
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('validateUserId', () => {
    it('should return UnauthorizedError if userId is invalid', () => {
      mockReq.user = { id: 'invalid' as any };
      validateUserId(mockReq as CustomRequest, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalledWith(new UnauthorizedError("Unauthorized: Invalid user ID"));
    });

    it('should proceed to next middleware if userId is valid', () => {
      mockReq.user = { id: 1 };
      validateUserId(mockReq as CustomRequest, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('checkTodoOwnership', () => {
    it('should return NotFoundError if todo does not exist', async () => {
      (TodoService.getTodoById as jest.Mock).mockResolvedValue(null);

      mockReq.user = { id: 1 };
      mockReq.params = { id: '1' };

      await checkTodoOwnership(mockReq as CustomRequest, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalledWith(new NotFoundError("Todo does not exist"));
    });

    it('should return ForbiddenError if todo is not owned by the user', async () => {
      const mockTodo = { id: 1, userId: 2 }; // Todo owned by a different user
      (TodoService.getTodoById as jest.Mock).mockResolvedValue(mockTodo);

      mockReq.user = { id: 1 };
      mockReq.params = { id: '1' };

      await checkTodoOwnership(mockReq as CustomRequest, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalledWith(new ForbiddenError("You do not have permission to access this todo"));
    });

    it('should proceed to next middleware if user owns the todo', async () => {
      const mockTodo = { id: 1, userId: 1 };
      (TodoService.getTodoById as jest.Mock).mockResolvedValue(mockTodo);

      mockReq.user = { id: 1 };
      mockReq.params = { id: '1' };

      await checkTodoOwnership(mockReq as CustomRequest, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
