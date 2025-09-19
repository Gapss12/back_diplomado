import type { IEmployeeRepository } from "../../domain/IEmployeeRepository"
import { Result } from "@shared/domain/Result"

export class DeleteEmployeeUseCase {
  private employeeRepository: IEmployeeRepository

  constructor(employeeRepository: IEmployeeRepository) {
    this.employeeRepository = employeeRepository
  }

  async execute(id: string | number): Promise<Result<void>> {
    try {
      const employee = await this.employeeRepository.findById(id)
      if (!employee) {
        return Result.fail<void>("El empleado no existe")
      }

      await this.employeeRepository.delete(id)
      
      return Result.ok<void>()
    } catch (error) {
      return Result.fail<void>(`Error al eliminar empleado: ${error}`)
    }
  }
}