import { type Response, type NextFunction, type Request } from 'express'
import db from '../models'
import SuccessResponse from '../utils/success'
import ErrorResponse from '../utils/error'

const Shipment = db.Shipment
const Client = db.Client

export const getAllShipments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
  const shipments = await Shipment.findAll();
  const response = SuccessResponse(res, 200, 'Shipments retrieved successfully', shipments);
  return response;
}

export const getShipment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
  const shipment = await Shipment.findByPk(req.params.id)
  if (shipment === null) {
    throw new ErrorResponse(404, false, 'Shipment not found');
  } else {
    const response = SuccessResponse(
      res,
      200,
      'Shipment retrieved successfully',
      shipment
    )
    return response
  }
}

export const createShipment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  // Check if the sender and receiver already exists
  const [existingSender, existingReceiver] = await Promise.all([
    Client.findOne({ where: { clientId: req.body.senderId } }),
    Client.findOne({ where: { clientId: req.body.receiverId } })
  ]);

  if (!existingSender) {
    throw new ErrorResponse(404, false, 'Sender not found');
  }

  if (!existingReceiver) {
    throw new ErrorResponse(404, false, 'Receiver not found');
  }

  const shipment = await Shipment.create({
    description: req.body.description,
    weight: req.body.weight,
    status: req.body.status,
    senderId: req.body.senderId,
    receiverId: req.body.receiverId,
  });

  return SuccessResponse(res, 200, 'Shipment created successfully', shipment);
};

export const deleteShipment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
  const shipment = await Shipment.destroy({
    where: {
      shipmentId: req.params.shipmentId
    }
  })
  if (shipment === 1) {
    const response = SuccessResponse(res, 200, 'Shipment deleted', shipment)
    return response
  }
  throw new ErrorResponse(404, false, 'Shipment not found');
}
