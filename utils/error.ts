import { type Response, type NextFunction, type Request } from 'express'

class ErrorResponse extends Error {
  constructor (
    message: string,
    statusCode: number,
    success: boolean = false,
    data?: Array<Record<string, unknown>>
  ) {
    super(message)
    this.statusCode = statusCode
    this.success = success
    this.data = data
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }

  statusCode: number
  success: boolean
  data?: Array<Record<string, unknown>>
}

export const errorHandlerMiddleware = (
  error: ErrorResponse,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log the error
  console.error(error)

  const statusCode = error.statusCode !== undefined ? error.statusCode : 500
  const message = error.message || 'Internal Server Error'

  const response: {
    success: boolean
    message: string
    data?: Array<Record<string, unknown>>
  } = {
    success: error.success, // Include the success variable from the error
    message
  }

  if (error.data) {
    response.data = error.data
  }

  res.status(statusCode).json(response)
}

export default ErrorResponse
