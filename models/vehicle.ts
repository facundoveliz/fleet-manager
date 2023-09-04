import { sequelize } from '../config/database'
import { DataTypes } from 'sequelize'
import Employee from './employee'

const Vehicle = sequelize.define('Vehicle', {
  licencePlate: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  status: {
    type: DataTypes.ENUM,
    allowNull: false,
    values: ['operational', 'inactive']
  }
})

Vehicle.belongsTo(Employee)

export default Vehicle
