import { Response, NextFunction } from 'express';
import { getAllEmployees, loginEmployee, registerEmployee } from '../controllers/employee';
import Employee from '../models/employee';
import bcrypt from 'bcrypt'

jest.mock('../models/employee');
jest.mock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue('mockedSalt'),
  hash: jest.fn().mockResolvedValue('mockedHash')
}));

let req: any;
let res: Response;
let next: NextFunction;

describe('getAllEmployees', () => {
  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;
    next = jest.fn();
  });

  it('should return all employees when Employee.findAll() succeeds', async () => {
    const mockEmployees = [{ id: 1, firstName: 'John', lastName: 'Doe' }];
    (Employee.findAll as jest.Mock).mockResolvedValue(mockEmployees);

    await getAllEmployees(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Employees retrieved successfully',
      data: mockEmployees,
    });
  });

  it('should handle errors and call next with ErrorResponse', async () => {
    const mockError = new Error('Internal Server Error');
    (Employee.findAll as jest.Mock).mockRejectedValue(mockError);

    await getAllEmployees(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 500, message: 'Internal Server Error' }));
  });
});

describe('registerEmployee', () => {
  beforeEach(() => {
    req = {
      body: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        phone: '123-456-7890',
        role: 'driver',
        VehicleId: 1
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;
    next = jest.fn();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should register a new employee successfully', async () => {
    (Employee.findOne as jest.Mock).mockResolvedValue(null);
    (Employee.create as jest.Mock).mockResolvedValue({ id: 1, ...req.body });

    await registerEmployee(req, res, next);

    expect(Employee.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
    expect(Employee.create).toHaveBeenCalledWith({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: 'mockedHash',
      phone: req.body.phone,
      role: req.body.role,
      VehicleId: req.body.VehicleId
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Employee created successfully',
      data: expect.objectContaining({ id: 1, ...req.body })
    });
  });

  it('should handle registration when email already exists', async () => {
    (Employee.findOne as jest.Mock).mockResolvedValue({ id: 1, ...req.body });

    await registerEmployee(req, res, next);

    expect(Employee.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Email already exists'
    });
  });

  it('should handle errors during registration', async () => {
    const mockError = new Error('Internal Server Error');
    (Employee.findOne as jest.Mock).mockRejectedValue(mockError);

    await registerEmployee(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 500, message: 'Internal Server Error' }));
  });
});

describe('loginEmployee', () => {
  beforeEach(() => {
    req = {
      body: {
        email: 'john.doe@example.com',
        password: 'password123',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;
    next = jest.fn();
  });

  it('should login an employee with valid credentials', async () => {
    const mockEmployee = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'hashedPassword',
      phone: '123-456-7890',
      role: 'driver',
      VehicleId: 1,
    };

    (Employee.findOne as jest.Mock).mockResolvedValue(mockEmployee);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    await loginEmployee(req, res, next);

    expect(Employee.findOne).toHaveBeenCalledWith({
      where: { email: req.body.email },
    });
    expect(bcrypt.compare).toHaveBeenCalledWith(
      req.body.password,
      mockEmployee.password
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Employee logged successfully',
      data: expect.any(String), // JWT token
    });
  });

  it('should handle login with invalid email', async () => {
    (Employee.findOne as jest.Mock).mockResolvedValue(null);

    await loginEmployee(req, res, next);

    expect(Employee.findOne).toHaveBeenCalledWith({
      where: { email: req.body.email },
    });
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: 'Invalid email or password',
      })
    );
  });

  it('should handle login with invalid password', async () => {
    const mockEmployee = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'hashedPassword',
      phone: '123-456-7890',
      role: 'driver',
      VehicleId: 1,
    };

    (Employee.findOne as jest.Mock).mockResolvedValue(mockEmployee);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await loginEmployee(req, res, next);

    expect(Employee.findOne).toHaveBeenCalledWith({
      where: { email: req.body.email },
    });
    expect(bcrypt.compare).toHaveBeenCalledWith(
      req.body.password,
      mockEmployee.password
    );
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: 'Invalid email or password',
      })
    );
  });

  it('should handle errors during login', async () => {
    const mockError = new Error('Internal Server Error');
    (Employee.findOne as jest.Mock).mockRejectedValue(mockError);

    await loginEmployee(req, res, next);

    expect(Employee.findOne).toHaveBeenCalledWith({
      where: { email: req.body.email },
    });
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        message: 'Internal Server Error',
      })
    );
  });
});

describe('deleteEmployee', () => {
  it('should delete an employee successfully', async () => { });
  it('should handle deletion when employee not found', async () => { });
  it('should handle errors during deletion', async () => { });
})
