import { AggregateRoot } from "@shared/domain/AggregateRoot"
import type { UniqueEntityID } from "@shared/domain/UniqueEntityID"
import { Result } from "@shared/domain/Result"
import { EmployeeCreatedEvent } from "./events/EmployeeCreatedEvent"
import type { PhoneNumber } from "./PhoneNumber"

interface EmployeeProps {
  firstName: string
  lastName: string
  phoneNumber: PhoneNumber
  userId: UniqueEntityID
  createdAt: Date
  updatedAt: Date
}

export class Employee extends AggregateRoot<EmployeeProps> {
  private constructor(props: EmployeeProps, id?: UniqueEntityID) {
    super(props, id)
  }

  get firstName(): string {
    return this.props.firstName
  }

  get lastName(): string {
    return this.props.lastName
  }

  get phoneNumber(): PhoneNumber {
    return this.props.phoneNumber
  }

  get userId(): UniqueEntityID {
    return this.props.userId
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  get fullName(): string {
    return `${this.props.firstName} ${this.props.lastName}`
  }

  public updateFirstName(firstName: string): void {
    this.props.firstName = firstName
    this.props.updatedAt = new Date()
  }

  public updateLastName(lastName: string): void {
    this.props.lastName = lastName
    this.props.updatedAt = new Date()
  }

  public updatePhoneNumber(phoneNumber: PhoneNumber): void {
    this.props.phoneNumber = phoneNumber
    this.props.updatedAt = new Date()
  }

  public static create(
    firstName: string,
    lastName: string,
    phoneNumber: PhoneNumber,
    userId: UniqueEntityID,
    id?: UniqueEntityID,
  ): Result<Employee> {
    if (!firstName || firstName.trim().length === 0) {
      return Result.fail<Employee>("El nombre es requerido")
    }

    if (!lastName || lastName.trim().length === 0) {
      return Result.fail<Employee>("El apellido es requerido")
    }

    if (!userId) {
      return Result.fail<Employee>("El ID de usuario es requerido")
    }

    const employee = new Employee(
      {
        firstName,
        lastName,
        phoneNumber,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      id,
    )

    const isNewEmployee = !id
    if (isNewEmployee) {
      employee.addDomainEvent(new EmployeeCreatedEvent(employee.id))
    }

    return Result.ok<Employee>(employee)
  }
}
