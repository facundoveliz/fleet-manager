import { sequelize } from '../config/database'
import { DataTypes } from 'sequelize'

const Client = sequelize.define('Client', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: /^(\+?\d{1,4}[-\s]?)?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/i
    }
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
})

export default Client
