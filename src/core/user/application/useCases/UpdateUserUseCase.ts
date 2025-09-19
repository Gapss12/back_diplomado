import type { IUserRepository } from "../../domain/IUserRepository"
import { Result } from "@shared/domain/Result"
import { UserEmail } from "../../domain/UserEmail"
import { UpdateUserDTO } from "../dtos/UpdateUserDto"

export class UpdateUserUseCase {
  private userRepository: IUserRepository

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository
  }

  async execute(request: UpdateUserDTO): Promise<Result<void>> {
    try {
      const user = await this.userRepository.findById(request.id)
      if (!user) {
        return Result.fail<void>("Usuario no encontrado")
      }

      if (request.email) {
        const emailOrError = UserEmail.create(request.email)
        if (emailOrError.isFailure) {
          return Result.fail<void>(emailOrError.getError())
        }
        user.updateEmail(emailOrError.getValue())
      }

      await this.userRepository.save(user)
      return Result.ok<void>()
    } catch (error) {
      return Result.fail<void>(`Error al actualizar usuario: ${error}`)
    }
  }
}
