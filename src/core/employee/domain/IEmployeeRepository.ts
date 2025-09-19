import type { Employee } from "./Employee"
import type { UniqueEntityID } from "@shared/domain/UniqueEntityID"

export interface IEmployeeRepository {
  findById(id: number | string): Promise<Employee | null>
  findByUserId(userId: UniqueEntityID): Promise<Employee | null>
  save(employee: Employee): Promise<void>
  findAll(): Promise<Employee[]>
  exists(id: number | string): Promise<boolean>
  delete(id: number | string): Promise<void>
}   