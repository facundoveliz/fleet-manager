'use strict';
import { Model } from 'sequelize';

interface VehicleAttributes {
  licencePlate: string,
  model: string,
  location: string
  status: 'operational' | 'inactive';
}

export default (sequelize: any, DataTypes: any) => {
  class Vehicle extends Model<VehicleAttributes>
    implements VehicleAttributes {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    licencePlate!: string;
    model!: string;
    location!: string
    status!: 'operational' | 'inactive';
    static associate(models: any) {
      // Inverse association of Vehicle to Employee
      // A vehicle belongs to an employee identified by its license plate.
      Vehicle.belongsTo(models.Employee, { foreignKey: 'licencePlate' })

      // 1-to-many relationship between Vehicle and Delivery
      // A vehicle can have multiple deliveries associated with it.
      Vehicle.hasMany(models.Delivery, {
        foreignKey: {
          name: 'licencePlate',
          allowNull: false
        }
      })
    }
  }
  Vehicle.init({
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
  }, {
    sequelize,
    modelName: 'Vehicle',
  });
  return Vehicle;
};
