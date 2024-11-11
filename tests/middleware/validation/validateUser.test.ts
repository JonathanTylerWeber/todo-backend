import validateUser from '../../../src/middleware/validation/validateUser';
import { signupSchema } from '../../../src/validationSchema/userSchema';

describe('validateUser Middleware', () => {
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

  it('should call next if validation passes for signup', () => {
    req.originalUrl = '/auth/signup';
    req.body = { username: 'testuser', email: 'test@example.com', password: 'password123' };

    validateUser(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should return 400 if validation fails', () => {
    req.originalUrl = '/auth/signup';
    req.body = { email: 'invalidemail' };

    validateUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('Username is required, Invalid email address, Password is required') }));
  });

  it('should return 400 if signup request is missing fields', () => {
    req.originalUrl = '/auth/signup';
    req.body = { email: 'test@example.com' }; // missing username and password

    validateUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: expect.stringContaining('Username is required, Password is required')
    }));
  });

  it('should return 500 if an unexpected error occurs', () => {
    // Simulate an unexpected error by throwing inside the schema validation
    jest.spyOn(signupSchema, 'parse').mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    req.originalUrl = '/auth/signup';
    req.body = { username: 'testuser', email: 'test@example.com', password: 'password123' };

    validateUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
  });

});
