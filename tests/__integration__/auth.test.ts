// tests/__integration__/auth.test.ts

import request from 'supertest';
import app from '../../src/index';

describe('Auth Integration Tests', () => {
  it('should sign up a new user and return a token', async () => {
    const response = await request(app)
      .post('/auth/signup')
      .send({
        username: 'testuser1',
        email: 'testuser1@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
  });

  it('should log in an existing user and return a token', async () => {
    await request(app)
      .post('/auth/signup')
      .send({
        username: 'testuser2',
        email: 'testuser2@example.com',
        password: 'password123',
      });

    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'testuser2@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should return 401 for invalid login', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
      });

    expect(response.status).toBe(401);
  });

  it('should return 409 for duplicate signup', async () => {
    await request(app)
      .post('/auth/signup')
      .send({
        username: 'duplicateuser',
        email: 'duplicate@example.com',
        password: 'password123',
      });

    const response = await request(app)
      .post('/auth/signup')
      .send({
        username: 'anotheruser',
        email: 'duplicate@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe('User with this email already exists.');
  });

});
