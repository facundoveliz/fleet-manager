import dotenv from 'dotenv';
import { Sequelize } from 'sequelize-typescript';
import Client from '../../models/client';
import Driver from '../../models/driver';
import Order from '../../models/order';
import Vehicle from '../../models/vehicle';
dotenv.config();

const createSequelizeInstance = (): Sequelize => {
  return new Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    dialect: 'sqlite',
    storage: 'fleet-manager-tests.sqlite',
    models: [Client, Driver, Order, Vehicle],
  });
};

export default createSequelizeInstance;
