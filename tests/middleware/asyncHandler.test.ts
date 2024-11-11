// tests/middleware/asyncHandler.test.ts

import { Request, Response } from 'express';
import asyncHandler from '../../src/middleware/asyncHandler';

describe('asyncHandler Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    // Create mock objects for req, res, and next
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn(); // next is typically used to forward errors or go to the next middleware
  });

  it('should call the passed function and resolve successfully', async () => {
    // Mock a function that returns a resolved promise
    const mockFn = jest.fn().mockResolvedValueOnce('Success');

    const wrappedMiddleware = asyncHandler(mockFn);

    // Call the wrapped middleware function
    await wrappedMiddleware(mockReq as Request, mockRes as Response, mockNext);

    // Assert the mock function was called correctly
    expect(mockFn).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
    expect(mockNext).not.toHaveBeenCalled(); // next should not be called for successful execution
  });

  it('should catch errors and pass them to next', async () => {
    const mockError = new Error('Test error');

    // Mock a function that throws an error
    const mockFn = jest.fn().mockRejectedValueOnce(mockError);

    const wrappedMiddleware = asyncHandler(mockFn);

    // Call the wrapped middleware function
    await wrappedMiddleware(mockReq as Request, mockRes as Response, mockNext);

    // Ensure that next is called with the error
    expect(mockNext).toHaveBeenCalledWith(mockError);
    expect(mockFn).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
  });
});
