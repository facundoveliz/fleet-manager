'use strict'
import { Model } from 'sequelize'

interface DriverAttributes {
  driverId: number
  firstName: string
  lastName: string
  email: string
  password: string
  phone: string
}

export default (sequelize: any, DataTypes: any) => {
  class Driver extends Model<DriverAttributes> implements DriverAttributes {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    driverId!: number
    firstName!: string
    lastName!: string
    email!: string
    password!: string
    phone!: string
    static associate (models: any) {
      Driver.hasMany(models.Order)
    }
  }
  Driver.init(
    {
      driverId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'First name cannot be empty' },
          len: { args: [3, 25], msg: 'First name must be 3-25 characters' }
        }
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Last name cannot be empty' },
          len: { args: [3, 25], msg: 'Last name must be 3-25 characters' }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: { msg: 'Email cannot be empty' },
          isEmail: { msg: 'Invalid email format' }
        }
      },
      password: {
        type: DataTypes.STRING(64),
        allowNull: false,
        validate: {
          len: {
            args: [8, 64],
            msg: 'Password must be between 8 and 64 characters'
          },
          notEmpty: { msg: 'Password cannot be empty' }
        }
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Phone cannot be empty' },
          is: {
            args: /^(\+?\d{1,4}[-\s]?)?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/i,
            msg: 'Invalid phone number format'
          }
        }
      }
    },
    {
      sequelize,
      modelName: 'Driver'
    }
  )
  return Driver
}
