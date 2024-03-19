import { type Response, type NextFunction, type Request } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Driver from '../models/driver';
import SuccessResponse from '../utils/success';
import ErrorResponse from '../utils/error';

export const getAllDrivers = async (req: Request, res: Response, next: NextFunction): Promise<Response | ErrorResponse> => {
  const drivers = await Driver.findAll({
    attributes: ['firstName', 'lastName', 'email', 'phone'], // Exclude sensitive data
  });

  const response = SuccessResponse(res, 200, 'Drivers retrieved successfully', drivers);
  return response;
};

export const getDriver = async (req: Request, res: Response, next: NextFunction): Promise<Response | ErrorResponse> => {
  const driver = await Driver.findByPk(req.params.id);
  if (driver === null) {
    throw new ErrorResponse(404, false, 'Driver not found');
  } else {
    const response = SuccessResponse(res, 200, 'Driver retrieved successfully', driver);
    return response;
  }
};

export const newDriver = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  // Check if the email already exists
  const existingDriver = await Driver.findOne({
    where: { email: req.body.email },
  });

  if (existingDriver) {
    throw new ErrorResponse(400, false, 'Email already exists');
  }

  // Create the new driver
  const newDriver = await Driver.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
  });

  return SuccessResponse(res, 200, 'Driver created successfully', newDriver);
};

export const deleteDriver = async (req: Request, res: Response, next: NextFunction): Promise<Response | ErrorResponse> => {
  const driver = await Driver.destroy({
    where: {
      driverId: req.params.id,
    },
  });
  if (driver === 1) {
    const response = SuccessResponse(res, 200, 'Driver deleted', driver);
    return response;
  }
  throw new ErrorResponse(404, false, 'Driver not found');
};
