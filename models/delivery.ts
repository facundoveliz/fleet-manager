'use strict';
import { Model } from 'sequelize';

interface DeliveryAttributes {
  description: string,
  wayPoints: string,
  status: 'waiting' | 'ongoing' | 'completed';
}

export default (sequelize: any, DataTypes: any) => {
  class Delivery extends Model<DeliveryAttributes>
    implements DeliveryAttributes {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    description!: string;
    wayPoints!: string;
    status!: 'waiting' | 'ongoing' | 'completed';
    static associate(models: any) { }
  }
  Delivery.init({
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Description cannot be empty" },
        len: { args: [5, 255], msg: "Description must be between 5 and 255 characters" }
      }
    },
    wayPoints: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Waypoints cannot be empty" },
      }
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Status cannot be empty" },
        isIn: {
          args: [['waiting', 'ongoing', 'completed']],
          msg: "Status must be either 'waiting', 'ongoing', or 'completed'"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Delivery',
  });
  return Delivery;
};
