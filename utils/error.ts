import { type Response, type NextFunction, type Request } from 'express'

class ErrorResponse extends Error {
  statusCode: number
  success: boolean

  constructor (statusCode: number, success: boolean, message: string) {
    super(message)
    this.statusCode = statusCode
    this.success = success
    this.message = message
  }
}

export const errorHandlerMiddleware = (
  err: ErrorResponse,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  err.statusCode = err.statusCode ?? 500
  err.success = err.success || false

  res.status(err.statusCode).json({
    success: err.success,
    error: err,
    message: err.message,
    stack: err.stack
  })
}

export default ErrorResponse
