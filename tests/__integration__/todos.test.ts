// tests/__integration__/todos.test.ts

import request from 'supertest';
import app from '../../src/index';
import prisma from '../../src/client';
import jwt from 'jsonwebtoken';

describe('Todo Integration Tests', () => {
  let token: string;
  let userId: number;
  let todoId: number;

  beforeAll(async () => {
    // Clean up the database before running tests
    await prisma.todo.deleteMany({});
    await prisma.user.deleteMany({});

    // Sign up a new user and get a token
    const signupResponse = await request(app)
      .post('/auth/signup')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
      });

    token = signupResponse.body.token;

    // Decode the token to get the userId
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
    userId = decodedToken.id;
  });

  afterAll(async () => {
    // Clean up the database after running tests
    await prisma.todo.deleteMany({});
    await prisma.user.deleteMany({});

    // Disconnect the Prisma client
    await prisma.$disconnect();
  });

  describe('POST /todos', () => {
    it('should create a new todo', async () => {
      const response = await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Todo',
          description: 'This is a test todo',
        });

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.title).toBe('Test Todo');
      expect(response.body.data.description).toBe('This is a test todo');
      expect(response.body.data.userId).toBe(userId);

      // Save the todoId for later tests
      todoId = response.body.data.id;
    });

    it('should return 400 for missing title', async () => {
      const response = await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'Missing title',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message[0].message).toBe('Title is required');
    });

    it('should return 400 for missing description', async () => {
      const response = await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Todo without description',
          // No description provided
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message[0].message).toBe('Description is required');
    });
  });

  describe('GET /todos', () => {
    it('should retrieve the user\'s todos', async () => {
      const response = await request(app)
        .get('/todos')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should return 404 if user has no todos', async () => {
      // Sign up a new user with no todos
      const signupResponse = await request(app)
        .post('/auth/signup')
        .send({
          username: 'emptyuser',
          email: 'emptyuser@example.com',
          password: 'password123',
        });

      const emptyUserToken = signupResponse.body.token;

      const response = await request(app)
        .get('/todos')
        .set('Authorization', `Bearer ${emptyUserToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('No todos found for this user.');
    });
  });

  describe('PATCH /todos/:id', () => {
    it('should update the todo', async () => {
      const response = await request(app)
        .patch(`/todos/${todoId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Test Todo',
          description: 'Updated description',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.title).toBe('Updated Test Todo');
      expect(response.body.data.description).toBe('Updated description');
    });

    it('should return 403 when updating a todo that does not belong to the user', async () => {
      // Sign up another user
      const signupResponse = await request(app)
        .post('/auth/signup')
        .send({
          username: 'anotheruser',
          email: 'anotheruser@example.com',
          password: 'password123',
        });

      const anotherUserToken = signupResponse.body.token;

      // Try to update the original todo with another user's token
      const response = await request(app)
        .patch(`/todos/${todoId}`)
        .set('Authorization', `Bearer ${anotherUserToken}`)
        .send({
          title: 'Unauthorized Update',
        });

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('You do not have permission to access this todo');
    });
  });

  describe('DELETE /todos/:id', () => {
    it('should delete the todo', async () => {
      const response = await request(app)
        .delete(`/todos/${todoId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.text).toBe('Todo deleted successfully');
    });

    it('should return 404 when deleting a non-existent todo', async () => {
      const response = await request(app)
        .delete(`/todos/${todoId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Todo not found.');
    });

    it('should return 403 when deleting a todo that does not belong to the user', async () => {
      // Create a todo with another user
      const signupResponse = await request(app)
        .post('/auth/signup')
        .send({
          username: 'anotheruser2',
          email: 'anotheruser2@example.com',
          password: 'password123',
        });

      const anotherUserToken = signupResponse.body.token;

      const createResponse = await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${anotherUserToken}`)
        .send({
          title: 'Another User Todo',
          description: 'This todo belongs to another user',
        });

      const anotherTodoId = createResponse.body.data.id;

      // Try to delete the other user's todo
      const response = await request(app)
        .delete(`/todos/${anotherTodoId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('You do not have permission to access this todo');
    });
  });
});
