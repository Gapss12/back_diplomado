import { DomainEvent } from "@shared/domain/DomainEvent"
import type { UniqueEntityID } from "@shared/domain/UniqueEntityID"

export class EmployeeCreatedEvent extends DomainEvent {
  constructor(aggregateId: UniqueEntityID) {
    super(aggregateId)
  }

  eventName(): string {
    return "employee.created"
  }
}
