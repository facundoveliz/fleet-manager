import { Table, Column, Model, HasMany } from 'sequelize-typescript'
import Order from './order'
import { DataTypes } from 'sequelize'

@Table
export default class Client extends Model<Client> {
  @Column({
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  })
    clientId: number

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: 'Company name cannot be empty' },
      len: {
        args: [3, 255],
        msg: 'Company name must be between 3 and 255 characters'
      }
    }
  })
    company: string

  @Column({
    type: DataTypes.STRING,
    field: 'name',
    allowNull: false,
    validate: {
      notEmpty: { msg: 'First name cannot be empty' },
      len: {
        args: [3, 25],
        msg: 'First name must be between 3 and 25 characters'
      }
    }
  })
    firstName: string

  @Column({
    type: DataTypes.STRING,
    field: 'name',
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Last name cannot be empty' },
      len: {
        args: [3, 25],
        msg: 'Last name must be between 3 and 25 characters'
      }
    }
  })
    lastName: string

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

  @HasMany(() => Order)
    ordersId: Order[]
}
