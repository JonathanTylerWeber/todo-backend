// tests/controllers/authController.test.ts

import { signup, login } from '../../src/controllers/authController';
import * as AuthService from '../../src/services/authService';
import { Request, Response } from 'express';

jest.mock('../../src/services/authService');

describe('AuthController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe('signup', () => {
    it('should return 201 and token on successful signup', async () => {
      const mockToken = 'testToken';
      (AuthService.signup as jest.Mock).mockResolvedValueOnce({ token: mockToken });

      req.body = { username: 'testuser', email: 'test@example.com', password: 'password123' };

      await signup(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'User created successfully', token: mockToken });
    });
  });

  describe('login', () => {
    it('should return 200 and token on successful login', async () => {
      const mockToken = 'testToken';
      (AuthService.login as jest.Mock).mockResolvedValueOnce({ token: mockToken });

      req.body = { email: 'test@example.com', password: 'password123' };

      await login(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Logged in successfully', token: mockToken });
    });
  });
});
