import express from 'express'
import request from 'supertest';
import dotenv from 'dotenv'
import db from '../models'
import driverRoutes from '../routes/driver'

const app = express()
app.use(express.json())
app.use('/api/drivers/', driverRoutes)

dotenv.config()

const Driver = db.Driver

describe('Get All Drivers', () => {
  beforeAll(async () => {
    await Driver.sync({ force: true });
    for (let index = 0; index < 5; index++) {
      await request(app)
        .post('/api/drivers/register')
        .send({
          firstName: `John${index}`,
          lastName: `Doe${index}`,
          email: `johndoe${index}@example.com`,
          password: 'password',
          phone: `${1234567890 + index}`,
        });
    }
  });

  afterEach(async () => {
    await Driver.sync({ force: true });
  });

  it('should retrieve all drivers correctly', async () => {
    const response = await request(app)
      .get('/api/drivers');

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual('Drivers retrieved successfully');
    expect(Array.isArray(response.body.data)).toBeTruthy();
    response.body.data.forEach((item: any) => {
      expect(item).toEqual(
        expect.objectContaining({
          firstName: expect.any(String),
          lastName: expect.any(String),
          email: expect.any(String),
          phone: expect.any(String),
        })
      );
    });
  });
});

describe('Get Driver', () => {
  let createdDriver: any;

  beforeAll(async () => {
    await Driver.sync({ force: true });
    const response = await request(app)
      .post('/api/drivers/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password',
        phone: '1234567890',
      });
    createdDriver = response.body.data.driverId;
  });

  afterEach(async () => {
    await Driver.sync({ force: true });
  });

  it('should retrieve the correct driver', async () => {
    const response = await request(app)
      .get(`/api/drivers/${createdDriver}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual('Driver retrieved successfully');
    expect(response.body.data.driverId).toEqual(parseInt(createdDriver));
  });

  it("should return a 404 error when trying to retrieve a non-existent driver", async () => {
    const invalidId = 99999;
    const response = await request(app)
      .get(`/api/drivers/${invalidId}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toEqual('Driver not found');
  });
});

describe('Register Driver', () => {
  beforeAll(async () => {
    await Driver.sync({ force: true });
  });

  afterEach(async () => {
    await Driver.sync({ force: true });
  });

  it('should create a new driver', async () => {
    const response = await request(app)
      .post('/api/drivers/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password',
        phone: '1234567890',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual('Driver created successfully');
  });

  it('should fail if email already exists', async () => {
    await request(app)
      .post('/api/drivers/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password',
        phone: '1234567890',
      });

    const response = await request(app)
      .post('/api/drivers/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password',
        phone: '1234567890',
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Email already exists');
  });

  it('should fail if password is not provided', async () => {
    const response = await request(app)
      .post('/api/drivers/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
      });

    expect(response.statusCode).toBe(500);
  });

  it('should fail if password is not valid', async () => {
    const response = await request(app)
      .post('/api/drivers/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: '123',
        phone: '1234567890',
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Validation error: Password must be between 8 and 64 characters');
  });
});

describe('Login Driver', () => {
  beforeAll(async () => {
    await Driver.sync({ force: true });
    await request(app)
      .post('/api/drivers/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password',
        phone: '1234567890',
      });
  });

  afterAll(async () => {
    await Driver.sync({ force: true });
  });

  it('should log in a valid driver', async () => {

    const response = await request(app)
      .post('/api/drivers/login')
      .send({
        email: 'john@example.com',
        password: 'password'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Driver logged successfully');
  });

  it('should fail if email is not valid', async () => {
    const response = await request(app)
      .post('/api/drivers/login')
      .send({
        email: 'invalid@example.com',
        password: 'password'
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Invalid email or password');
  });

  it('should fail if password is not valid', async () => {
    const response = await request(app)
      .post('/api/drivers/login')
      .send({
        email: 'john@example.com',
        password: 'invalid'
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Invalid email or password');
  });
});

describe('Delete Driver', () => {
  let createdDriver: any;

  beforeAll(async () => {
    await Driver.sync({ force: true });
    const response = await request(app)
      .post('/api/drivers/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password',
        phone: '1234567890',
      });
    createdDriver = response.body.data.driverId;
  });

  afterEach(async () => {
    await Driver.sync({ force: true });
  });

  it('should delete a driver successfully', async () => {
    const response = await request(app)
      .delete(`/api/drivers/${createdDriver}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual('Driver deleted');
    expect(response.body.data).toEqual(createdDriver);
  });

  it("should return a 404 error when trying to delete a non-existent driver", async () => {
    const invalidId = 99999;
    const response = await request(app)
      .delete(`/api/drivers/${invalidId}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toEqual('Driver not found');
  });
});
