import type { Request, Response } from "express"
import { LoginUseCase } from "../../core/auth/application/useCases/LoginUseCase"
import { UserRepository } from "../../infrastructure/persistence/repositories/UserRepository"
import { JwtService } from "../../infrastructure/services/JwtService"

const userRepository = new UserRepository()
const jwtService = new JwtService()

export const authController = {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body

      const loginUseCase = new LoginUseCase(userRepository, jwtService)
      const result = await loginUseCase.execute({ email, password })

      if (result.isFailure) {
        res.status(401).json({
          success: false,
          message: result.getError(),
        })
        return
      }

      const { token, userId } = result.getValue()

      res.status(200).json({
        success: true,
        data: {
          token,
          userId,
        },
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error en el login",
        error: error,
      })
    }
  },
}
