import { type Response, type NextFunction, type Request } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Employee from '../models/employee'
import SuccessResponse from '../utils/success'
import ErrorResponse from '../utils/error'

export const getAllEmployees = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
  try {
    const employees = await Employee.findAll()
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

    // creates the new employee
    employee = await Employee.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: employeePassword,
      phone: req.body.phone,
      role: req.body.role,
      VehicleId: req.body.VehicleId
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

export const loginEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
  const { email, password } = req.body

  // checks if the email is valid
  const employee: any = await Employee.findOne({
    where: {
      email
    }
  })

  // if the email doesn't exists, the func ends here
  if (employee === null) {
    const error = new ErrorResponse(400, false, 'Invalid email or password')
    next(error)
    return error
  }

  // compares passwords
  const validPassword = await bcrypt.compare(password, employee.password)
  if (!validPassword) {
    const error = new ErrorResponse(400, false, 'Invalid email or password')
    next(error)
    return error
  }

  // generate token and set it to expire in 30 days
  const token = jwt.sign(
    { _id: employee.id },
    process.env.JWT_PRIVATE_KEY as string,
    {
      expiresIn: '30d'
    }
  )

  const response = SuccessResponse(
    res,
    200,
    'Employee logged successfully',
    token
  )
  return response
}

export const deleteEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
  try {
    const employee = await Employee.destroy({
      where: {
        id: req.params.id
      }
    })
    if (employee === 1) {
      const response = SuccessResponse(res, 200, 'Employee deleted', employee)
      return response
    }
    const error = new ErrorResponse(404, false, 'Employee not found')
    next(error)
    return error
  } catch (err: any) {
    const error = new ErrorResponse(err.statusCode, false, err.message)
    next(error)
    return error
  }
}
