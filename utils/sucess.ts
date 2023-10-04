import { type Response } from 'express'

const SuccessResponse = async (
  res: Response,
  message: string,
  statusCode: number,
  data: Record<string, any>
  // FIX: change promise
): Promise<unknown> => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  })
}

export default SuccessResponse
