import express from 'express';
import request from 'supertest';
import vehicleRoutes from '../routes/vehicle';
import Vehicle from '../models/vehicle';
import createSequelizeInstance from './utils/sequelize';

const app = express();
app.use(express.json());
app.use('/api/vehicles/', vehicleRoutes);

createSequelizeInstance();

describe('Get All Vehicles', () => {
  beforeAll(async () => {
    await Vehicle.sync({ force: true });
    for (let index = 0; index < 5; index++) {
      await request(app)
        .post('/api/vehicles/new')
        .send({
          licencePlate: `ABC-123${index}`,
          model: `Model${index}`,
          location: `Location${index}`,
          status: 'operational',
          capacity: index,
        });
    }
  });

  afterEach(async () => {
    await Vehicle.sync({ force: true });
  });

  it('should retrieve all vehicles correctly', async () => {
    const response = await request(app).get('/api/vehicles');

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual('Vehicles retrieved successfully');
    expect(Array.isArray(response.body.data)).toBeTruthy();
    response.body.data.forEach((item: any) => {
      expect(item).toEqual(
        expect.objectContaining({
          licencePlate: expect.any(String),
          model: expect.any(String),
          location: expect.any(String),
          status: expect.any(String),
          capacity: expect.any(Number),
        }),
      );
    });
  });
});

describe('Get Vehicle', () => {
  let createdVehicle: number;

  beforeEach(async () => {
    await Vehicle.sync({ force: true });
    const response = await request(app).post('/api/vehicles/new').send({
      licencePlate: 'ABC-123',
      model: 'Test Model',
      location: 'Test Location',
      status: 'operational',
      capacity: 100,
    });
    createdVehicle = response.body.data.vehicleId;
  });

  afterEach(async () => {
    await Vehicle.sync({ force: true });
  });

  it('should retrieve the correct vehicle', async () => {
    const response = await request(app).get(`/api/vehicles/${createdVehicle}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual('Vehicle retrieved successfully');
    expect(response.body.data.vehicleId).toEqual(createdVehicle);
  });

  it('should return a 404 error when trying to retrieve a non-existent vehicle', async () => {
    const invalidId = 99999;
    const response = await request(app).get(`/api/vehicles/${invalidId}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toEqual('Vehicle not found');
  });
});

describe('Create a new Vehicle', () => {
  beforeAll(async () => {
    await Vehicle.sync({ force: true });
  });

  afterEach(async () => {
    await Vehicle.sync({ force: true });
  });

  it('should create a new vehicle', async () => {
    const response = await request(app).post('/api/vehicles/new').send({
      licencePlate: 'ABC-123',
      model: 'Model',
      location: 'Location',
      status: 'operational',
      capacity: 100,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual('Vehicle created successfully');
  });

  it('should fail if licence plate already exists', async () => {
    await request(app).post('/api/vehicles/new').send({
      licencePlate: 'ABC-123',
      model: 'Model',
      location: 'Location',
      status: 'operational',
      capacity: 100,
    });

    const response = await request(app).post('/api/vehicles/new').send({
      licencePlate: 'ABC-123',
      model: 'Model',
      location: 'Location',
      status: 'operational',
      capacity: 100,
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Licence plate already exists');
  });

  it('should fail if model is not provided', async () => {
    const response = await request(app).post('/api/vehicles/new').send({
      licencePlate: 'ABC-123',
      model: null,
      location: 'Location',
      status: 'operational',
      capacity: 100,
    });

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe('notNull Violation: Vehicle.model cannot be null');
  });
});

describe('Delete Vehicle', () => {
  let createdVehicle: any;

  beforeEach(async () => {
    await Vehicle.sync({ force: true });
    const response = await request(app).post('/api/vehicles/new').send({
      licencePlate: 'ABC-123',
      model: 'Model',
      location: 'Location',
      status: 'operational',
      capacity: 100,
    });
    createdVehicle = response.body.data.vehicleId;
  });

  afterEach(async () => {
    await Vehicle.sync({ force: true });
  });

  it('should delete a vehicle successfully', async () => {
    const response = await request(app).delete(`/api/vehicles/${createdVehicle}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual('Vehicle deleted');
    expect(response.body.data).toEqual(createdVehicle);
  });

  it('should return a 404 error when trying to delete a non-existent vehicle', async () => {
    const invalidId = 99999;
    const response = await request(app).delete(`/api/vehicles/${invalidId}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toEqual('Vehicle not found');
  });
});
