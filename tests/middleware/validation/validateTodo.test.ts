// tests/middleware/validation/validateTodo.test.ts

import validateTodo from '../../../src/middleware/validation/validateTodo';
import todoSchema from '../../../src/validationSchema/todoSchema';

describe('validate todo schema', () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('should call next if validation passes', () => {
    req.body = { title: 'test', description: 'this is a test' };

    validateTodo(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should return 400 if title is missing', () => {
    req.body = { description: 'test' }; // missing title

    validateTodo(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: expect.arrayContaining([
        expect.objectContaining({
          message: "Title is required", // Updated to match Zod's message
          path: ["title"],
        }),
      ])
    }));
  });

  it('should return 400 if title is not a string', () => {
    req.body = { title: 39, description: "i updated it" }; // title is a number

    validateTodo(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: expect.arrayContaining([
        expect.objectContaining({
          code: "invalid_type",
          expected: "string",
          received: "number",
          path: ["title"],
          message: "Title must be a string"
        }),
      ])
    }));
  });

  it('should return 500 if an unexpected error occurs', () => {
    // Simulate an unexpected error by throwing inside the schema validation
    jest.spyOn(todoSchema, 'parse').mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    req.body = { title: 'test', description: 'this is a test' };

    validateTodo(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
  });

});

