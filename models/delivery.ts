import { sequelize } from '../config/database'
import { DataTypes } from 'sequelize'

const Delivery = sequelize.define('Delivery', {
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  wayPoints: {
    // NOTE: maybe change this to JSON, decide later
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

export default Delivery
