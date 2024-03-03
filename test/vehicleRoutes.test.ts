import express from 'express'
import request from 'supertest';
import dotenv from 'dotenv'
import db from '../models'
import vehicleRoutes from '../routes/vehicle'

const app = express()
app.use(express.json())
app.use('/api/vehicles/', vehicleRoutes)

dotenv.config()

const Vehicle = db.Vehicle

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
          status: 'operational'
        });
    }
  });

  afterEach(async () => {
    await Vehicle.sync({ force: true });
  });

  it('should retrieve all vehicles correctly', async () => {
    const response = await request(app as any)
      .get('/api/vehicles');

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual('Vehicles retrieved successfully');
    expect(Array.isArray(response.body.data)).toBeTruthy();
    response.body.data.forEach((item: any) => {
      expect(item).toEqual(
        expect.objectContaining({
          licencePlate: expect.any(String),
          model: expect.any(String),
          location: expect.any(String),
          status: expect.any(String)
        })
      );
    });
  });
});

describe('Get Vehicle', () => {
  let createdVehicle: number;

  beforeAll(async () => {
    await Vehicle.sync({ force: true });
    const response = await request(app)
      .post('/api/vehicles/new')
      .send({
        licencePlate: 'ABC-123',
        model: 'Test Model',
        location: 'Test Location',
        status: 'operational'
      });
    console.log(response.body)
    createdVehicle = response.body.data.id;
  });

  afterEach(async () => {
    await Vehicle.sync({ force: true });
  });

  it('should retrieve the correct vehicle', async () => {
    const response = await request(app)
      .get(`/api/vehicles/${createdVehicle}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual('Vehicle retrieved successfully');
    expect(response.body.data.id).toEqual(createdVehicle);
  });

  it("should return a 404 error when trying to retrieve a non-existent vehicle", async () => {
    const invalidId = 99999;
    const response = await request(app)
      .get(`/api/vehicles/${invalidId}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toEqual('Vehicle not found');
  });
});
