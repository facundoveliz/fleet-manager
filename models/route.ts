import { sequelize } from '../config/database'
import { DataTypes, Model } from 'sequelize'
import Employee from './employee'

class Route extends Model { }

Route.init(
  {
    wayPoint: {
      type: DataTypes.STRING,
      allowNull: false
    },
    distance: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['waiting', 'ongoing', 'completed']
    }
  },
  {
    sequelize,
    modelName: 'Route'
  }
)

Route.hasOne(Employee)

export default Route
