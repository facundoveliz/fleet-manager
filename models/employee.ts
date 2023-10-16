import { sequelize } from '../config/database'
import { DataTypes } from 'sequelize'
import Vehicle from './vehicle'
import Delivery from './delivery'

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
    unique: true,
    validate: {
      isEmail: true
    }
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
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['manager', 'driver']]
    }
  }
})

// NOTE: remove all this after doing the migrations,
// these won't work by themselves without them.
// source: https://stackoverflow.com/questions/66290930/sequelize-defining-associations
// FIX: check what 'foreignKey' to remove from here

Employee.hasOne(Vehicle, { foreignKey: 'employeeId' })
Employee.hasMany(Delivery, { foreignKey: 'employeeId' })

Vehicle.belongsTo(Employee, { foreignKey: 'employeeId' })
Vehicle.hasMany(Delivery, { foreignKey: 'vehicleId' })

Delivery.belongsTo(Employee, { foreignKey: 'employeeId' })
Delivery.belongsTo(Vehicle, { foreignKey: 'vehicleId' })

export default Employee
