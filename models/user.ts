import { sequelize } from '../config/database'
import { DataTypes, Model } from 'sequelize'

class User extends Model { }

User.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
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
    role: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['admin', 'driver']
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'User'
  }
)

export default User
