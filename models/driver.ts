import { DataTypes } from 'sequelize'
import { Column, HasMany, Model, Table } from 'sequelize-typescript'
import Order from './order'

@Table
export default class Driver extends Model {
  @Column({
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
    driverId: number

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'First name cannot be empty' },
      len: { args: [3, 25], msg: 'First name must be 3-25 characters' }
    }
  })
    firstName: string

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Last name cannot be empty' },
      len: { args: [3, 25], msg: 'Last name must be 3-25 characters' }
    }
  })
    lastName: string

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: 'Email cannot be empty' },
      isEmail: { msg: 'Invalid email format' }
    }
  })
    email: string

  @Column({
    type: DataTypes.STRING(64),
    allowNull: false,
    validate: {
      len: {
        args: [8, 64],
        msg: 'Password must be between 8 and 64 characters'
      },
      notEmpty: { msg: 'Password cannot be empty' }
    }
  })
    password: string

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Phone cannot be empty' },
      is: {
        args: /^(\+?\d{1,4}[-\s]?)?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/i,
        msg: 'Invalid phone number format'
      }
    }
  })
    phone: string

  @HasMany(() => Order)
    ordersId: Order[]
}
