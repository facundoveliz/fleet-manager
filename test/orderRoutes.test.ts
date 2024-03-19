import express from 'express';
import request from 'supertest';
import orderRoutes from '../routes/order';
import clientRoutes from '../routes/client';
import driverRoutes from '../routes/driver';
import vehicleRoutes from '../routes/vehicle';
import Order from '../models/order';
import Client from '../models/client';
import Driver from '../models/driver';
import Vehicle from '../models/vehicle';
import createSequelizeInstance from './utils/sequelize';

const app = express();
app.use(express.json());
app.use('/api/orders/', orderRoutes);
app.use('/api/clients/', clientRoutes);
app.use('/api/drivers/', driverRoutes);
app.use('/api/vehicles/', vehicleRoutes);

createSequelizeInstance();

beforeAll(async () => {
  await Order.sync({ force: true });
  await Client.sync({ force: true });
  await Driver.sync({ force: true });
  await Vehicle.sync({ force: true });
  for (let index = 0; index < 5; index++) {
    const receiver = await request(app)
      .post('/api/clients/new')
      .send({
        company: `Company1${index}`,
        firstName: `John${index}`,
        lastName: `Doe${index}`,
        phone: `${1234567890 + index}`,
        email: `johndoe${index}@example.com`,
      });

    const sender = await request(app)
      .post('/api/clients/new')
      .send({
        company: `Company2${index}`,
        firstName: `Jane${index}`,
        lastName: `Doe${index}`,
        phone: `${1234567890 + index}`,
        email: `janedoe${index}@example.com`,
      });

    const driver = await request(app)
      .post('/api/drivers/new')
      .send({
        firstName: `John${index}`,
        lastName: `Doe${index}`,
        email: `johndoe${index}@example.com`,
        phone: `${1234567890 + index}`,
      });

    const vehicle = await request(app)
      .post('/api/vehicles/new')
      .send({
        licencePlate: `ABC-12${index}`,
        model: `Model${index}`,
        location: `Location${index}`,
        status: 'operational',
        capacity: index + 1,
      });

    await request(app)
      .post('/api/orders/new')
      .send({
        origin: `Origin${index}`,
        destination: `Destination${index}`,
        distance: 10 + index,
        status: 'pending',
        description: `Description${index}`,
        weight: 1 + index,
        vehicleId: vehicle.body.data.vehicleId,
        driverId: driver.body.data.driverId,
        senderId: sender.body.data.clientId,
        receiverId: receiver.body.data.clientId,
      });
  }
});

afterAll(async () => {
  await Order.sync({ force: true });
  await Client.sync({ force: true });
  await Driver.sync({ force: true });
  await Vehicle.sync({ force: true });
});

describe('Get All Orders', () => {
  it('should retrieve all orders correctly', async () => {
    const response = await request(app).get('/api/orders');

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual('Orders retrieved successfully');
    expect(Array.isArray(response.body.data)).toBeTruthy();
    response.body.data.forEach((item: any, index: number) => {
      expect(item).toEqual(
        expect.objectContaining({
          orderId: expect.any(Number),
          origin: `Origin${index}`,
          destination: `Destination${index}`,
          distance: 10 + index,
          status: 'pending',
          description: `Description${index}`,
          weight: 1 + index,
          vehicleId: expect.any(Number),
          senderId: expect.any(Number),
          receiverId: expect.any(Number),
        }),
      );
    });
  });
});

describe('Get Order', () => {
  it('should retrieve the correct order', async () => {
    const response = await request(app).get(`/api/orders/1`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual('Order retrieved successfully');
    expect(response.body.data.orderId).toEqual(1);
  });

  it('should return a 404 error when trying to retrieve a non-existent order', async () => {
    const invalidId = 99999;
    const response = await request(app).get(`/api/orders/${invalidId}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toEqual('Order not found');
  });
});

describe('New Order', () => {
  it('should create a new order with valid data', async () => {
    const response = await request(app).post('/api/orders/new').send({
      origin: 'Origin',
      destination: 'Destination',
      distance: 10,
      status: 'pending',
      description: 'Description',
      weight: 1,
      vehicleId: 1,
      driverId: 1,
      senderId: 1,
      receiverId: 2,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual('Order created successfully');
    expect(response.body.data).toEqual(
      expect.objectContaining({
        orderId: expect.any(Number),
        origin: 'Origin',
        destination: 'Destination',
        distance: 10,
        status: 'pending',
        description: 'Description',
        weight: 1,
        vehicleId: 1,
        senderId: 1,
        receiverId: 2,
      }),
    );
  });
});

describe('New Order', () => {
  it("should fail if vehicleId doesn't found", async () => {
    const response = await request(app).post('/api/orders/new').send({
      origin: `Origin`,
      destination: 'Destination',
      distance: 10,
      status: 'pending',
      description: 'Description',
      weight: 1,
      vehicleId: 9999,
      driverId: 1,
      senderId: 1,
      receiverId: 2,
    });

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('Vehicle not found');
  });

  it('should fail if status is not provided', async () => {
    const response = await request(app).post('/api/orders/new').send({
      origin: `Origin`,
      destination: 'Destination',
      distance: 10,
      description: 'Description',
      weight: 1,
      vehicleId: 1,
      driverId: 1,
      senderId: 1,
      receiverId: 2,
    });

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe('notNull Violation: Order.status cannot be null');
  });
});

describe('Delete Order', () => {
  it('should delete an order successfully', async () => {
    const response = await request(app).delete(`/api/orders/1`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual('Order deleted');
  });

  it('should return a 404 error when trying to delete a non-existent order', async () => {
    const invalidId = 99999;
    const response = await request(app).delete(`/api/orders/${invalidId}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toEqual('Order not found');
  });
});
