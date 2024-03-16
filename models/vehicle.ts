import { DataTypes } from 'sequelize';
import { Table, Column, Model, HasMany } from 'sequelize-typescript';
import Order from './order';

@Table
export default class Vehicle extends Model<Vehicle> {
  @Column({
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  })
  vehicleId: number;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: 'Licence plate cannot be empty' },
      is: {
        args: /^[A-Z]{3}-\d{3}$/i,
        msg: 'License plate must be in format XXX-YYY (3 letters followed by 3 digits)',
      },
    },
  })
  licencePlate: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Model name cannot be empty' },
      len: {
        args: [2, 50],
        msg: 'Model name must be between 2 and 50 characters',
      },
    },
  })
  model: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Location cannot be empty' },
    },
  })
  location: string;

  @Column({
    type: DataTypes.ENUM('operational', 'inactive'),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Status cannot be empty' },
    },
  })
  status: 'operational' | 'inactive';

  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Capacity cannot be empty' },
      min: { args: [1], msg: 'Capacity must be at least 1' },
    },
  })
  capacity: number;

  @HasMany(() => Order)
  ordersId: Order[];
}
