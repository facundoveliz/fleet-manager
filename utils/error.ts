import { Response, NextFunction, Request } from 'express';

class ErrorResponse extends Error {
  statusCode: number;
  success: boolean;
  message: string;

  constructor(statusCode: number, success: boolean, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.success = success;
    this.message = message;
  }
}

export const errorHandlerMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err, err.message);
  if (err instanceof ErrorResponse) {
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
    });
  }
  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export default ErrorResponse
