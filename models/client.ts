'use strict';
import { Model } from 'sequelize';

interface ClientAttributes {
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  company: string,
}

export default (sequelize: any, DataTypes: any) => {
  class Client extends Model<ClientAttributes>
    implements ClientAttributes {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    firstName!: string;
    lastName!: string;
    email!: string;
    phone!: string;
    company!: string;
    static associate(models: any) {
      // 1-to-many relationship between Client and Delivery
      // A client can have multiple deliveries associated with them.
      Client.hasMany(models.Delivery, {
        foreignKey: {
          name: 'clientId',
          allowNull: false
        }
      })
    }
  }
  Client.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^(\+?\d{1,4}[-\s]?)?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/i
      }
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Client',
  });
  return Client;
};
