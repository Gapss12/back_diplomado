import { DomainEvent } from "@shared/domain/DomainEvent"
import type { UniqueEntityID } from "@shared/domain/UniqueEntityID"

export class UserCreatedEvent extends DomainEvent {
  constructor(aggregateId: UniqueEntityID) {
    super(aggregateId)
  }

  eventName(): string {
    return "user.created"
  }
}
