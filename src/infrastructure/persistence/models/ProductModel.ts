import { DataTypes, Model } from "sequelize"
import { sequelize } from "../database"

interface ProductAttributes {
  id?: number
  name: string
  imageUrl: string
  price: number
  createdAt?: Date
  updatedAt?: Date
}

export class ProductModel extends Model<ProductAttributes> implements ProductAttributes {
  public id!: number
  public name!: string
  public imageUrl!: string
  public price!: number
  public createdAt!: Date
  public updatedAt!: Date
}

ProductModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
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
    tableName: "products",
    timestamps: true,
  },
)

