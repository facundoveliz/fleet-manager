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
    static associate(models: any) { }
  }
  Vehicle.init({
    licencePlate: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Licence plate cannot be empty" },
        is: /^[A-Z]{3}-\d{3}$/i,
        msg: "License plate must be in format XXX-YYY (3 letters followed by 3 digits)"
      }
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Model name cannot be empty" },
        len: { args: [2, 50], msg: "Model name must be between 2 and 50 characters" }
      }
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Location cannot be empty" },
      }
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Role cannot be empty" },
        isIn: {
          args: [['operational', 'inactive']],
          msg: "Role must be either 'operational' or 'inactive'"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Vehicle',
  });
  return Vehicle;
};
