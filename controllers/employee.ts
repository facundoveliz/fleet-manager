import { type Response, type NextFunction, type Request } from 'express'
import bcrypt from 'bcrypt'
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

export const getEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<{
  success: boolean
  message: string
  data?: Array<Record<string, unknown>>
}> => {
  try {
    const employee = await Employee.findByPk(req.params.id)
    if (employee === null) {
      const error = new ErrorResponse('Employee not found', 404, false, [])
      next(error)
    } else {
      const response = (await SuccessResponse(
        res,
        'Employee retrieved successfully',
        200,
        employee
      )) as {
        success: boolean
        message: string
        data: Array<Record<string, unknown>>
      }
      return response
    }
  } catch (err: any) {
    const error = new ErrorResponse(err.message, 400)
    next(error)
  }
}

export const registerEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<{
  success: boolean
  message: string
  data: Array<Record<string, unknown>>
}> => {
  try {
    // checks if the email doesn't exists
    let employee = await Employee.findOne({ where: { email: req.body.email } })
    // if the email exists, the func ends here
    // if (employee === null) {
    //   next(new ErrorResponse('Invalid email or password', 400))
    //   throw new Error()
    // }

    // hash the password
    const salt = await bcrypt.genSalt(10)
    const employeePassword = await bcrypt.hash(req.body.password, salt)

    // creates the new user
    employee = await Employee.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: employeePassword,
      contact: req.body.contact
    })

    const response = (await SuccessResponse(
      res,
      'Employee created successfully',
      employee,
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
