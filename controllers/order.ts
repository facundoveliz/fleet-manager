import { type Response, type NextFunction, type Request } from 'express'
import SuccessResponse from '../utils/success'
import ErrorResponse from '../utils/error'
import db from '../models'

const Order = db.Order
const Client = db.Client

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
  if (!order) {
    throw new ErrorResponse(404, false, 'Order not found')
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
  const [existingVehicle, existingDriver, existingShipment, existingClient] =
    await Promise.all([
      Client.findOne({ where: { clientId: req.body.vehicleId } }),
      Client.findOne({ where: { clientId: req.body.driverId } }),
      Client.findOne({ where: { clientId: req.body.shipmentId } }),
      Client.findOne({ where: { clientId: req.body.clientId } })
    ])

  if (!existingVehicle) throw new ErrorResponse(404, false, 'Vehicle not found')
  if (!existingDriver) throw new ErrorResponse(404, false, 'Driver not found')
  if (!existingShipment) { throw new ErrorResponse(404, false, 'Shipment not found') }
  if (!existingClient) { throw new ErrorResponse(404, false, 'Driver Client found') }

  const order = await Order.create({
    origin: req.body.origin,
    destination: req.body.destination,
    distance: req.body.distance,
    duration: req.body.duration,
    date: req.body.date,
    status: req.body.status,
    vehicleId: req.body.vehicleId,
    driverId: req.body.driverId,
    shipmentId: req.body.shipmentId,
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
  const rowsDeleted = await Order.destroy({
    where: {
      id: req.params.id
    }
  })
  if (rowsDeleted === 1) {
    const response = SuccessResponse(res, 200, 'Order deleted', rowsDeleted)
    return response
  }
  throw new ErrorResponse(404, false, 'Order not found')
}
