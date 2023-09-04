import { sequelize } from '../config/database'
import { DataTypes } from 'sequelize'
import Vehicle from './vehicle'
import Route from './route'

const Employee = sequelize.define('Employee', {
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
    unique: true
  },
  password: {
    type: DataTypes.STRING(64),
    allowNull: false
  },
  contact: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM,
    allowNull: false,
    values: ['admin', 'driver']
  }
})

Employee.hasOne(Vehicle)
Employee.hasMany(Route)

export default Employee
