import type { IEmployeeRepository } from "../../domain/IEmployeeRepository"
import { Result } from "@shared/domain/Result"
import type { Employee } from "../../domain/Employee"

export class GetAllEmployeesUseCase {
  private employeeRepository: IEmployeeRepository

  constructor(employeeRepository: IEmployeeRepository) {
    this.employeeRepository = employeeRepository
  }

  async execute(): Promise<Result<Employee[]>> {
    try {
      const employees = await this.employeeRepository.findAll()
      return Result.ok<Employee[]>(employees)
    } catch (error) {
      return Result.fail<Employee[]>(`Error al obtener empleados: ${error}`)
    }
  }
}