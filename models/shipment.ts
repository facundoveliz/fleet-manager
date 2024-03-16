import { DataTypes } from 'sequelize'
import { Table, Column, Model, HasMany, BelongsTo } from 'sequelize-typescript'
import Order from './order'
import Client from './client'

@Table
export default class Shipment extends Model<Shipment> {
  @Column({
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
    shipmentId: number

  @Column({
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Description cannot be empty' },
      len: {
        args: [10, 500],
        msg: 'Description should be at least 10 and up to 500 characters long.'
      }
    }
  })
    description: string

  @Column({
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Weight cannot be empty' },
      min: {
        args: [0.1],
        msg: 'Weight should be greater than or equal to 0.1 kg'
      },
      max: {
        args: [999.9],
        msg: 'Weight should be less than or equal to 999.9 kg'
      }
    }
  })
    weight: number

  @Column({
    type: DataTypes.ENUM('pending', 'transit', 'delivered'),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Description cannot be empty' },
      len: {
        args: [10, 500],
        msg: 'Description should be at least 10 and up to 500 characters long.'
      }
    }
  })
    status: 'pending' | 'transit' | 'delivered'

  @HasMany(() => Order)
    ordersId: Order[]

  @BelongsTo(() => Client, { foreignKey: 'senderId' })
    senderId: Client[]

  @BelongsTo(() => Client, { foreignKey: 'receiverId' })
    receiverId: Client[]
}
