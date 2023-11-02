import { sequelize } from '../config/database'
import { DataTypes } from 'sequelize'

const Vehicle = sequelize.define('Vehicle', {
  licencePlate: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    validate: {
      is: /^[A-Z]{3}-\d{3}$/i
    }
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
