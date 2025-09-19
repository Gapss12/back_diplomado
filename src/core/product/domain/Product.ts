import { AggregateRoot } from "@shared/domain/AggregateRoot"
import type { UniqueEntityID } from "@shared/domain/UniqueEntityID"
import { Result } from "@shared/domain/Result"
import type { Price } from "./Price"

interface ProductProps {
  name: string
  imageUrl: string
  price: Price
  createdAt: Date
  updatedAt: Date
}

export class Product extends AggregateRoot<ProductProps> {
  private constructor(props: ProductProps, id?: UniqueEntityID) {
    super(props, id)
  }

  get name(): string {
    return this.props.name
  }

  get imageUrl(): string {
    return this.props.imageUrl
  }

  get price(): Price {
    return this.props.price
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  public static create(name: string, imageUrl: string, price: Price, id?: UniqueEntityID): Result<Product> {
    if (!name || name.trim().length === 0) {
      return Result.fail<Product>("El nombre del producto es requerido")
    }

    if (!imageUrl || imageUrl.trim().length === 0) {
      return Result.fail<Product>("La descripción del producto es requerida")
    }

    const product = new Product(
      {
        name,
        imageUrl,
        price,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      id,
    )

    return Result.ok<Product>(product)
  }
}
