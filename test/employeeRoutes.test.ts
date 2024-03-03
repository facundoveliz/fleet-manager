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

describe('Get All Employees', () => {
  beforeAll(async () => {
    await Employee.sync({ force: true });
    for (let index = 0; index < 5; index++) {
      await request(app)
        .post('/api/employees/register')
        .send({
          firstName: `John${index}`,
          lastName: `Doe${index}`,
          email: `johndoe${index}@example.com`,
          password: 'password',
          phone: `${1234567890 + index}`,
          role: 'manager'
        });
    }
  });

  afterEach(async () => {
    await Employee.sync({ force: true });
  });

  it('should retrieve all employees correctly', async () => {
    const response = await request(app)
      .get('/api/employees');

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual('Employees retrieved successfully');
    expect(Array.isArray(response.body.data)).toBeTruthy();
    response.body.data.forEach((item: any) => {
      expect(item).toEqual(
        expect.objectContaining({
          firstName: expect.any(String),
          lastName: expect.any(String),
          email: expect.any(String),
          phone: expect.any(String),
          role: expect.any(String)
        })
      );
    });
  });
});

describe('Get Employee', () => {
  let createdEmployee: any;

  beforeAll(async () => {
    await Employee.sync({ force: true });
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
    createdEmployee = response.body.data.id;
  });

  afterEach(async () => {
    await Employee.sync({ force: true });
  });

  it('should retrieve the correct employee', async () => {
    const response = await request(app)
      .get(`/api/employees/${createdEmployee}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual('Employee retrieved successfully');
    expect(response.body.data.id).toEqual(parseInt(createdEmployee));
  });

  it("should return a 404 error when trying to retrieve a non-existent employee", async () => {
    const invalidId = 99999;
    const response = await request(app)
      .get(`/api/employees/${invalidId}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toEqual('Employee not found');
  });
});

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
    expect(response.body.message).toEqual('Employee created successfully');
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

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Validation error: Password must be between 8 and 64 characters');
  });
});

describe('Login Employee', () => {
  beforeAll(async () => {
    await Employee.sync({ force: true });
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
  });

  afterAll(async () => {
    await Employee.sync({ force: true });
  });

  it('should log in a valid employee', async () => {

    const response = await request(app)
      .post('/api/employees/login')
      .send({
        email: 'john@example.com',
        password: 'password'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Employee logged successfully');
  });

  it('should fail if email is not valid', async () => {
    const response = await request(app)
      .post('/api/employees/login')
      .send({
        email: 'invalid@example.com',
        password: 'password'
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Invalid email or password');
  });

  it('should fail if password is not valid', async () => {
    const response = await request(app)
      .post('/api/employees/login')
      .send({
        email: 'john@example.com',
        password: 'invalid'
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Invalid email or password');
  });
});

describe('Delete Employee', () => {
  let createdEmployee: any; // This variable will store the ID of the employee we create for testing purposes

  beforeAll(async () => {
    await Employee.sync({ force: true });
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
    createdEmployee = response.body.data.id; // Save the ID of the newly created employee
  });

  afterEach(async () => {
    await Employee.sync({ force: true });
  });

  it('should delete an employee successfully', async () => {
    const response = await request(app)
      .delete(`/api/employees/${createdEmployee}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual('Employee deleted');
    expect(response.body.data).toEqual(createdEmployee);
  });

  it("should return a 404 error when trying to delete a non-existent employee", async () => {
    const invalidId = 99999;
    const response = await request(app)
      .delete(`/api/employees/${invalidId}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toEqual('Employee not found');
  });
});
