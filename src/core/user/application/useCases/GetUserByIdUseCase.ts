import type { IUserRepository } from "../../domain/IUserRepository"
import { Result } from "@shared/domain/Result"
import type { User } from "../../domain/User"

export class GetUserByIdUseCase {
  private userRepository: IUserRepository

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository
  }

  async execute(id: string | number): Promise<Result<User>> {
    try {
      const user = await this.userRepository.findById(id)
      if (!user) {
        return Result.fail<User>("Usuario no encontrado")
      }
      return Result.ok<User>(user)
    } catch (error) {
      return Result.fail<User>(`Error al buscar usuario: ${error}`)
    }
  }
}
