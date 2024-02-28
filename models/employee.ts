'use strict';
import { Model } from 'sequelize';

interface EmployeeAttributes {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  phone: string,
  role: string,
}

export default (sequelize: any, DataTypes: any) => {
  class Employee extends Model<EmployeeAttributes>
    implements EmployeeAttributes {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    firstName!: string;
    lastName!: string;
    email!: string;
    password!: string;
    phone!: string;
    role!: string;
    static associate(models: any) {
      // 1-to-many relationship between Employee and Delivery
      // An employee can have multiple deliveries associated with them.
      Employee.hasMany(models.Delivery, {
        foreignKey: {
          name: 'employeeId',
          allowNull: false
        }
      })

      // 1-to-1 relationship between Employee and Vehicle
      // An employee can have one vehicle associated with them.
      Employee.hasOne(models.Vehicle, {
        foreignKey: 'employeeId'
      })
    }
  }
  Employee.init({
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
    password: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^(\+?\d{1,4}[-\s]?)?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/i
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['manager', 'driver']]
      }
    }

  }, {
    sequelize,
    modelName: 'Employee',
  });
  return Employee;
};
