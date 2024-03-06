'use strict'
import { Model } from 'sequelize'

interface ClientAttributes {
  clientId: number
  company: string
  firstName: string
  lastName: string
  phone: string
  email: string
}

export default (sequelize: any, DataTypes: any) => {
  class Client extends Model<ClientAttributes> implements ClientAttributes {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    clientId!: number
    company!: string
    firstName!: string
    lastName!: string
    phone!: string
    email!: string
    static associate(models: any) {
      Client.hasMany(models.Order)
    }
  }
  Client.init(
    {
      clientId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      company: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: { msg: 'Company name cannot be empty' },
          len: {
            args: [3, 255],
            msg: 'Company name must be between 3 and 255 characters',
          },
        },
      },
      firstName: {
        type: DataTypes.STRING,
        field: 'name',
        allowNull: false,
        validate: {
          notEmpty: { msg: 'First name cannot be empty' },
          len: {
            args: [3, 25],
            msg: 'First name must be between 3 and 25 characters',
          },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        field: 'name',
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Last name cannot be empty' },
          len: {
            args: [3, 25],
            msg: 'Last name must be between 3 and 25 characters',
          },
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Phone cannot be empty' },
          is: {
            args: /^(\+?\d{1,4}[-\s]?)?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/i,
            msg: 'Invalid phone number format',
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: { msg: 'Email cannot be empty' },
          isEmail: { msg: 'Invalid email format' },
        },
      },
    },
    {
      sequelize,
      modelName: 'Client',
    },
  )
  return Client
}
