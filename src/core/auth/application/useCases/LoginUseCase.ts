import type { IUserRepository } from "../../../user/domain/IUserRepository"
import { Result } from "@shared/domain/Result"
import { UserEmail } from "../../../user/domain/UserEmail"
import type { IJwtService } from "../../domain/IJwtService"
import { LoginDTO } from "../dtos/LoginDto"
import { LoginResponse } from "../dtos/LoginResponseDto"

export class LoginUseCase {
  private userRepository: IUserRepository
  private jwtService: IJwtService

  constructor(userRepository: IUserRepository, jwtService: IJwtService) {
    this.userRepository = userRepository
    this.jwtService = jwtService
  }

  async execute(request: LoginDTO): Promise<Result<LoginResponse>> {
    const emailOrError = UserEmail.create(request.email)

    if (emailOrError.isFailure) {
      return Result.fail<LoginResponse>(emailOrError.getError())
    }

    try {
      const email = emailOrError.getValue()
      const user = await this.userRepository.findByEmail(email)

      if (!user) {
        return Result.fail<LoginResponse>("Credenciales inválidas")
      }

      const passwordValid = await user.password.comparePassword(request.password)

      if (!passwordValid) {
        return Result.fail<LoginResponse>("Credenciales inválidas")
      }

      const token = this.jwtService.generateToken({
        userId: user.id.toValue(),
        email: user.email.value,
      })

      return Result.ok<LoginResponse>({
        token,
        userId: user.id.toValue(),
      })
    } catch (error) {
      return Result.fail<LoginResponse>(`Error en el login: ${error}`)
    }
  }
}
