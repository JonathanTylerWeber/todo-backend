// tests/routes/authRoutes.test.ts

import request from 'supertest';
import app from '../../src/index';
import * as AuthService from '../../src/services/authService';
import { UnauthorizedError } from '../../src/middleware/errors/expressError';

jest.mock('../../src/services/authService');

describe('Auth Route Tests', () => {
  describe('POST /auth/signup', () => {
    it('should sign up a new user', async () => {
      const mockToken = 'testToken';
      (AuthService.signup as jest.Mock).mockResolvedValueOnce({ token: mockToken });

      const response = await request(app)
        .post('/auth/signup')
        .send({
          username: 'signupuser',
          email: 'signupuser@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token', mockToken);
    });

    it('should return 400 for missing username', async () => {
      const response = await request(app)
        .post('/auth/signup')
        .send({
          email: 'testuser@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Username is required');
    });

    it('should return 400 for invalid email format', async () => {
      const response = await request(app)
        .post('/auth/signup')
        .send({
          username: 'testuser',
          email: 'invalidemail.com',
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid email address');
    });

    it('should return 500 if signup fails', async () => {
      (AuthService.signup as jest.Mock).mockRejectedValueOnce(new Error('Signup failed'));

      const response = await request(app)
        .post('/auth/signup')
        .send({
          username: 'signupuser',
          email: 'signupuser@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal Server Error');
    });
  });

  describe('POST /auth/login', () => {
    it('should log in an existing user with correct credentials', async () => {
      const mockToken = 'testToken';
      (AuthService.login as jest.Mock).mockResolvedValueOnce({ token: mockToken });

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'loginuser@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token', mockToken);
    });

    it('should return 401 if credentials are invalid', async () => {
      // Mock the service to throw UnauthorizedError
      (AuthService.login as jest.Mock).mockRejectedValueOnce(new UnauthorizedError('Invalid password.'));

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'loginuser@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid password.');
    });

  });
});
