import { sequelize } from '../config/database'
import { DataTypes } from 'sequelize'
import Vehicle from './vehicle'
import Delivery from './delivery'
import Client from './client'

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
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: /^(\+?\d{1,4}[-\s]?)?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/i
    }
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

Employee.hasOne(Vehicle, { foreignKey: 'employeeId' })
Employee.hasMany(Delivery, {
  foreignKey: {
    name: 'employeeId',
    allowNull: false
  }
})

Vehicle.belongsTo(Employee, { foreignKey: 'licencePlate' })
Vehicle.hasMany(Delivery, {
  foreignKey: {
    name: 'licencePlate',
    allowNull: false
  }
})

Delivery.hasOne(Client, { foreignKey: 'deliveryId' })
Client.hasMany(Delivery, {
  foreignKey: {
    name: 'clientId',
    allowNull: false
  }
})

Delivery.belongsTo(Vehicle, { foreignKey: 'licencePlate' })
Delivery.belongsTo(Employee, { foreignKey: 'employeeId' })

export default Employee
