import { type Response } from 'express';

const SuccessResponse = (res: Response, statusCode: number, message: string, data: any): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export default SuccessResponse;
