import { sequelize } from '../config/database'
import { DataTypes } from 'sequelize'
import Vehicle from './vehicle'

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
    type: DataTypes.ENUM,
    allowNull: false,
    // FIX: this
    values: ['manager', 'driver']
  },
  VehicleId: {
    type: DataTypes.STRING,
    defaultValue: null,
    references: {
      model: Vehicle,
      key: 'licencePlate'
    }
  }
})

Employee.hasOne(Vehicle)
Vehicle.belongsTo(Employee)

export default Employee
