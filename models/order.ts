import { DataTypes } from 'sequelize'
import { BelongsTo, Column, Table, Model, ForeignKey } from 'sequelize-typescript'
import Driver from './driver'
import Client from './client'
import Vehicle from './vehicle'
import Shipment from './shipment'

@Table
export default class Order extends Model<Order> {
  @Column({
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true
  })
    orderId: number

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Origin cannot be empty' }
    }
  })
    origin: string

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Destination cannot be empty' }
    }
  })
    destination: string

  @Column({
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: {
        args: [0],
        msg: 'Distance must be greater than or equal to zero'
      }
    }
  })
    distance: number

  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: {
        args: [0],
        msg: 'Duration must be greater than or equal to zero'
      }
    }
  })
    duration: number

  @Column({
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: { args: false, msg: 'Date must be a valid date' }
    }
  })
    date: Date

  @Column({
    type: DataTypes.ENUM('pending', 'transit', 'delivered'),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Status cannot be empty' }
    }
  })
    status: 'pending' | 'transit' | 'delivered'

  @ForeignKey(() => Client)
    clientId: number

  @ForeignKey(() => Vehicle)
    vehicleId: number

  @ForeignKey(() => Driver)
    driverId: number

  @ForeignKey(() => Shipment)
    shipmentId: number
}
