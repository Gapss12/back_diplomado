import { Entity } from "./Entity"
import type { DomainEvent } from "./DomainEvent"

// Clase abstracta que representa una Raíz de Agregado (Aggregate Root) en DDD
// El genérico <T> representa el tipo del ID de la entidad
export abstract class AggregateRoot<T> extends Entity<T> {
  
  // Array privado para almacenar los eventos de dominio
  private _domainEvents: DomainEvent[] = []

  // Getter público para acceder a los eventos (solo lectura)
  get domainEvents(): DomainEvent[] {
    return this._domainEvents
  }

  // Método protegido para agregar nuevos eventos al agregado
  // Solo clases hijas pueden usar este método
  protected addDomainEvent(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent)
  }

  // Método público para limpiar todos los eventos después de ser procesados
  public clearEvents(): void {
    this._domainEvents = []
  }
}