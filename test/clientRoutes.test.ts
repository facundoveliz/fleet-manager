import express from 'express'
import request from 'supertest'
import dotenv from 'dotenv'
import db from '../models'
import clientRoutes from '../routes/client'

const app = express()
app.use(express.json())
app.use('/api/clients/', clientRoutes)

dotenv.config()

const Client = db.Client

describe('Get All Clients', () => {
  beforeAll(async () => {
    await Client.sync({ force: true })
    for (let index = 0; index < 5; index++) {
      await request(app)
        .post('/api/clients/register')
        .send({
          company: `Company${index}`,
          firstName: `John${index}`,
          lastName: `Doe${index}`,
          phone: `${1234567890 + index}`,
          email: `johndoe${index}@example.com`,
        })
    }
  })

  afterEach(async () => {
    await Client.sync({ force: true })
  })

  it('should retrieve all clients correctly', async () => {
    const response = await request(app).get('/api/clients')

    expect(response.statusCode).toBe(200)
    expect(response.body.message).toEqual('Clients retrieved successfully')
    expect(Array.isArray(response.body.data)).toBeTruthy()
    response.body.data.forEach((item: any) => {
      expect(item).toEqual(
        expect.objectContaining({
          company: expect.any(String),
          firstName: expect.any(String),
          lastName: expect.any(String),
          phone: expect.any(String),
          email: expect.any(String),
        }),
      )
    })
  })
})

describe('Get Client', () => {
  let createdClient: number

  beforeAll(async () => {
    await Client.sync({ force: true })
    const response = await request(app).post('/api/clients/register').send({
      company: 'Company',
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      email: 'johndoe@example.com',
    })
    createdClient = response.body.data.clientId
  })

  afterEach(async () => {
    await Client.sync({ force: true })
  })

  it('should retrieve the correct client', async () => {
    const response = await request(app).get(`/api/clients/${createdClient}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.message).toEqual('Client retrieved successfully')
    expect(response.body.data.clientId).toEqual(createdClient)
  })

  it('should return a 404 error when trying to retrieve a non-existent client', async () => {
    const invalidId = 99999
    const response = await request(app).get(`/api/clients/${invalidId}`)

    expect(response.statusCode).toBe(404)
    expect(response.body.message).toEqual('Client not found')
  })
})

describe('Register Client', () => {
  beforeAll(async () => {
    await Client.sync({ force: true })
  })

  afterEach(async () => {
    await Client.sync({ force: true })
  })

  it('should register a new client', async () => {
    const response = await request(app).post('/api/clients/register').send({
      company: 'Company',
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      email: 'johndoe@example.com',
    })

    expect(response.statusCode).toBe(200)
    expect(response.body.message).toEqual('Client created successfully')
  })

  it('should fail if email already exists', async () => {
    await request(app).post('/api/clients/register').send({
      company: 'Company',
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      email: 'johndoe@example.com',
    })

    const response = await request(app).post('/api/clients/register').send({
      company: 'Company',
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      email: 'johndoe@example.com',
    })

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toBe('Email already exists')
  })

  it('should fail if company is not provided', async () => {
    const response = await request(app).post('/api/clients/register').send({
      company: null,
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      email: 'johndoe@example.com',
    })

    expect(response.statusCode).toBe(500)
    expect(response.body.message).toBe(
      'notNull Violation: Client.company cannot be null',
    )
  })
})

describe('Delete Client', () => {
  let createdClient: any

  beforeAll(async () => {
    await Client.sync({ force: true })
    const response = await request(app).post('/api/clients/register').send({
      company: 'Company',
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      email: 'johndoe@example.com',
    })
    createdClient = response.body.data.clientId
  })

  afterEach(async () => {
    await Client.sync({ force: true })
  })

  it('should delete a client successfully', async () => {
    const response = await request(app).delete(`/api/clients/${createdClient}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.message).toEqual('Client deleted')
    expect(response.body.data).toEqual(createdClient)
  })

  it('should return a 404 error when trying to delete a non-existent client', async () => {
    const invalidId = 99999
    const response = await request(app).delete(`/api/clients/${invalidId}`)

    expect(response.statusCode).toBe(404)
    expect(response.body.message).toEqual('Client not found')
  })
})
