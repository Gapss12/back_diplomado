import { Employee } from "../../domain/Employee"
import { PhoneNumber } from "../../domain/PhoneNumber"
import type { IEmployeeRepository } from "../../domain/IEmployeeRepository"
import { Result } from "@shared/domain/Result"
import { UniqueEntityID } from "@shared/domain/UniqueEntityID"
import type { IUserRepository } from "../../../user/domain/IUserRepository"
import { CreateEmployeeDTO } from "../dtos/CreateEmployeeDto"


export class CreateEmployeeUseCase {
  private employeeRepository: IEmployeeRepository
  private userRepository: IUserRepository

  constructor(employeeRepository: IEmployeeRepository, userRepository: IUserRepository) {
    this.employeeRepository = employeeRepository
    this.userRepository = userRepository
  }

  async execute(request: CreateEmployeeDTO, skipUserValidation = false): Promise<Result<void>> {
    const phoneNumberOrError = PhoneNumber.create(request.phoneNumber)

    if (phoneNumberOrError.isFailure) {
      return Result.fail<void>(phoneNumberOrError.getError())
    }

    const phoneNumber = phoneNumberOrError.getValue()
    const userId = new UniqueEntityID(request.userId)

    // Verificar si el usuario existe SOLO si no se omite la validación
    if (!skipUserValidation) {
      const user = await this.userRepository.findById(request.userId)
      if (!user) {
        return Result.fail<void>("El usuario no existe")
      }
    }

    // Verificar si ya existe un empleado con este userId
    const existingEmployee = await this.employeeRepository.findByUserId(userId)
    if (existingEmployee) {
      return Result.fail<void>("Ya existe un empleado asociado a este usuario")
    }

    // Crear el empleado
    const employeeOrError = Employee.create(request.firstName, request.lastName, phoneNumber, userId)

    if (employeeOrError.isFailure) {
      return Result.fail<void>(employeeOrError.getError())
    }

    const employee = employeeOrError.getValue()

    // Guardar el empleado
    await this.employeeRepository.save(employee)

    return Result.ok<void>()
  }
}