import { AggregateRoot } from "../../shared/domain/AggregateRoot"
import type { UniqueEntityID } from "../../shared/domain/UniqueEntityID"
import { Result } from "../../shared/domain/Result"
import { SaleCreatedEvent } from "./events/SaleCreatedEvent"
import type { CustomerName } from "./CustomerName"

interface SaleProps {
  employeeId: UniqueEntityID
  productId: UniqueEntityID
  customerName: CustomerName
  saleDate: Date
  createdAt?: Date
  updatedAt?: Date
}

export class Sale extends AggregateRoot<SaleProps> {
  private constructor(props: SaleProps, id?: UniqueEntityID) {
    super(props, id)
  }

  get employeeId(): UniqueEntityID {
    return this.props.employeeId
  }

  get productId(): UniqueEntityID {
    return this.props.productId
  }

  get customerName(): CustomerName {
    return this.props.customerName
  }

  get saleDate(): Date {
    return this.props.saleDate
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt
  }

  get updatedAt(): Date | undefined{
    return this.props.updatedAt
  }

  public static create(
    employeeId: UniqueEntityID,
    productId: UniqueEntityID,
    customerName: CustomerName,
    id?: UniqueEntityID,
  ): Result<Sale> {
    if (!employeeId) {
      return Result.fail<Sale>("El ID del empleado es requerido")
    }

    if (!productId) {
      return Result.fail<Sale>("El ID del producto es requerido")
    }

    const sale = new Sale(
      {
        employeeId,
        productId,
        customerName,
        saleDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      id,
    )

    const isNewSale = !id
    if (isNewSale) {
      sale.addDomainEvent(new SaleCreatedEvent(sale.id))
    }

    return Result.ok<Sale>(sale)
  }
}
