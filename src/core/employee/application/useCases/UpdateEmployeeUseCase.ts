import type { IEmployeeRepository } from "../../domain/IEmployeeRepository"
import { Result } from "@shared/domain/Result"
import { PhoneNumber } from "../../domain/PhoneNumber"
import { UpdateEmployeeDTO } from "../dtos/UpdateEmployeeDto"


export class UpdateEmployeeUseCase {
  private employeeRepository: IEmployeeRepository

  constructor(employeeRepository: IEmployeeRepository) {
    this.employeeRepository = employeeRepository
  }

  async execute(request: UpdateEmployeeDTO): Promise<Result<void>> {
    try {
      const employee = await this.employeeRepository.findById(request.id)
      if (!employee) {
        return Result.fail<void>("Empleado no encontrado")
      }

      if (request.firstName) {
        employee.updateFirstName(request.firstName)
      }

      if (request.lastName) {
        employee.updateLastName(request.lastName)
      }

      if (request.phoneNumber) {
        const phoneNumberOrError = PhoneNumber.create(request.phoneNumber)
        if (phoneNumberOrError.isFailure) {
          return Result.fail<void>(phoneNumberOrError.getError())
        }
        employee.updatePhoneNumber(phoneNumberOrError.getValue())
      }

      await this.employeeRepository.save(employee)
      return Result.ok<void>()
    } catch (error) {
      return Result.fail<void>(`Error al actualizar empleado: ${error}`)
    }
  }
}
