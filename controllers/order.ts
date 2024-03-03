import { type Response, type NextFunction, type Request } from 'express'
import SuccessResponse from '../utils/success'
import ErrorResponse from '../utils/error'
import db from '../models'

const Order = db.order

export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
  const orders = await Order.findAll()
  const response = SuccessResponse(
    res,
    200,
    'Orders retrieved successfully',
    orders
  )
  return response
}

export const getOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
  const order = await Order.findByPk(req.params.id)
  if (order === null) {
    throw new ErrorResponse(404, false, 'Order not found');
  } else {
    const response = SuccessResponse(
      res,
      200,
      'Order retrieved successfully',
      order
    )
    return response
  }
}

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
  // creates the new order
  const order = await Order.create({
    description: req.body.description,
    wayPoints: req.body.wayPoints,
    status: req.body.status,
    licencePlate: req.body.licencePlate,
    clientId: req.body.clientId
  })

  const response = SuccessResponse(
    res,
    200,
    'Order created successfully',
    order
  )
  return response
}

export const deleteOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
  const order = await Order.destroy({
    where: {
      licencePlate: req.params.id
    }
  })
  if (order === 1) {
    const response = SuccessResponse(res, 200, 'Order deleted', order)
    return response
  }
  throw new ErrorResponse(404, false, 'Order not found');
}
