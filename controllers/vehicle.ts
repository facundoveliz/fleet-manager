import { type Response, type NextFunction, type Request } from 'express'
import Vehicle from '../models/vehicle'
import SuccessResponse from '../utils/success'
import ErrorResponse from '../utils/error'

export const getAllVehicles = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
  try {
    const vehicles = await Vehicle.findAll()
    const response = SuccessResponse(
      res,
      200,
      'Vehicles retrieved successfully',
      vehicles
    )
    return response
  } catch (err: any) {
    const error = new ErrorResponse(err.statusCode, false, err.message)
    next(error)
    return error
  }
}

export const getVehicle = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id)
    if (vehicle === null) {
      const error = new ErrorResponse(404, false, 'Vehicle not found')
      next(error)
      return error
    } else {
      const response = SuccessResponse(
        res,
        200,
        'Vehicle retrieved successfully',
        vehicle
      )
      return response
    }
  } catch (err: any) {
    const error = new ErrorResponse(err.statusCode, false, err.message)
    next(error)
    return error
  }
}

export const createVehicle = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
  try {
    // creates the new vehicle
    const vehicle = await Vehicle.create({
      licencePlate: req.body.licencePlate,
      model: req.body.model,
      location: req.body.location,
      status: req.body.status,
      EmployeeId: req.body.EmployeeId
    })

    const response = SuccessResponse(
      res,
      200,
      'Vehicle created successfully',
      vehicle
    )
    return response
  } catch (err: any) {
    const error = new ErrorResponse(err.statusCode, false, err.message)
    next(error)
    return error
  }
}

export const deleteVehicle = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
  try {
    const vehicle = await Vehicle.destroy({
      where: {
        licencePlate: req.params.id
      }
    })
    if (vehicle === 1) {
      const response = SuccessResponse(res, 200, 'Vehicle deleted', vehicle)
      return response
    }
    const error = new ErrorResponse(404, false, 'Vehicle not found')
    next(error)
    return error
  } catch (err: any) {
    const error = new ErrorResponse(err.statusCode, false, err.message)
    next(error)
    return error
  }
}
