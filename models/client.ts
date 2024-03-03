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
    static associate(models: any) { }
  }
  Client.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "First name cannot be empty" },
        len: { args: [3, 25], msg: "First name must be between 3 and 25 characters" }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Last name cannot be empty" },
        len: { args: [3, 25], msg: "Last name must be between 3 and 25 characters" }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "Email cannot be empty" },
        isEmail: { msg: "Invalid email format" }
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Phone cannot be empty" },
        is: {
          args: /^(\+?\d{1,4}[-\s]?)?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/i,
          msg: "Invalid phone number format"
        }
      }
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "Company name cannot be empty" },
        len: { args: [3, 255], msg: "Company name must be between 3 and 255 characters" }
      }
    }
  }, {
    sequelize,
    modelName: 'Client',
  });
  return Client;
};
