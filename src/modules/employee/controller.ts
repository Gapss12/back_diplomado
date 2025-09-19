import type { Request, Response } from "express"
import { CreateEmployeeUseCase } from "../../core/employee/application/useCases/CreateEmployeeUseCase"
import { GetEmployeeByIdUseCase } from "../../core/employee/application/useCases/GetEmployeeByIdUseCase"
import { GetAllEmployeesUseCase } from "../../core/employee/application/useCases/GetAllEmployeesUseCase"
import { UpdateEmployeeUseCase } from "../../core/employee/application/useCases/UpdateEmployeeUseCase"
import { EmployeeRepository } from "../../infrastructure/persistence/repositories/EmployeeRepository"
import { UserRepository } from "../../infrastructure/persistence/repositories/UserRepository"
import { CreateUserUseCase } from "../../core/user/application/useCases/CreateUserUseCase"
import { DeleteEmployeeUseCase } from "../../core/employee/application/useCases/DeleteEmployeeUseCase"

const employeeRepository = new EmployeeRepository()
const userRepository = new UserRepository()

export const employeeController = {
async createEmployeeWithUser(req: Request, res: Response): Promise<void> {
  try {
    const { firstName, lastName, phoneNumber, email, password } = req.body
    const createUserUseCase = new CreateUserUseCase(userRepository)
    const userResult = await createUserUseCase.execute({ email, password })

    if (userResult.isFailure) {
      res.status(400).json({
        success: false,
        message: `Error al crear usuario: ${userResult.getError()}`,
      })
      return
    }

    const user = userResult.getValue()    
    const savedUser = await userRepository.findByEmail(user.email)
    if (!savedUser) {
      res.status(500).json({
        success: false,
        message: "Error: No se pudo obtener el usuario recién creado",
      })
      return
    }
    
    const realUserId = savedUser.id.toValue()
    console.log("✅ ID real del usuario:", realUserId)

    const createEmployeeUseCase = new CreateEmployeeUseCase(employeeRepository, userRepository)
    const employeeResult = await createEmployeeUseCase.execute({
      firstName,
      lastName,
      phoneNumber,
      userId: realUserId,
    }, true)

    if (employeeResult.isFailure) {
      res.status(400).json({
        success: false,
        message: `Error al crear empleado: ${employeeResult.getError()}`,
      })
      return
    }

    res.status(201).json({
      success: true,
      message: "Empleado y usuario creados exitosamente",
      data: {
        userId: realUserId,
        message: "Employee and user created successfully"
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear empleado con usuario",
      error: error,
    })
  }
},

async createEmployee(req: Request, res: Response): Promise<void> {
  try {
    console.log("🔍 Datos recibidos:", req.body)
    const { firstName, lastName, phoneNumber, userId, email, password } = req.body

    if (email && password) {
      console.log("🔍 Redirigiendo a createEmployeeWithUser...")
      return await employeeController.createEmployeeWithUser(req, res)
      
    }

    if (userId) {
      console.log("🔍 Creando empleado con userId existente:", userId)
      const createEmployeeUseCase = new CreateEmployeeUseCase(employeeRepository, userRepository)
      const result = await createEmployeeUseCase.execute({
        firstName,
        lastName,
        phoneNumber,
        userId,
      })

      if (result.isFailure) {
        console.log("❌ Error en UseCase:", result.getError())
        res.status(400).json({
          success: false,
          message: result.getError(),
        })
        return
      }

      res.status(201).json({
        success: true,
        message: "Empleado creado exitosamente",
      })
      return
    }

    console.log("❌ No se proporcionó userId ni email/password")
    res.status(400).json({
      success: false,
      message: "Debe proporcionar userId o email/password para crear el empleado",
    })

  } catch (error) {
    console.log("💥 Error en createEmployee:", error)
    res.status(500).json({
      success: false,
      message: "Error al crear empleado",
      error: error,
    })
  }
},

  async getEmployeeById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params

      const getEmployeeByIdUseCase = new GetEmployeeByIdUseCase(employeeRepository)
      const result = await getEmployeeByIdUseCase.execute(id)

      if (result.isFailure) {
        res.status(404).json({
          success: false,
          message: result.getError(),
        })
        return
      }

      const employee = result.getValue()

      res.status(200).json({
        success: true,
        data: {
          id: employee.id.toValue(),
          firstName: employee.firstName,
          lastName: employee.lastName,
          phoneNumber: employee.phoneNumber.value,
          userId: employee.userId.toValue(),
        },
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener empleado",
        error: error,
      })
    }
  },

  async getAllEmployees(req: Request, res: Response): Promise<void> {
    try {
      const getAllEmployeesUseCase = new GetAllEmployeesUseCase(employeeRepository)
      const result = await getAllEmployeesUseCase.execute()

      if (result.isFailure) {
        res.status(400).json({
          success: false,
          message: result.getError(),
        })
        return
      }

      const employees = result.getValue()
      res.status(200).json({
        success: true,
        data: employees.map((employee) => ({
          id: employee.id.toValue(),
          firstName: employee.firstName,
          lastName: employee.lastName,
          phoneNumber: employee.phoneNumber.value,
          userId: employee.userId.toValue(),
          email: (employee as any).userEmail
        })),
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener empleados",
        error: error,
      })
    }
  },

  async updateEmployee(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const { firstName, lastName, phoneNumber } = req.body

      const updateEmployeeUseCase = new UpdateEmployeeUseCase(employeeRepository)
      const result = await updateEmployeeUseCase.execute({
        id,
        firstName,
        lastName,
        phoneNumber,
      })

      if (result.isFailure) {
        res.status(400).json({
          success: false,
          message: result.getError(),
        })
        return
      }

      res.status(200).json({
        success: true,
        message: "Empleado actualizado exitosamente",
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al actualizar empleado",
        error: error,
      })
    }
  },

  async deleteEmployee(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params

      const deleteEmployeeUseCase = new DeleteEmployeeUseCase(employeeRepository)
      const result = await deleteEmployeeUseCase.execute(id)

      res.status(200).json({
        success: true,
        message: "Empleado eliminado exitosamente",
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al eliminar empleado",
        error: error,
      })
    }
  },
}