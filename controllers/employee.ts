import { type Response, type NextFunction, type Request } from 'express'
import Employee from '../models/employee'
import SuccessResponse from '../utils/sucess'
import ErrorResponse from '../utils/error'

export const getAllEmployees = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<{
  success: boolean
  message: string
  data: Array<Record<string, unknown>>
}> => {
  try {
    const employees = await Employee.findAll({})
    const response = (await SuccessResponse(
      res,
      'Employees retrieved successfully',
      employees,
      200
    )) as {
      success: boolean
      message: string
      data: Array<Record<string, unknown>>
    }
    return response
  } catch (err: any) {
    next(new ErrorResponse(err.message, 400))
    throw err
  }
}
