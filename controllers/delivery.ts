import { type Response, type NextFunction, type Request } from 'express'
import SuccessResponse from '../utils/success'
import ErrorResponse from '../utils/error'
import db from '../models'

const Delivery = db.Delivery

export const getAllDeliveries = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
  try {
    const deliveries = await Delivery.findAll()
    const response = SuccessResponse(
      res,
      200,
      'Deliveries retrieved successfully',
      deliveries
    )
    return response
  } catch (err: any) {
    const error = new ErrorResponse(err.statusCode, false, err.message)
    next(error)
    return error
  }
}

export const getDelivery = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
  try {
    const delivery = await Delivery.findByPk(req.params.id)
    if (delivery === null) {
      const error = new ErrorResponse(404, false, 'Delivery not found')
      next(error)
      return error
    } else {
      const response = SuccessResponse(
        res,
        200,
        'Delivery retrieved successfully',
        delivery
      )
      return response
    }
  } catch (err: any) {
    const error = new ErrorResponse(err.statusCode, false, err.message)
    next(error)
    return error
  }
}

export const createDelivery = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
  try {
    // creates the new delivery
    const delivery = await Delivery.create({
      description: req.body.description,
      wayPoints: req.body.wayPoints,
      status: req.body.status,
      employeeId: req.body.employeeId,
      licencePlate: req.body.licencePlate,
      clientId: req.body.clientId
    })

    const response = SuccessResponse(
      res,
      200,
      'Delivery created successfully',
      delivery
    )
    return response
  } catch (err: any) {
    const error = new ErrorResponse(err.statusCode, false, err.message)
    next(error)
    return error
  }
}

export const deleteDelivery = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
  try {
    const delivery = await Delivery.destroy({
      where: {
        licencePlate: req.params.id
      }
    })
    if (delivery === 1) {
      const response = SuccessResponse(res, 200, 'Delivery deleted', delivery)
      return response
    }
    const error = new ErrorResponse(404, false, 'Delivery not found')
    next(error)
    return error
  } catch (err: any) {
    const error = new ErrorResponse(err.statusCode, false, err.message)
    next(error)
    return error
  }
}
