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
  const clients = await Client.findAll()
  const response = SuccessResponse(
    res,
    200,
    'Clients retrieved successfully',
    clients
  )
  return response
}

export const getClient = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
  const client = await Client.findByPk(req.params.id)
  if (client === null) {
    throw new ErrorResponse(404, false, 'Client not found');
  } else {
    const response = SuccessResponse(
      res,
      200,
      'Client retrieved successfully',
      client
    )
    return response
  }
}

export const registerClient = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
  // checks if the email doesn't exists
  let client = await Client.findOne({ where: { email: req.body.email } })
  // if the email exists, the func ends here
  if (client != null) {
    throw new ErrorResponse(400, false, 'Email already exists');
  }

  // creates the new client
  client = await Client.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    company: req.body.company
  })

  const response = SuccessResponse(
    res,
    200,
    'Client created successfully',
    client
  )
  return response
}

export const deleteClient = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | ErrorResponse> => {
  const client = await Client.destroy({
    where: {
      id: req.params.id
    }
  })
  if (client === 1) {
    const response = SuccessResponse(res, 200, 'Client deleted', client)
    return response
  }
  const error = new ErrorResponse(404, false, 'Client not found')
  throw new ErrorResponse(404, false, 'Client not found');
}
