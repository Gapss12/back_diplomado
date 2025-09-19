import type { IUserRepository } from "../../domain/IUserRepository"
import { Result } from "@shared/domain/Result"
import type { User } from "../../domain/User"

export class GetAllUsersUseCase {
  private userRepository: IUserRepository

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository
  }

  async execute(): Promise<Result<User[]>> {
    try {
      const users = await this.userRepository.findAll()
      return Result.ok<User[]>(users)
    } catch (error) {
      return Result.fail<User[]>(`Error al obtener usuarios: ${error}`)
    }
  }
}