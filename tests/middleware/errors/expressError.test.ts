import {
  ExpressError,
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
  ForbiddenError,
  ConflictError
} from '../../../src/middleware/errors/expressError';

describe('ExpressError Classes', () => {

  it('should create an instance of ExpressError with correct message and status', () => {
    const error = new ExpressError('Test Error', 500);

    expect(error).toBeInstanceOf(ExpressError);
    expect(error.message).toBe('Test Error');
    expect(error.status).toBe(500);
  });

  it('should create an instance of NotFoundError with default message and status 404', () => {
    const error = new NotFoundError();

    expect(error).toBeInstanceOf(NotFoundError);
    expect(error.message).toBe('Not Found');
    expect(error.status).toBe(404);
  });

  it('should create an instance of NotFoundError with custom message', () => {
    const error = new NotFoundError('Custom Not Found Message');

    expect(error.message).toBe('Custom Not Found Message');
    expect(error.status).toBe(404);
  });

  it('should create an instance of UnauthorizedError with default message and status 401', () => {
    const error = new UnauthorizedError();

    expect(error.message).toBe('Unauthorized');
    expect(error.status).toBe(401);
  });

  it('should create an instance of BadRequestError with default message and status 400', () => {
    const error = new BadRequestError();

    expect(error.message).toBe('Bad Request');
    expect(error.status).toBe(400);
  });

  it('should create an instance of ForbiddenError with default message and status 403', () => {
    const error = new ForbiddenError();

    expect(error.message).toBe('Bad Request');
    expect(error.status).toBe(403);
  });

  it('should create an instance of ConflictError with default message and status 409', () => {
    const error = new ConflictError();

    expect(error.message).toBe('Conflict');
    expect(error.status).toBe(409);
  });

});
