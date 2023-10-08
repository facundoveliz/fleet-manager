import { type Response, type NextFunction, type Request } from 'express'
import bcrypt from 'bcrypt'
import Employee from '../models/employee'
import SuccessResponse from '../utils/success'
import ErrorResponse from '../utils/error'

export const getAllEmployees = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
  try {
    const employees = await Employee.findAll({})
    const response = SuccessResponse(
      res,
      200,
      'Employees retrieved successfully',
      employees
    )
    return response
  } catch (err: any) {
    const error = new ErrorResponse(err.statusCode, false, err.message)
    next(error)
    return error
  }
}

export const getEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
  try {
    const employee = await Employee.findByPk(req.params.id)
    if (employee === null) {
      const error = new ErrorResponse(404, false, 'Employee not found')
      next(error)
      return error
    } else {
      const response = SuccessResponse(
        res,
        200,
        'Employee retrieved successfully',
        employee
      )
      return response
    }
  } catch (err: any) {
    const error = new ErrorResponse(err.statusCode, false, err.message)
    next(error)
    return error
  }
}

export const registerEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
  try {
    // checks if the email doesn't exists
    let employee = await Employee.findOne({ where: { email: req.body.email } })
    // if the email exists, the func ends here
    if (employee != null) {
      const error = new ErrorResponse(400, false, 'Email already exists')
      next(error)
      return error
    }

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

    const response = SuccessResponse(
      res,
      200,
      'Employee created successfully',
      employee
    )
    return response
  } catch (err: any) {
    const error = new ErrorResponse(err.statusCode, false, err.message)
    next(error)
    return error
  }
}
