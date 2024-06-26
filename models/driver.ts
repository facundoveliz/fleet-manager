import { DataTypes } from 'sequelize';
import { Column, HasMany, Model, Table } from 'sequelize-typescript';
import Order from './order';

@Table
export default class Driver extends Model {
  @Column({
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  driverId: number;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'First name cannot be empty' },
      len: { args: [3, 25], msg: 'First name must be 3-25 characters' },
    },
  })
  firstName: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Last name cannot be empty' },
      len: { args: [3, 25], msg: 'Last name must be 3-25 characters' },
    },
  })
  lastName: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: 'Email cannot be empty' },
      isEmail: { msg: 'Invalid email format' },
    },
  })
  email: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Phone cannot be empty' },
      is: {
        args: /^\+?\d{1,3}[-.\s]?\d{2,3}[-.\s]?\d{3,4}[-.\s]?\d{4,9}$/,
        msg: 'Invalid phone number format',
      },
    },
  })
  phone: string;

  @HasMany(() => Order)
  ordersId: Order[];
}
