import { type Response, type NextFunction, type Request } from 'express'
import SuccessResponse from '../utils/success'
import ErrorResponse from '../utils/error'
import db from '../models'

const Order = db.Order // Corrected the import alias

export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
  const orders = await Order.findAll();
  const response = SuccessResponse(
    res,
    200,
    'Orders retrieved successfully',
    orders
  );
  return response;
}

export const getOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
  const order = await Order.findByPk(req.params.id);
  if (!order) {
    throw new ErrorResponse(404, false, 'Order not found');
  } else {
    const response = SuccessResponse(
      res,
      200,
      'Order retrieved successfully',
      order
    );
    return response;
  }
}

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
  const order = await Order.create({
    origin: req.body.origin,
    destination: req.body.destination,
    distance: req.body.distance,
    duration: req.body.duration,
    date: req.body.date,
    status: req.body.status,
    vehicleId: req.body.vehicleId,
    employeeId: req.body.employeeId,
    shipmentId: req.body.shipmentId,
    clientId: req.body.clientId
  });

  const response = SuccessResponse(
    res,
    200,
    'Order created successfully',
    order
  );
  return response;
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
  });
  if (rowsDeleted === 1) {
    const response = SuccessResponse(res, 200, 'Order deleted', rowsDeleted);
    return response;
  }
  throw new ErrorResponse(404, false, 'Order not found');
}
