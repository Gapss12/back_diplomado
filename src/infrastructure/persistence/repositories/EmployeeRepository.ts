import type { IEmployeeRepository } from "../../../core/employee/domain/IEmployeeRepository"
import { Employee } from "../../../core/employee/domain/Employee"
import { PhoneNumber } from "../../../core/employee/domain/PhoneNumber"
import { EmployeeModel } from "../models/EmployeeModel"
import { UniqueEntityID } from "@shared/domain/UniqueEntityID"
import { UserModel } from "../models/UserModel"

export class EmployeeRepository implements IEmployeeRepository { 
  async findById(id: number | string): Promise<Employee | null> {
    const employeeRecord = await EmployeeModel.findByPk(id)
    if (!employeeRecord) return null

    return this.toDomain(employeeRecord)
  }

  async findByUserId(userId: UniqueEntityID): Promise<Employee | null> {
    const employeeRecord = await EmployeeModel.findOne({
      where: { userId: userId.toValue() },
    })

    if (!employeeRecord) return null

    return this.toDomain(employeeRecord)
  }

  async save(employee: Employee): Promise<void> {
    const exists = await this.exists(employee.id.toValue())

    const employeeData = {
      firstName: employee.firstName,
      lastName: employee.lastName,
      phoneNumber: employee.phoneNumber.value,
      userId: Number(employee.userId.toValue()),
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
    }

    if (exists) {
      await EmployeeModel.update(employeeData, {
        where: { id: employee.id.toValue() },
      })
    } else {
      await EmployeeModel.create(employeeData as any)
    }
  }

  async findAll(): Promise<Employee[]> {
  const employeeRecords = await EmployeeModel.findAll({
    include: [
      {
        model: UserModel,
        attributes: ['id', 'email']
      }
    ]
  })
  return Promise.all(employeeRecords.map((record) => this.toDomain(record)))
}

  async exists(id: number | string): Promise<boolean> {
    const count = await EmployeeModel.count({
      where: { id },
    })
    return count > 0
  }

  private async toDomain(employeeRecord: EmployeeModel): Promise<Employee> {
    const phoneNumberOrError = PhoneNumber.create(employeeRecord.phoneNumber)

    if (phoneNumberOrError.isFailure) {
      throw new Error("Error al mapear empleado desde la base de datos")
    }

    const employeeOrError = Employee.create(
      employeeRecord.firstName,
      employeeRecord.lastName,
      phoneNumberOrError.getValue(),
      new UniqueEntityID(employeeRecord.userId),
      new UniqueEntityID(employeeRecord.id),
    )

    if (employeeOrError.isFailure) {
      throw new Error("Error al crear entidad de empleado")
    }
    const employee: Employee = employeeOrError.getValue();
    (employee as any).userEmail = employeeRecord.UserModel?.email
    return employee
  }

// En EmployeeRepository.ts
async delete(id: number | string): Promise<void> {
  await EmployeeModel.destroy({
    where: { id }
  })
}
}
