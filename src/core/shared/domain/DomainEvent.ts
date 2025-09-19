import { UniqueEntityID } from "./UniqueEntityID"

// Clase abstracta que representa un Evento de Dominio en DDD
export abstract class DomainEvent {
  // ID único del evento (generado automáticamente)
  public readonly eventId: string
  
  // ID de la entidad/agregado que generó el evento
  public readonly aggregateId: UniqueEntityID
  
  // Fecha/hora en que ocurrió el evento
  public readonly occurredOn: Date

  // Constructor que recibe el ID del agregado relacionado
  constructor(aggregateId: UniqueEntityID) {
    this.eventId = new UniqueEntityID().toString() // Genera un ID único para el evento
    this.aggregateId = aggregateId // Almacena el ID del agregado que disparó el evento
    this.occurredOn = new Date() // Registra el momento exacto del evento
  }

  // Método abstracto que debe ser implementado por eventos concretos
  // Devuelve un nombre identificativo para el tipo de evento
  abstract eventName(): string
}