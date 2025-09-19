import { DataTypes, Model } from "sequelize"
import { sequelize } from "../database"
import { EmployeeModel } from "./EmployeeModel"
import { ProductModel } from "./ProductModel"

interface SaleAttributes {
  id: number
  employeeId: number
  productId: number
  customerName: string
  saleDate: Date
  createdAt: Date
  updatedAt: Date
}

export class SaleModel extends Model<SaleAttributes> implements SaleAttributes {
  public id!: number
  public employeeId!: number
  public productId!: number
  public customerName!: string
  public saleDate!: Date
  public createdAt!: Date
  public updatedAt!: Date
}

SaleModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: EmployeeModel,
        key: "id",
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ProductModel,
        key: "id",
      },
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    saleDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "sales",
    timestamps: true,
  },
)

SaleModel.belongsTo(EmployeeModel, { foreignKey: "employeeId" })
SaleModel.belongsTo(ProductModel, { foreignKey: "productId" })
