import { sequelize } from '../config/database'
import { DataTypes, Model } from 'sequelize'
import Vehicle from './vehicle'
import Route from './route'

class Employee extends Model { }

Employee.init(
  {
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
  },
  {
    sequelize,
    modelName: 'Employee'
  }
)

Employee.hasOne(Vehicle)
Employee.hasMany(Route)

export default Employee
