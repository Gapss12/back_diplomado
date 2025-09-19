import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export interface EmployeeAttributes {
  id?: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  userId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Employee extends Model<EmployeeAttributes> implements EmployeeAttributes {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public phoneNumber!: string;
  public userId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Employee.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
        allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Employee',
    tableName: 'employees',
    paranoid: true,
  }
);
