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
    static associate(models: any) {
      // 1-to-1 relationship between Delivery and Client
      // A delivery is associated with one client identified by its delivery ID.
      Delivery.hasOne(models.Client, { foreignKey: 'deliveryId' })

      // Inverse association of Delivery to Employee
      // A delivery is associated with an employee identified by their ID.
      Delivery.belongsTo(models.Vehicle, { foreignKey: 'licencePlate' })

      // Inverse association of Delivery to Vehicle
      // A delivery is associated with a vehicle identified by its license plate.
      Delivery.belongsTo(models.Employee, { foreignKey: 'employeeId' })
    }
  }
  Delivery.init({
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    wayPoints: {
      // NOTE: maybe change this to JSON, decide later
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['waiting', 'ongoing', 'completed']]
      }
    }
  }, {
    sequelize,
    modelName: 'Delivery',
  });
  return Delivery;
};
