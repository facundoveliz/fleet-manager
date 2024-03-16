import { type Response, type NextFunction, type Request } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Driver from '../models/driver'
import SuccessResponse from '../utils/success'
import ErrorResponse from '../utils/error'

export const getAllDrivers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
  const drivers = await Driver.findAll({
    attributes: ['firstName', 'lastName', 'email', 'phone'] // Exclude sensitive data
  })

  const response = SuccessResponse(
    res,
    200,
    'Drivers retrieved successfully',
    drivers
  )
  return response
}

export const getDriver = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
  const driver = await Driver.findByPk(req.params.id)
  if (driver === null) {
    throw new ErrorResponse(404, false, 'Driver not found')
  } else {
    const response = SuccessResponse(
      res,
      200,
      'Driver retrieved successfully',
      driver
    )
    return response
  }
}

export const registerDriver = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  // Check if the email already exists
  const existingDriver = await Driver.findOne({
    where: { email: req.body.email }
  })
  if (existingDriver) {
    throw new ErrorResponse(400, false, 'Email already exists')
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(req.body.password, salt)

  // Validate password length
  if (req.body.password.length < 8) {
    throw new ErrorResponse(
      400,
      false,
      'Validation error: Password must be between 8 and 64 characters'
    )
  }

  // Create the new driver
  const newDriver = await Driver.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hashedPassword,
    phone: req.body.phone,
    VehicleId: req.body.VehicleId
  })

  return SuccessResponse(res, 200, 'Driver created successfully', newDriver)
}

export const loginDriver = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse | void> => {
  const { email, password } = req.body

  // checks if the email is valid
  const driver: any = await Driver.findOne({
    where: {
      email
    }
  })

  // if the email doesn't exists, the func ends here
  if (!driver) {
    throw new ErrorResponse(400, false, 'Invalid email or password')
  }

  // compares passwords
  const validPassword = await bcrypt.compare(password, driver.password)
  if (!validPassword) {
    throw new ErrorResponse(400, false, 'Invalid email or password')
  }

  // generate token and set it to expire in 30 days
  const token = jwt.sign(
    { _id: driver.id },
    process.env.JWT_PRIVATE_KEY!,
    {
      expiresIn: '30d'
    }
  )

  const response = SuccessResponse(
    res,
    200,
    'Driver logged successfully',
    token
  )
  return response
}

export const deleteDriver = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
  const driver = await Driver.destroy({
    where: {
      driverId: req.params.id
    }
  })
  if (driver === 1) {
    const response = SuccessResponse(res, 200, 'Driver deleted', driver)
    return response
  }
  throw new ErrorResponse(404, false, 'Driver not found')
}
