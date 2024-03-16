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

export const createOrder = async (req: Request, res: Response, next: NextFunction): Promise<Response | ErrorResponse> => {
  const { origin, destination, distance, duration, date, status, vehicleId, driverId, shipmentId, clientId } = req.body;

  const [existingVehicle, existingDriver, existingShipment, existingClient] = await Promise.all([
    Client.findOne({ where: { clientId: vehicleId } }),
    Client.findOne({ where: { clientId: driverId } }),
    Client.findOne({ where: { clientId: shipmentId } }),
    Client.findOne({ where: { clientId } }),
  ]);

  if (!existingVehicle) throw new ErrorResponse(404, false, 'Vehicle not found');
  if (!existingDriver) throw new ErrorResponse(404, false, 'Driver not found');
  if (!existingShipment) {
    throw new ErrorResponse(404, false, 'Shipment not found');
  }
  if (!existingClient) {
    throw new ErrorResponse(404, false, 'Driver Client found');
  }

  const orderData = {
    origin,
    destination,
    distance,
    duration,
    date,
    status,
    vehicleId,
    driverId,
    shipmentId,
    clientId,
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
