import { type Response, type NextFunction, type Request } from 'express';
import SuccessResponse from '../utils/success';
import ErrorResponse from '../utils/error';
import Order from '../models/order';
import Client from '../models/client';

export const getAllOrders = async (req: Request, res: Response, next: NextFunction): Promise<Response | ErrorResponse> => {
  const orders = await Order.findAll();
  const response = SuccessResponse(res, 200, 'Orders retrieved successfully', orders);
  return response;
};

export const getOrder = async (req: Request, res: Response, next: NextFunction): Promise<Response | ErrorResponse> => {
  const order = await Order.findByPk(req.params.id);
  if (!order) {
    throw new ErrorResponse(404, false, 'Order not found');
  } else {
    const response = SuccessResponse(res, 200, 'Order retrieved successfully', order);
    return response;
  }
};

export const newOrder = async (req: Request, res: Response, next: NextFunction): Promise<Response | ErrorResponse> => {
  const { origin, destination, distance, status, deliveredAt, description, weight, vehicleId, driverId, senderId, receiverId } = req.body;

  const [existingVehicle, existingDriver, existingSender, existingReceiver] = await Promise.all([
    Client.findOne({ where: { clientId: vehicleId } }),
    Client.findOne({ where: { clientId: driverId } }),
    Client.findOne({ where: { clientId: senderId } }),
    Client.findOne({ where: { clientId: receiverId } }),
  ]);

  if (!existingVehicle) throw new ErrorResponse(404, false, 'Vehicle not found');
  if (!existingDriver) throw new ErrorResponse(404, false, 'Driver not found');
  if (!existingSender) throw new ErrorResponse(404, false, 'Sender not found');
  if (!existingReceiver) throw new ErrorResponse(404, false, 'Receiver not found');

  const orderData = {
    origin,
    destination,
    distance,
    status,
    deliveredAt,
    description,
    weight,
    vehicleId,
    driverId,
    senderId: existingSender.clientId,
    receiverId: existingReceiver.clientId,
  };

  const order = await Order.create(orderData as Order);

  const response = SuccessResponse(res, 200, 'Order created successfully', order);
  return response;
};

export const deleteOrder = async (req: Request, res: Response, next: NextFunction): Promise<Response | ErrorResponse> => {
  const rowsDeleted = await Order.destroy({
    where: {
      id: req.params.id,
    },
  });
  if (rowsDeleted === 1) {
    const response = SuccessResponse(res, 200, 'Order deleted', rowsDeleted);
    return response;
  }
  throw new ErrorResponse(404, false, 'Order not found');
};
