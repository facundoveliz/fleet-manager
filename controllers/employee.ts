import { type Response, type NextFunction, type Request } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import db from '../models'
import SuccessResponse from '../utils/success'
import ErrorResponse, { errorHandlerMiddleware } from '../utils/error'
import { tryCatch } from '../utils/tryCatch'

const Employee = db.Employee

export const getAllEmployees = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
  const employees = await Employee.findAll({
    attributes: ['firstName', 'lastName', 'email', 'phone', 'role'], // Exclude sensitive data
  });

  const response = SuccessResponse(res, 200, 'Employees retrieved successfully', employees);
  return response;
}

export const getEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
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
}

export const registerEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  // Check if the email already exists
  let existingEmployee = await Employee.findOne({ where: { email: req.body.email } });
  if (existingEmployee) {
    throw new ErrorResponse(400, false, 'Email already exists');
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // Validate password length
  if (req.body.password.length < 8) {
    throw new ErrorResponse(400, false, 'Validation error: Password must be between 8 and 64 characters');
  }

  // Create the new employee
  const newEmployee = await Employee.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hashedPassword,
    phone: req.body.phone,
    role: req.body.role,
    VehicleId: req.body.VehicleId
  });

  return SuccessResponse(res, 200, 'Employee created successfully', newEmployee);
};

export const loginEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse | void> => {
  const { email, password } = req.body

  // checks if the email is valid
  const employee: any = await Employee.findOne({
    where: {
      email
    }
  })

  // if the email doesn't exists, the func ends here
  if (!employee) {
    throw new ErrorResponse(400, false, 'Invalid email or password');
  }

  // compares passwords
  const validPassword = await bcrypt.compare(password, employee.password)
  if (!validPassword) {
    throw new ErrorResponse(400, false, 'Invalid email or password');
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
  const employee = await Employee.destroy({
    where: {
      id: req.params.id
    }
  })
  if (employee === 1) {
    const response = SuccessResponse(res, 200, 'Employee deleted', employee)
    return response
  }
  throw new ErrorResponse(404, false, 'Employee not found');
}
