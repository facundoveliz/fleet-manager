import { sequelize } from '../config/database'
import { DataTypes } from 'sequelize'

const Route = sequelize.define('Route', {
  wayPoints: {
    type: DataTypes.JSON,
    allowNull: false
  },
  distance: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['waiting', 'ongoing', 'completed']]
    }
  }
})

export default Route
