// src/tests/userSchema.test.ts

import { signupSchema, loginSchema } from '../../src/schemas/userSchema';

describe('User Schema Validation', () => {
  // Signup schema tests
  describe('Signup Schema', () => {
    it('should validate a valid signup input', () => {
      const result = signupSchema.parse({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result).toEqual({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should throw an error when username is missing', () => {
      expect(() => {
        signupSchema.parse({
          email: 'test@example.com',
          password: 'password123',
        });
      }).toThrow('Username is required');
    });

    it('should throw an error when username is empty', () => {
      expect(() => {
        signupSchema.parse({
          username: '',
          email: 'test@example.com',
          password: 'password123',
        });
      }).toThrow('Username cannot be empty');
    });

    it('should throw an error for an invalid email format', () => {
      expect(() => {
        signupSchema.parse({
          username: 'testuser',
          email: 'invalidemail.com',
          password: 'password123',
        });
      }).toThrow('Invalid email address');
    });

    it('should throw an error when password is too short', () => {
      expect(() => {
        signupSchema.parse({
          username: 'testuser',
          email: 'test@example.com',
          password: 'short',
        });
      }).toThrow('Password must be at least 6 characters long');
    });
  });

  // Login schema tests
  describe('Login Schema', () => {
    it('should validate a valid login input', () => {
      const result = loginSchema.parse({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result).toEqual({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should throw an error when email is missing', () => {
      expect(() => {
        loginSchema.parse({
          password: 'password123',
        });
      }).toThrow('Email is required');
    });

    it('should throw an error for an invalid email format', () => {
      expect(() => {
        loginSchema.parse({
          email: 'invalidemail.com',
          password: 'password123',
        });
      }).toThrow('Invalid email address');
    });

    it('should throw an error when password is empty', () => {
      expect(() => {
        loginSchema.parse({
          email: 'test@example.com',
          password: '',
        });
      }).toThrow('Password cannot be empty');
    });
  });
});
