import { Response, Request } from 'express';
import ErrorResponse, { errorHandlerMiddleware } from '../utils/error';

describe('errorHandlerMiddleware', () => {
  it('should handle ErrorResponse correctly', () => {
    const err = new ErrorResponse(404, false, 'Not Found');
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    errorHandlerMiddleware(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Not Found',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should handle generic error correctly', () => {
    const err = new Error('Internal Server Error');
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    errorHandlerMiddleware(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Internal Server Error',
    });
    expect(next).not.toHaveBeenCalled();
  });
});
