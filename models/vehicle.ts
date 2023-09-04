import { sequelize } from '../config/database'
import { DataTypes, Model } from 'sequelize'
import Employee from './employee'

class Vehicle extends Model { }

Vehicle.init(
  {
    licencePlate: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    status: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['operational', 'inactive']
    }
  },
  {
    sequelize,
    modelName: 'Vehicle'
  }
)

Vehicle.belongsTo(Employee)

export default Vehicle
