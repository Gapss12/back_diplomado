import type { Request, Response } from "express"
import { CreateUserUseCase } from "../../core/user/application/useCases/CreateUserUseCase"
import { GetUserByIdUseCase } from "@user/useCases/GetUserByIdUseCase"
import { GetAllUsersUseCase } from "@user/useCases/GetAllUsersUseCase"
import { UpdateUserUseCase } from "@user/useCases/UpdateUserUseCase"
import { DeleteUserUseCase } from "@user/useCases/DeleteUserUserCase"
import { UserRepository } from "../../infrastructure/persistence/repositories/UserRepository"

const userRepository = new UserRepository()

export const userController = {
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body

      const createUserUseCase = new CreateUserUseCase(userRepository)
      const result = await createUserUseCase.execute({ email, password })

      if (result.isFailure) {
        res.status(400).json({
          success: false,
          message: result.getError(),
        })
        return
      }

      res.status(201).json({
        success: true,
        message: "Usuario creado exitosamente",
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al crear usuario",
        error: error,
      })
    }
  },

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params

      const getUserByIdUseCase = new GetUserByIdUseCase(userRepository)
      const result = await getUserByIdUseCase.execute(id)

      if (result.isFailure) {
        res.status(404).json({
          success: false,
          message: result.getError(),
        })
        return
      }

      const user = result.getValue()

      res.status(200).json({
        success: true,
        data: {
          id: user.id.toValue(),
          email: user.email.value,
        },
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener usuario",
        error: error,
      })
    }
  },

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const getAllUsersUseCase = new GetAllUsersUseCase(userRepository)
      const result = await getAllUsersUseCase.execute()

      if (result.isFailure) {
        res.status(400).json({
          success: false,
          message: result.getError(),
        })
        return
      }

      const users = result.getValue()

      res.status(200).json({
        success: true,
        data: users.map((user) => ({
          id: user.id.toValue(),
          email: user.email.value,
        })),
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener usuarios",
        error: error,
      })
    }
  },

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const { email } = req.body

      const updateUserUseCase = new UpdateUserUseCase(userRepository)
      const result = await updateUserUseCase.execute({ id, email })

      if (result.isFailure) {
        res.status(400).json({
          success: false,
          message: result.getError(),
        })
        return
      }

      res.status(200).json({
        success: true,
        message: "Usuario actualizado exitosamente",
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al actualizar usuario",
        error: error,
      })
    }
  },

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params

      const deleteUserUseCase = new DeleteUserUseCase(userRepository)
      const result = await deleteUserUseCase.execute(id)

      if (result.isFailure) {
        res.status(400).json({
          success: false,
          message: result.getError(),
        })
        return
      }

      res.status(200).json({
        success: true,
        message: "Usuario eliminado exitosamente",
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al eliminar usuario",
        error: error,
      })
    }
  },
}
