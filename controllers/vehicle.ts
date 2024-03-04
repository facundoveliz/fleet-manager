import { type Response, type NextFunction, type Request } from 'express'
import SuccessResponse from '../utils/success'
import ErrorResponse from '../utils/error'
import db from '../models'

const Vehicle = db.Vehicle

export const getAllVehicles = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
  const vehicles = await Vehicle.findAll();
  const response = SuccessResponse(
    res,
    200,
    'Vehicles retrieved successfully',
    vehicles
  );
  return response;
}

export const getVehicle = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
  const vehicle = await Vehicle.findOne({
    where: {
      vehicleId: req.params.id
    }
  });
  if (!vehicle) {
    throw new ErrorResponse(404, false, 'Vehicle not found');
  } else {
    const response = SuccessResponse(
      res,
      200,
      'Vehicle retrieved successfully',
      vehicle
    );
    return response;
  }
}

export const createVehicle = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
  let existingLicencePlate = await Vehicle.findOne({ where: { licencePlate: req.body.licencePlate } });
  if (existingLicencePlate) {
    throw new ErrorResponse(400, false, 'Licence plate already exists');
  }

  const vehicle = await Vehicle.create({
    licencePlate: req.body.licencePlate,
    model: req.body.model,
    location: req.body.location,
    status: req.body.status,
    capacity: req.body.capacity || 0
  });
  const response = SuccessResponse(
    res,
    200,
    'Vehicle created successfully',
    vehicle
  );
  return response;
}

export const deleteVehicle = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
  const rowsDeleted = await Vehicle.destroy({
    where: {
      vehicleId: req.params.id
    }
  });
  if (rowsDeleted === 1) {
    const response = SuccessResponse(res, 200, 'Vehicle deleted', rowsDeleted);
    return response;
  }
  throw new ErrorResponse(404, false, 'Vehicle not found');
}
