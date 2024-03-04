'use strict';
import { Model } from 'sequelize';

interface VehicleAttributes {
  vehicleId: number;
  licencePlate: string;
  model: string;
  location: string;
  status: 'operational' | 'inactive';
  capacity: number;
}

export default (sequelize: any, DataTypes: any) => {
  class Vehicle extends Model<VehicleAttributes>
    implements VehicleAttributes {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    vehicleId!: number;
    licencePlate!: string;
    model!: string;
    location!: string;
    status!: 'operational' | 'inactive';
    capacity!: number;
    static associate(models: any) {
      Vehicle.hasMany(models.Order);
    }
  }
  Vehicle.init({
    vehicleId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    licencePlate: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "Licence plate cannot be empty" },
        is: {
          args: /^[A-Z]{3}-\d{3}$/i,
          msg: "License plate must be in format XXX-YYY (3 letters followed by 3 digits)",
        }
      },
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Model name cannot be empty" },
        len: { args: [2, 50], msg: "Model name must be between 2 and 50 characters" },
      },
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Location cannot be empty" },
      },
    },
    status: {
      type: DataTypes.ENUM('operational', 'inactive'),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Status cannot be empty" },
      },
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Capacity cannot be empty" },
        min: { args: [1], msg: "Capacity must be at least 1" },
      },
    },
  }, {
    sequelize,
    modelName: 'Vehicle',
  });
  return Vehicle;
};
