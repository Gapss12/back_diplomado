import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export interface SaleAttributes {
  id?: number;
  employeId: number;
  productId: number;
  customerName: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Sale extends Model<SaleAttributes> implements SaleAttributes {
  public id!: number;
  public employeId!: number;
  public productId!: number;
  public customerName!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Sale.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    employeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Sale',
    tableName: 'sales',
  }
);
