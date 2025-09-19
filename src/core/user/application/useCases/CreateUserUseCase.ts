import { User } from "../../domain/User"
import { UserEmail } from "../../domain/UserEmail"
import { UserPassword } from "../../domain/UserPassword"
import type { IUserRepository } from "../../domain/IUserRepository"
import { Result } from "@shared/domain/Result"
import { CreateUserDTO } from "@user/dtos/CreateUserDto"

export class CreateUserUseCase {
  private userRepository: IUserRepository

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository
  }

  // ✅ CAMBIAR: Retorna Result<User> en lugar de Result<void>
  async execute(request: CreateUserDTO): Promise<Result<User>> {
    const emailOrError = UserEmail.create(request.email)
    const passwordOrError = UserPassword.create(request.password)

    if (emailOrError.isFailure) {
      return Result.fail<User>(emailOrError.getError())
    }

    if (passwordOrError.isFailure) {
      return Result.fail<User>(passwordOrError.getError())
    }

    const email = emailOrError.getValue()
    const password = passwordOrError.getValue()

    // Verificar si el usuario ya existe
    const userExists = await this.userRepository.exists(email)
    if (userExists) {
      return Result.fail<User>("El usuario con este email ya existe")
    }

    // Hashear la contraseña
    const hashedPassword = await UserPassword.hashPassword(password.value)
    const hashedPasswordOrError = UserPassword.create(hashedPassword, true)

    if (hashedPasswordOrError.isFailure) {
      return Result.fail<User>(hashedPasswordOrError.getError())
    }

    // Crear el usuario
    const userOrError = User.create(email, hashedPasswordOrError.getValue())

    if (userOrError.isFailure) {
      return Result.fail<User>(userOrError.getError())
    }

    const user = userOrError.getValue()

    // Guardar el usuario
    const savedUser = await this.userRepository.save(user)

    // ✅ CAMBIAR: Retornar el usuario creado en lugar de void
    return Result.ok<User>(user)
  }
}