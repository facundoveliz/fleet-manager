import { type Response, type NextFunction, type Request } from 'express'
import SuccessResponse from '../utils/success'
import ErrorResponse from '../utils/error'
import db from '../models'

const Vehicle = db.Vehicle

export const getAllVehicles = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
  const vehicles = await Vehicle.findAll()
  const response = SuccessResponse(
    res,
    200,
    'Vehicles retrieved successfully',
    vehicles
  )
  return response
}

export const getVehicle = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
  const vehicle = await Vehicle.findByPk(req.params.id)
  if (vehicle === null) {
    throw new ErrorResponse(404, false, 'Vehicle not found');
  } else {
    const response = SuccessResponse(
      res,
      200,
      'Vehicle retrieved successfully',
      vehicle
    )
    return response
  }
}

export const createVehicle = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
  // creates the new vehicle
  const vehicle = await Vehicle.create({
    licencePlate: req.body.licencePlate,
    model: req.body.model,
    location: req.body.location,
    status: req.body.status,
  })

  const response = SuccessResponse(
    res,
    200,
    'Vehicle created successfully',
    vehicle
  )
  return response
}

export const deleteVehicle = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
  const vehicle = await Vehicle.destroy({
    where: {
      licencePlate: req.params.id
    }
  })
  if (vehicle === 1) {
    const response = SuccessResponse(res, 200, 'Vehicle deleted', vehicle)
    return response
  }
  throw new ErrorResponse(404, false, 'Vehicle not found');
}
