'use strict';
import { Model } from 'sequelize';

interface ShipmentAttributes {
  shipmentId: number;
  description: string;
  weight: number;
  status: 'pending' | 'transit' | 'delivered';
}

export default (sequelize: any, DataTypes: any) => {
  class Shipment extends Model<ShipmentAttributes> implements ShipmentAttributes {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    shipmentId!: number;
    description!: string;
    weight!: number;
    status!: 'pending' | 'transit' | 'delivered';
    static associate(models: any) {
      Shipment.hasMany(models.Order);
      Shipment.belongsTo(models.Client, { as: 'sender', foreignKey: 'senderId' });
      Shipment.belongsTo(models.Client, { as: 'receiver', foreignKey: 'receiverId' });
    }
  }
  Shipment.init({
    shipmentId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Description cannot be empty" },
        len: { args: [10, 500], msg: "Description should be at least 10 and up to 500 characters long." }
      }
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Weight cannot be empty" },
        min: { args: [0.1], msg: "Weight should be greater than or equal to 0.1 kg" },
        max: { args: [999.9], msg: "Weight should be less than or equal to 999.9 kg" },
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'transit', 'delivered'),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Status cannot be empty" },
      }
    },
  }, {
    sequelize,
    modelName: 'Shipment',
  });
  return Shipment;
};
