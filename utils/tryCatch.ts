import { Request, Response, NextFunction } from 'express'
import { errorHandlerMiddleware } from './error'

export const tryCatch =
  (controller: any) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res, next)
    } catch (error) {
      errorHandlerMiddleware(error, req, res, next)
    }
  }
