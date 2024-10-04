import * as AuthService from '../../src/services/authService';
import prisma from '../../src/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ConflictError, UnauthorizedError } from '../../src/middleware/expressError';

jest.mock('../../src/client', () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  describe('signup', () => {
    it('should throw ConflictError if email already exists', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({ id: 1 });

      await expect(AuthService.signup('testuser', 'test@example.com', 'password123')).rejects.toThrow(ConflictError);
    });

    it('should return token and create user on successful signup', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashedPassword');
      (prisma.user.create as jest.Mock).mockResolvedValueOnce({ id: 1, username: 'testuser', email: 'test@example.com' });
      (jwt.sign as jest.Mock).mockReturnValue('testToken');

      const result = await AuthService.signup('testuser', 'test@example.com', 'password123');

      expect(result).toHaveProperty('token', 'testToken');
      expect(prisma.user.create).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedError for invalid email', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);

      await expect(AuthService.login('nonexistent@example.com', 'password123')).rejects.toThrow(UnauthorizedError);
    });

    it('should throw UnauthorizedError for invalid password', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({ id: 1, password: 'hashedPassword' });
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      await expect(AuthService.login('test@example.com', 'wrongpassword')).rejects.toThrow(UnauthorizedError);
    });

    it('should return token on successful login', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({ id: 1, password: 'hashedPassword' });
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      (jwt.sign as jest.Mock).mockReturnValue('testToken');

      const result = await AuthService.login('test@example.com', 'password123');

      expect(result).toHaveProperty('token', 'testToken');
    });
  });
});
