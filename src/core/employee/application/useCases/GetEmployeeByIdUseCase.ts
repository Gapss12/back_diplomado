import type { IEmployeeRepository } from "../../domain/IEmployeeRepository"
import { Result } from "@shared/domain/Result"
import type { Employee } from "../../domain/Employee"

export class GetEmployeeByIdUseCase {
  private employeeRepository: IEmployeeRepository

  constructor(employeeRepository: IEmployeeRepository) {
    this.employeeRepository = employeeRepository
  }

  async execute(id: string | number): Promise<Result<Employee>> {
    try {
      const employee = await this.employeeRepository.findById(id)
      if (!employee) {
        return Result.fail<Employee>("Empleado no encontrado")
      }
      return Result.ok<Employee>(employee)
    } catch (error) {
      return Result.fail<Employee>(`Error al buscar empleado: ${error}`)
    }
  }
}