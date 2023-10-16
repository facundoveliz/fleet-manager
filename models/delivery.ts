import { sequelize } from '../config/database'
import { DataTypes } from 'sequelize'

const Delivery = sequelize.define('Delivery', {
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  wayPoints: {
    type: DataTypes.JSON,
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
