import { DataTypes, Model } from "sequelize"
import { sequelize } from "../database"

interface UserAttributes {
  id: number
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserAttributes extends Omit<UserAttributes, 'id'> {}

export class UserModel extends Model<UserAttributes> implements UserAttributes {
  public id!: number
  public email!: string
  public password!: string
  public createdAt!: Date
  public updatedAt!: Date
}

UserModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
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
    tableName: "users",
    timestamps: true,
  },
)
