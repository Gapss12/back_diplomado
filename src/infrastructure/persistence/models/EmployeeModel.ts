import { DataTypes, Model } from "sequelize"
import { sequelize } from "../database"
import { UserModel } from "./UserModel"

interface EmployeeAttributes {
  id: number
  firstName: string
  lastName: string
  phoneNumber: number
  userId: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateEmployeeAttributes extends Omit<EmployeeAttributes, 'id'> {}

export class EmployeeModel extends Model<EmployeeAttributes> implements EmployeeAttributes {
  public id!: number
  public firstName!: string
  public lastName!: string
  public phoneNumber!: number
  public userId!: number
  public createdAt!: Date
  public updatedAt!: Date
  UserModel: any
}

EmployeeModel.init(
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
    phoneNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserModel,
        key: "id",
      },
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
    tableName: "employees",
    timestamps: true,
  },
)

EmployeeModel.belongsTo(UserModel, { foreignKey: "userId" })
