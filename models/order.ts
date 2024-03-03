'use strict';
import { Model } from 'sequelize';

interface OrderAttributes {
  orderId: string,
  origin: string,
  destination: string,
  distance: number,
  duration: number,
  date: Date,
  status: 'pending' | 'transit' | 'delivered';
}

export default (sequelize: any, DataTypes: any) => {
  class Order extends Model<OrderAttributes>
    implements OrderAttributes {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    orderId!: string;
    origin!: string;
    destination!: string;
    distance!: number;
    duration!: number;
    date!: Date;
    status!: 'pending' | 'transit' | 'delivered';
    static associate(models: any) {
      Order.belongsTo(models.Client, {
        foreignKey: 'clientId',
        as: 'client',
      });

      Order.belongsTo(models.Vehicle, {
        foreignKey: 'vehicleId',
        as: 'vehicle',
      });

      Order.belongsTo(models.Driver, {
        foreignKey: 'employeeId',
        as: 'employee',
      });

      Order.belongsTo(models.Shipment, {
        foreignKey: 'shipmentId',
        as: 'shipment',
      });
    }
  }
  Order.init({
    orderId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    origin: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Origin cannot be empty" },
      }
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Destination cannot be empty" },
      }
    },
    distance: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: { args: [0], msg: "Distance must be greater than or equal to zero" },
      }
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: { args: [0], msg: "Duration must be greater than or equal to zero" },
      }
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: { args: false, msg: "Date must be a valid date" },
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'transit', 'delivered'),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Status cannot be empty" },
      }
    }
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};
