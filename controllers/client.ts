import { type Response, type NextFunction, type Request } from 'express'
import SuccessResponse from '../utils/success'
import ErrorResponse from '../utils/error'
import db from '../models'

const Client = db.Client

export const getAllClients = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
  const clients = await Client.findAll();
  const response = SuccessResponse(
    res,
    200,
    'Clients retrieved successfully',
    clients
  );
  return response;
}

export const getClient = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
  const client = await Client.findByPk(req.params.id);
  if (!client) {
    throw new ErrorResponse(404, false, 'Client not found');
  } else {
    const response = SuccessResponse(
      res,
      200,
      'Client retrieved successfully',
      client
    );
    return response;
  }
}

export const registerClient = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
  // Check if the email does not exist
  let client = await Client.findOne({ where: { email: req.body.email } });
  // If the email exists, end the function here
  if (client !== null) {
    throw new ErrorResponse(400, false, 'Email already exists');
  }

  // Create the new client
  client = await Client.create({
    clientId: undefined, // Allow Sequelize to generate ID
    company: req.body.company,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone,
    email: req.body.email,
  });

  const response = SuccessResponse(
    res,
    200,
    'Client created successfully',
    client
  );
  return response;
}

export const deleteClient = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
  const clientDeletedCount = await Client.destroy({
    where: {
      clientId: req.params.id
    }
  });
  if (clientDeletedCount === 1) {
    const response = SuccessResponse(res, 200, 'Client deleted', clientDeletedCount);
    return response;
  }
  throw new ErrorResponse(404, false, 'Client not found');
}
