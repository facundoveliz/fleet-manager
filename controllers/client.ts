import { type Response, type NextFunction, type Request } from 'express'
import SuccessResponse from '../utils/success'
import ErrorResponse from '../utils/error'
import Client from '../models/client'

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
  if (!client) {
    throw new ErrorResponse(404, false, 'Client not found')
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
  const { company, firstName, lastName, phone, email } = req.body

  let client = await Client.findOne({ where: { email } })

  if (client !== null) {
    throw new ErrorResponse(400, false, 'Email already exists')
  }

  const clientData = {
    company,
    firstName,
    lastName,
    phone,
    email
  }

  client = await Client.create(clientData as Client)

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
  const clientDeletedCount = await Client.destroy({
    where: {
      clientId: req.params.id
    }
  })
  if (clientDeletedCount === 1) {
    const response = SuccessResponse(
      res,
      200,
      'Client deleted',
      clientDeletedCount
    )
    return response
  }
  throw new ErrorResponse(404, false, 'Client not found')
}
