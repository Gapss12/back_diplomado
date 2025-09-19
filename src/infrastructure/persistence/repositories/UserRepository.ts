import type { IUserRepository } from "../../../core/user/domain/IUserRepository"
import { User } from "../../../core/user/domain/User"
import { UserEmail } from "../../../core/user/domain/UserEmail"
import { UserPassword } from "../../../core/user/domain/UserPassword"
import { UserModel } from "../models/UserModel"
import { UniqueEntityID } from "@shared/domain/UniqueEntityID"

export class UserRepository implements IUserRepository {
  async findById(id: number | string): Promise<User | null> {
    const userRecord = await UserModel.findByPk(id)
    if (!userRecord) return null

    return this.toDomain(userRecord)
  }

// En UserRepository
async findByEmail(email: UserEmail): Promise<User | null> {
  const userRecord = await UserModel.findOne({
    where: { email: email.value }
  })
  
  if (!userRecord) return null
  
  return this.toDomain(userRecord)
}
  async save(user: User): Promise<void> {
    const exists = await this.exists(user.email)

    const userData = {
      email: user.email.value,
      password: user.password.value,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

    if (exists) {
      const existingUser = await this.findByEmail(user.email)
      if (!existingUser) {
        throw new Error("Usuario no encontrado para actualizar")
      }
      await UserModel.update(userData, {
        where: { id: user.id.toValue() },
      })
    } else {
      await UserModel.create(userData as any)
    }
  }

  async findAll(): Promise<User[]> {
    const userRecords = await UserModel.findAll()
    return Promise.all(userRecords.map((record) => this.toDomain(record)))
  }

  async delete(id: number | string): Promise<void> {
    await UserModel.destroy({
      where: { id },
    })
  }

  async exists(email: UserEmail): Promise<boolean> {
    const count = await UserModel.count({
      where: { email: email.value },
    })
    return count > 0
  }

  private async toDomain(userRecord: UserModel): Promise<User> {
    const emailOrError = UserEmail.create(userRecord.email)
    const passwordOrError = UserPassword.create(userRecord.password, true)

    if (emailOrError.isFailure || passwordOrError.isFailure) {
      throw new Error("Error al mapear usuario desde la base de datos")
    }

    const userOrError = User.create(
      emailOrError.getValue(),
      passwordOrError.getValue(),
      new UniqueEntityID(userRecord.id),
    )

    if (userOrError.isFailure) {
      throw new Error("Error al crear entidad de usuario")
    }

    return userOrError.getValue()
  }
}
