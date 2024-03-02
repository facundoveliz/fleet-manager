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
  const deliveries = await Delivery.findAll()
  const response = SuccessResponse(
    res,
    200,
    'Deliveries retrieved successfully',
    deliveries
  )
  return response
}

export const getDelivery = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
  const delivery = await Delivery.findByPk(req.params.id)
  if (delivery === null) {
    throw new ErrorResponse(404, false, 'Delivery not found');
  } else {
    const response = SuccessResponse(
      res,
      200,
      'Delivery retrieved successfully',
      delivery
    )
    return response
  }
}

export const createDelivery = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
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
}

export const deleteDelivery = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
  const delivery = await Delivery.destroy({
    where: {
      licencePlate: req.params.id
    }
  })
  if (delivery === 1) {
    const response = SuccessResponse(res, 200, 'Delivery deleted', delivery)
    return response
  }
  throw new ErrorResponse(404, false, 'Delivery not found');
}
