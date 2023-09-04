import { sequelize } from '../config/database'
import { DataTypes } from 'sequelize'
import Employee from './employee'

const Route = sequelize.define('Route', {
  wayPoint: {
    type: DataTypes.STRING,
    allowNull: false
  },
  distance: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM,
    allowNull: false,
    values: ['waiting', 'ongoing', 'completed']
  }
})

Route.hasOne(Employee)

export default Route
