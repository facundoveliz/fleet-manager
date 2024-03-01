import express from 'express'
import request from 'supertest';
import dotenv from 'dotenv'
import db from '../models'
import employeeRoutes from '../routes/employee'

const app = express()
app.use(express.json())
app.use('/api/employees/', employeeRoutes)

dotenv.config()

const Employee = db.Employee

describe('Register Employee', () => {
  beforeAll(async () => {
    await Employee.sync({ force: true });
  });

  afterEach(async () => {
    await Employee.sync({ force: true });
  });

  it('should create a new employee', async () => {
    const response = await request(app)
      .post('/api/employees/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password',
        phone: '1234567890',
        role: 'manager'
      });

    expect(response.statusCode).toBe(200);

    // Check if the response body contains the 'success' property and that it is true
    if (response.body.success) {
      expect(response.body.message).toEqual('Employee created successfully');
    } else {
      // Handle the error case
      expect(response.body.message).toBe('Error creating employee');
    }
  });

  it('should fail if email already exists', async () => {
    await request(app)
      .post('/api/employees/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password',
        phone: '1234567890',
        role: 'manager'
      });

    const response = await request(app)
      .post('/api/employees/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password',
        phone: '1234567890',
        role: 'manager'
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Email already exists');
  });

  it('should fail if password is not provided', async () => {
    const response = await request(app)
      .post('/api/employees/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
        role: 'manager'
      });

    expect(response.statusCode).toBe(500);
  });

  it('should fail if password is not valid', async () => {
    const response = await request(app)
      .post('/api/employees/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: '123',
        phone: '1234567890',
        role: 'manager'
      });

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe('Validation error: Name must be between 3 and 25 characters');
  });
});
