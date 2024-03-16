import { type Response, type NextFunction, type Request } from 'express';
import SuccessResponse from '../utils/success';
import ErrorResponse from '../utils/error';
import Shipment from '../models/shipment';
import Client from '../models/client';

export const getAllShipments = async (req: Request, res: Response, next: NextFunction): Promise<Response | ErrorResponse> => {
  const shipments = await Shipment.findAll();
  const response = SuccessResponse(res, 200, 'Shipments retrieved successfully', shipments);
  return response;
};

export const getShipment = async (req: Request, res: Response, next: NextFunction): Promise<Response | ErrorResponse> => {
  const shipment = await Shipment.findByPk(req.params.id);
  if (shipment === null) {
    throw new ErrorResponse(404, false, 'Shipment not found');
  } else {
    const response = SuccessResponse(res, 200, 'Shipment retrieved successfully', shipment);
    return response;
  }
};

export const createShipment = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  const { description, weight, status, senderId, receiverId } = req.body;

  // Check if the sender and receiver already exists
  const [existingSender, existingReceiver] = await Promise.all([
    Client.findOne({ where: { clientId: senderId } }),
    Client.findOne({ where: { clientId: receiverId } }),
  ]);

  if (!existingSender) {
    throw new ErrorResponse(404, false, 'Sender not found');
  }

  if (!existingReceiver) {
    throw new ErrorResponse(404, false, 'Receiver not found');
  }

  const shipment = await Shipment.create({
    ...req.body,
    senderId: existingSender.clientId,
    receiverId: existingReceiver.clientId,
  });

  return SuccessResponse(res, 200, 'Shipment created successfully', shipment);
};

export const deleteShipment = async (req: Request, res: Response, next: NextFunction): Promise<Response | ErrorResponse> => {
  const shipment = await Shipment.destroy({
    where: {
      shipmentId: req.params.shipmentId,
    },
  });
  if (shipment === 1) {
    const response = SuccessResponse(res, 200, 'Shipment deleted', shipment);
    return response;
  }
  throw new ErrorResponse(404, false, 'Shipment not found');
};
