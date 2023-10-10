import { sequelize } from '../config/database'
import { DataTypes } from 'sequelize'
import Employee from './employee'

const Vehicle = sequelize.define('Vehicle', {
  licencePlate: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false
  },
  status: {
    type: DataTypes.ENUM,
    allowNull: false,
    values: ['operational', 'inactive']
  }
})

export default Vehicle
