// tests/middleware/errors/errorHandler.test.ts
import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../../../src/middleware/errors/errorHandler';
import { ExpressError } from '../../../src/middleware/errors/expressError';

describe('ErrorHandler Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    // Mocking req, res, and next
    mockReq = {
      originalUrl: '/test-path',
      method: 'GET',
      headers: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();

    // Suppress console.error during tests
    jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls after each test
  });

  it('should handle ExpressError and return the correct status and message', () => {
    const expressError = new ExpressError('Test ExpressError', 400);

    errorHandler(expressError, mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400); // Check if the status code is 400
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Test ExpressError' }); // Check if the response contains the error message
    expect(console.error).toHaveBeenCalledWith("Error:", expressError); // Ensure the error is logged
  });

  it('should handle generic Error and return 500 with generic message', () => {
    const genericError = new Error('Test generic error');

    errorHandler(genericError, mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500); // Ensure it returns status 500
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Internal Server Error' }); // Ensure it sends the default error message
    expect(console.error).toHaveBeenCalledWith("Error:", genericError); // Check if the error is logged
    expect(console.error).toHaveBeenCalledWith("Unexpected Error:", {
      message: 'Test generic error',
      stack: genericError.stack,
      path: '/test-path',
      method: 'GET',
    });
  });

  it('should handle error with no message and stack properly', () => {
    const genericError = new Error();

    errorHandler(genericError, mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500); // Ensure it returns status 500
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Internal Server Error' }); // Ensure it sends the default error message
    expect(console.error).toHaveBeenCalledWith("Error:", genericError); // Check if the error is logged
    expect(console.error).toHaveBeenCalledWith("Unexpected Error:", {
      message: genericError.message,
      stack: genericError.stack,
      path: '/test-path',
      method: 'GET',
    });
  });
});
