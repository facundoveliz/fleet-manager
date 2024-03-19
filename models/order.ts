import { DataTypes } from 'sequelize';
import { BelongsTo, Column, Table, Model, ForeignKey } from 'sequelize-typescript';
import Driver from './driver';
import Client from './client';
import Vehicle from './vehicle';

@Table
export default class Order extends Model<Order> {
  @Column({
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  })
  orderId: number;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Origin cannot be empty' },
    },
  })
  origin: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Destination cannot be empty' },
    },
  })
  destination: string;

  @Column({
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: {
        args: [0],
        msg: 'Distance must be greater than or equal to zero',
      },
    },
  })
  distance: number;

  @Column({
    type: DataTypes.ENUM('pending', 'transit', 'delivered'),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Status cannot be empty' },
    },
  })
  status: 'pending' | 'transit' | 'delivered';

  @Column({
    type: DataTypes.DATE,
    allowNull: true,
    validate: {
      isDate: { args: false, msg: 'Date must be a valid date' },
    },
  })
  deliveredAt: Date;

  @Column({
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Description cannot be empty' },
      len: {
        args: [3, 500],
        msg: 'Description should be at least 3 and up to 500 characters long.',
      },
    },
  })
  description: string;

  @Column({
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Weight cannot be empty' },
      min: {
        args: [0.1],
        msg: 'Weight should be greater than or equal to 0.1 kg',
      },
      max: {
        args: [1999.9],
        msg: 'Weight should be less than or equal to 1999.9 kg',
      },
    },
  })
  weight: number;

  @ForeignKey(() => Client)
  @Column
  senderId: number;

  @ForeignKey(() => Client)
  @Column
  receiverId: number;

  @ForeignKey(() => Vehicle)
  @Column
  vehicleId: number;

  @ForeignKey(() => Driver)
  @Column
  driverId: number;

  @BelongsTo(() => Client, { foreignKey: 'senderId' })
  sender: Client;

  @BelongsTo(() => Client, { foreignKey: 'receiverId' })
  receiver: Client;

  @BelongsTo(() => Vehicle, { foreignKey: 'vehicleId' })
  vehicle: Vehicle;

  @BelongsTo(() => Driver, { foreignKey: 'driverId' })
  driver: Driver;
}
