import type { IUserRepository } from "../../domain/IUserRepository"
import { Result } from "@shared/domain/Result"

export class DeleteUserUseCase {
  private userRepository: IUserRepository

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository
  }

  async execute(id: string | number): Promise<Result<void >> {
    try {
      const user = await this.userRepository.findById(id)
      if (!user) {
        return Result.fail<void>("Usuario no encontrado")
      }

      await this.userRepository.delete(id)
      return Result.ok<void>()
    } catch (error) {
      return Result.fail<void>(`Error al eliminar usuario: ${error}`)
    }
  }
}